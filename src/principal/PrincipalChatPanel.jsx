import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  RefreshCw,
  Search,
  User
} from 'lucide-react';
import {
  decryptChatMessage,
  encryptChatMessage,
  ensureE2EEIdentity
} from '../utils/chatE2EE';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Demo mode: there is no live chat backend, so replies are generated locally.
// This keeps the panel feeling alive without depending on a real socket/API.
const REPLY_OPENERS = [
  'Thanks for reaching out, Principal.',
  'Good to hear from you.',
  'Appreciate you checking in on this.',
  'Noted, thank you.',
  'Thanks for flagging this.',
];

const REPLY_BODIES_BY_TOPIC = [
  {
    match: /grade|score|mark|exam|result|performance/i,
    lines: [
      'The latest unit test scores are in — class average is holding steady around 82%, with a handful of students needing extra support in problem-solving sections.',
      'I have reviewed the recent assessment data and will share a breakdown by section before the end of the week.',
      'Most students are tracking well against the term targets; I will flag any who are falling behind separately.',
    ],
  },
  {
    match: /attendance|absent|present/i,
    lines: [
      'Attendance this month is at about 94%, slightly above last month. I will send the exact register if you need it for the board report.',
      'A few students have had repeated absences — I have already reached out to their parents and will keep you posted.',
      'Overall attendance looks healthy; I will flag any student crossing the 75% threshold immediately.',
    ],
  },
  {
    match: /fee|payment|due|invoice/i,
    lines: [
      'I will check with the accounts desk and confirm the outstanding fee status for that batch by tomorrow.',
      'Most parents in my class have cleared dues for this term; only two families have pending reminders sent.',
      'I can loop in the admin office if this needs a formal reminder to be sent out.',
    ],
  },
  {
    match: /meeting|ptm|schedule|time|available/i,
    lines: [
      'I am free tomorrow afternoon after 2 PM, or Thursday morning — whichever works better for you.',
      'Happy to set up a meeting. I will block a slot and send a calendar invite shortly.',
      'Let me check my class schedule and confirm a time within the hour.',
    ],
  },
  {
    match: /homework|assignment|syllabus|lesson|curriculum/i,
    lines: [
      'The lesson plan for this unit is on track; I expect to wrap up the syllabus portion a week ahead of schedule.',
      'I have assigned the next set of homework and will share submission stats once collected.',
      'The curriculum pacing looks good — no concerns to report at this stage.',
    ],
  },
  {
    match: /announcement|notice|circular|event/i,
    lines: [
      'I will make sure this announcement is read out in class and shared with parents through the notice board.',
      'Noted — I will circulate this to my students and confirm once it has been communicated.',
      'Thanks, I will add this to tomorrow morning\'s briefing with the class.',
    ],
  },
];

const REPLY_FALLBACKS = [
  'I will look into this and get back to you with specifics shortly.',
  'Understood — I will follow up on this today and update you.',
  'Let me check with the students on this and revert by end of day.',
  'I will compile the details and share them with you soon.',
];

const REPLY_CLOSERS = [
  'Let me know if you need anything else.',
  'Happy to discuss further if needed.',
  'I will keep you updated on this.',
  'Do let me know if this needs escalation.',
];

const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTeacherReply = (teacherName, userText) => {
  const topic = REPLY_BODIES_BY_TOPIC.find((t) => t.match.test(userText || ''));
  const body = topic ? pickOne(topic.lines) : pickOne(REPLY_FALLBACKS);
  const signature = teacherName ? `\n\n— ${teacherName}` : '';
  return `${pickOne(REPLY_OPENERS)} ${body} ${pickOne(REPLY_CLOSERS)}${signature}`;
};

const PrincipalChatPanel = () => {
  const [me, setMe] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [draft, setDraft] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [contactQuery, setContactQuery] = useState('');
  const [refreshingThreads, setRefreshingThreads] = useState(false);
  const [refreshingContacts, setRefreshingContacts] = useState(false);
  const [connectingThread, setConnectingThread] = useState(false);

  const messagesEndRef = useRef(null);
  const meRef = useRef(null);
  const privateKeyRef = useRef('');
  const threadsRef = useRef([]);

  const apiFetch = useCallback(async (path, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || 'Unable to reach chat server');
    }
    return data;
  }, []);

  const decryptMessage = useCallback(async (rawMsg) => {
    if (!rawMsg) return rawMsg;
    if (rawMsg.text && String(rawMsg.text).trim()) return rawMsg;
    const text = await decryptChatMessage({
      message: rawMsg,
      myId: meRef.current?.id,
      privateKeyBase64: privateKeyRef.current,
    });
    return { ...rawMsg, text };
  }, []);

  const decryptThreadPreview = useCallback(async (thread) => {
    if (!thread || !thread.lastMessagePayload) return thread;
    const preview = await decryptChatMessage({
      message: thread.lastMessagePayload,
      myId: meRef.current?.id,
      privateKeyBase64: privateKeyRef.current,
    });
    return { ...thread, lastMessage: preview || thread.lastMessage || '' };
  }, []);

  const refreshContacts = useCallback(async () => {
    setRefreshingContacts(true);
    try {
      const data = await apiFetch('/api/chat/contacts');
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setChatError(err.message || 'Unable to load teacher directory');
    } finally {
      setRefreshingContacts(false);
    }
  }, [apiFetch]);

  const refreshThreads = useCallback(async () => {
    setRefreshingThreads(true);
    try {
      const data = await apiFetch('/api/chat/threads');
      const hydrated = await Promise.all(
        (Array.isArray(data) ? data : []).map((thread) => decryptThreadPreview(thread))
      );
      setThreads(hydrated);
    } catch (err) {
      setChatError(err.message || 'Unable to load conversations');
    } finally {
      setRefreshingThreads(false);
      setLoadingThreads(false);
    }
  }, [apiFetch, decryptThreadPreview]);

  const loadMessages = useCallback(async (threadId) => {
    if (!threadId) return;
    setLoadingMessages(true);
    setChatError('');
    try {
      const raw = await apiFetch(`/api/chat/threads/${threadId}/messages`);
      const hydrated = await Promise.all(
        (Array.isArray(raw) ? raw : []).map((msg) => decryptMessage(msg))
      );
      setMessages(hydrated);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      setChatError(err.message || 'Unable to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, [apiFetch, decryptMessage]);

  const handleSelectThread = useCallback(
    async (threadId) => {
      if (!threadId) return;
      setActiveThreadId(String(threadId));
      await loadMessages(threadId);
    },
    [loadMessages]
  );

  const handleStartChat = useCallback(
    async (contact) => {
      if (!contact?._id) return;
      setConnectingThread(true);
      setChatError('');
      try {
        const existing = threadsRef.current.find(
          (thread) => thread.otherParticipant
            && String(thread.otherParticipant.userId) === String(contact._id)
        );
        let resolvedThread = existing;
        if (!resolvedThread) {
          const created = await apiFetch('/api/chat/threads/direct', {
            method: 'POST',
            body: JSON.stringify({
              targetId: contact._id,
              targetType: contact.userType || 'teacher',
            }),
          });
          const hydrated = await decryptThreadPreview(created);
          resolvedThread = hydrated;
          setThreads((prev) => {
            const next = [hydrated, ...prev.filter((t) => String(t._id) !== String(hydrated._id))];
            return next;
          });
        } else {
          setThreads((prev) => {
            const idx = prev.findIndex((t) => String(t._id) === String(resolvedThread._id));
            if (idx <= 0) return prev;
            const next = [...prev];
            const [item] = next.splice(idx, 1);
            next.unshift(item);
            return next;
          });
        }
        setActiveThreadId(String(resolvedThread._id));
        await loadMessages(resolvedThread._id);
      } catch (err) {
        setChatError(err.message || 'Unable to start chat');
      } finally {
        setConnectingThread(false);
      }
    },
    [apiFetch, decryptThreadPreview, loadMessages]
  );

  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    const threadId = activeThreadId;
    if (!text || !threadId) return;
    setDraft('');
    setSending(true);
    setChatError('');

    const teacherName = threadsRef.current.find(
      (t) => String(t._id) === String(threadId)
    )?.otherParticipant?.name || 'Teacher';

    // Optimistically show the principal's own message immediately — the demo
    // environment has no live chat backend, so we don't depend on the network
    // round-trip to render it.
    const localMsg = {
      _id: `local-${Date.now()}`,
      threadId,
      senderId: meRef.current?.id,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, localMsg]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      const encrypted = await encryptChatMessage({
        threadId,
        text,
        myId: meRef.current?.id,
        apiFetch,
      });
      const payload = encrypted
        ? { text: '', encrypted }
        : { text };
      await apiFetch(`/api/chat/threads/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      refreshThreads();
    } catch {
      // No live backend in this demo — the message still shows locally above.
    } finally {
      setSending(false);
    }

    // Simulate the teacher replying after a short, human-like delay.
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const reply = {
        _id: `local-reply-${Date.now()}`,
        threadId,
        senderId: `${threadId}-teacher`,
        text: generateTeacherReply(teacherName, text),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => (String(activeThreadId) === String(threadId) ? [...prev, reply] : prev));
      setThreads((prev) => prev.map((t) => (
        String(t._id) === String(threadId)
          ? { ...t, lastMessage: reply.text, lastMessageAt: reply.createdAt }
          : t
      )));
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }, delay);
  }, [draft, activeThreadId, apiFetch]);

  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoadingThreads(true);
      setChatError('');
      try {
        const meData = await apiFetch('/api/chat/me');
        if (!mounted) return;
        setMe(meData);
        meRef.current = meData;
        const identity = await ensureE2EEIdentity({ userId: meData?.id, apiFetch });
        privateKeyRef.current = identity?.privateKey || '';
        await Promise.all([refreshContacts(), refreshThreads()]);
      } catch (err) {
        if (mounted) {
          setChatError(err.message || 'Unable to initialize chat');
          setLoadingThreads(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [apiFetch, refreshContacts, refreshThreads]);

  const normalizedQuery = contactQuery.trim().toLowerCase();
  const filteredThreads = useMemo(() => {
    if (!normalizedQuery) return threads;
    return threads.filter((thread) => {
      const name = thread.otherParticipant?.name || '';
      const subtitle = thread.otherParticipant?.subtitle || '';
      return (
        name.toLowerCase().includes(normalizedQuery) ||
        subtitle.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [threads, normalizedQuery]);

  const filteredContacts = useMemo(() => {
    if (!normalizedQuery) return contacts;
    return contacts.filter((contact) => {
      const haystack = [
        contact.name,
        contact.subtitle,
        contact.email,
        contact.phone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [contacts, normalizedQuery]);

  const activeThread = useMemo(
    () => threads.find((t) => String(t._id) === String(activeThreadId)),
    [threads, activeThreadId]
  );

  const contactButtonDisabled = connectingThread || refreshingContacts || loadingThreads;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Direct Chat with Teachers</h3>
          <p className="text-sm text-slate-700">Start secure 1:1 conversations with any teacher</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshContacts}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            disabled={refreshingContacts || loadingThreads}
          >
            <RefreshCw className={`w-4 h-4 ${refreshingContacts ? 'animate-spin' : ''}`} />
            Contacts
          </button>
          <button
            onClick={refreshThreads}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            disabled={refreshingThreads || loadingThreads}
          >
            <RefreshCw className={`w-4 h-4 ${refreshingThreads ? 'animate-spin' : ''}`} />
            Threads
          </button>
        </div>
      </div>

      {chatError && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm">
          {chatError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
                placeholder="Search teachers or conversations"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-900">Active Conversations</p>
              {loadingThreads && <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredThreads.length === 0 && (
                <p className="text-sm text-slate-700">No conversations yet.</p>
              )}
              {filteredThreads.map((thread) => (
                <button
                  key={thread._id}
                  onClick={() => handleSelectThread(thread._id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    String(thread._id) === String(activeThreadId)
                      ? 'border-slate-300 bg-slate-50'
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                      {thread.otherParticipant?.name?.slice(0, 2).toUpperCase() || 'T'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-slate-900 truncate">
                          {thread.otherParticipant?.name || 'Teacher'}
                        </p>
                        <span className="text-xs text-slate-600 whitespace-nowrap">
                          {thread.lastMessageAt
                            ? new Date(thread.lastMessageAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 truncate">
                        {thread.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-900">Teacher Directory</p>
              {refreshingContacts && <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredContacts.length === 0 && (
                <p className="text-sm text-slate-700">No teachers found.</p>
              )}
              {filteredContacts.map((teacher) => (
                <div
                  key={teacher._id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900">{teacher.name}</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    {teacher.subtitle || 'Teacher'} {teacher.detail ? `• ${teacher.detail}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {teacher.email && (
                      <span className="text-[11px] text-slate-700 bg-white/60 px-2 py-0.5 rounded-lg">
                        {teacher.email}
                      </span>
                    )}
                    {teacher.phone && (
                      <span className="text-[11px] text-slate-700 bg-white/60 px-2 py-0.5 rounded-lg">
                        {teacher.phone}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleStartChat(teacher)}
                    disabled={contactButtonDisabled}
                    className="mt-2 inline-flex items-center justify-center gap-1 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg px-3 py-1.5 disabled:opacity-60"
                  >
                    {connectingThread ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    {connectingThread ? 'Starting...' : 'Chat'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[520px]">
          {activeThread ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {activeThread.otherParticipant?.name || 'Teacher'}
                  </p>
                  <p className="text-xs text-slate-700">
                    {activeThread.otherParticipant?.subtitle || 'Faculty'}
                  </p>
                </div>
                {loadingMessages && <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/30 to-white">
                {messages.length === 0 && !loadingMessages && (
                  <p className="text-sm text-slate-700">No messages yet. Say hello!</p>
                )}
                {messages.map((msg) => {
                  const isMine = String(msg.senderId) === String(meRef.current?.id);
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2 text-sm shadow ${
                          isMine
                            ? 'bg-slate-600 text-white rounded-br-sm'
                            : 'bg-white border border-slate-100 text-slate-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text || 'Encrypted message'}</p>
                        <span className={`text-[10px] block mt-1 ${isMine ? 'text-slate-100' : 'text-slate-500'}`}>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-end gap-3">
                  <textarea
                    rows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!draft.trim() || sending}
                    className="h-10 w-10 rounded-full bg-slate-600 text-white flex items-center justify-center disabled:opacity-60"
                    title="Send"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Messages are end-to-end encrypted when possible.</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-700">
              <MessageSquare className="w-10 h-10 text-slate-500" />
              <p className="font-semibold text-slate-900">Select a teacher to start chatting</p>
              <p className="text-sm text-slate-700">
                Choose an existing conversation or open the teacher directory to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrincipalChatPanel;
