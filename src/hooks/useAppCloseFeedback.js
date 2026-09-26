import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAppCloseFeedback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!localStorage.getItem('feedbackSubmitted')) {
        e.preventDefault();
        e.returnValue = '';
        navigate('/feedback');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !localStorage.getItem('feedbackSubmitted')) {
        navigate('/feedback');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  const handleFeedbackSubmit = async ({ rating, feedback }) => {
    try {
      // Here you would typically send the feedback to your backend
      console.log('Feedback submitted:', { rating, feedback });
      
      // Mark feedback as submitted
      localStorage.setItem('feedbackSubmitted', 'true');
      
      // Close the feedback form
      navigate('/feedback');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return {
    handleFeedbackSubmit
  };
};

export default useAppCloseFeedback; 