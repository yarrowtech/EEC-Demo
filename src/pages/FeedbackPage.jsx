import React, { useState } from 'react';
import { Star, MessageCircle, Users, Phone, School, User, Book, Mail } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [role, setRole] = useState('Student');
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promoConsent, setPromoConsent] = useState('');
  const navigate = useNavigate();

  const isStudent = role === 'Student';
  const isParent = role === 'Parent';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promoConsent) {
      alert('Please indicate if you are willing to allow promotional use.');
      return;
    }
    if (isStudent && !agreed) {
      alert('You must agree to the Terms & Conditions.');
      return;
    }
    try {
      // In a real app, you would send this to your backend
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          name,
          schoolName,
          phone,
          email,
          class: selectedClass,
          consent: promoConsent,
          rating,
          feedback,
        }),
      })
      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }
      const data = await res.json();
      console.log(data)
      navigate('./thank-you');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (roleValue) => {
    switch(roleValue) {
      case 'Student': return <User className="w-4 h-4" />;
      case 'Parent': return <Users className="w-4 h-4" />;
      case 'Teacher': return <School className="w-4 h-4" />;
      case 'Admin': return <School className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen w-screen lg:w-[60%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-center absolute top-0 left-1/2 -translate-x-1/2 overflow-y-scroll ">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative top-4/5 w-full max-w-md mx-auto bg-white backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-400 p-4 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header with icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-3 sm:mb-4 shadow-lg">
            <MessageCircle className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            We'd Love Your Feedback!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            Your feedback helps us improve our services and provide a better experience for everyone.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Role Dropdown */}
          <div className="group">
            <label htmlFor="role" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              {getRoleIcon(role)}
              <span className="ml-2">I am a</span>
            </label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                required
              >
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="group">
            <label htmlFor="name" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <User className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="ml-2">Name</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* School Name */}
          <div className="group">
            <label htmlFor="schoolName" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <School className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="ml-2">School Name</span>
            </label>
            <input
              id="schoolName"
              type="text"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
              placeholder="Enter your school name"
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="group">
            <label htmlFor="phone" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="ml-2">Phone Number</span>
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Email (for everyone) */}
          <div className="group">
            <label htmlFor="email" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="ml-2">Email</span>
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Class Dropdown (for Student and Parent) */}
          {(isStudent || isParent) && (
            <div className="group">
              <label htmlFor="class" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <Book className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="ml-2">Class</span>
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Select class</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
          )}

          {/* Star Rating */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-yellow-100">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <label className="text-base sm:text-lg font-semibold text-gray-700 text-center">
                How would you rate your experience?
              </label>
              <div className="flex space-x-1 sm:space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transform transition-all duration-200 hover:scale-110 sm:hover:scale-125 focus:scale-110 sm:focus:scale-125 p-1"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-500 drop-shadow-sm'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="text-xs sm:text-sm text-gray-600 font-medium animate-fade-in">
                  {rating === 5 ? '🌟 Excellent!' : rating === 4 ? '😊 Great!' : rating === 3 ? '👍 Good!' : rating === 2 ? '😐 Fair' : '😞 Poor'}
                </div>
              )}
            </div>
          </div>

          {/* Feedback Text Area */}
          <div className="group">
            <label htmlFor="feedback" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="ml-2">Additional Comments</span>
            </label>
            <textarea
              id="feedback"
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400 resize-none"
              placeholder="Tell us about your experience... What did you like? What could we improve?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Promotional Use Consent Dropdown */}
          <div className="group">
            <label htmlFor="promoConsent" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Are you willing to add this comment and video for our promotional use?
            </label>
            <select
              id="promoConsent"
              value={promoConsent}
              onChange={e => setPromoConsent(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Terms & Conditions (for all users) */}
          <div className="flex items-start space-x-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              required
            />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
              I agree to the Terms & Conditions and Privacy Policy:
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-yellow-500 hover:to-orange-600 transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <span>{!isLoading ? "Submit Feedback" : "Sending..."}</span>
              <svg className="w-4 sm:w-5 h-4 sm:h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>

        {/* Footer note */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your feedback is valuable to us and helps improve our services
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;