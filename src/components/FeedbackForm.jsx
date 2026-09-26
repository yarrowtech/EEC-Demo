import React, { useState } from 'react';
import { Star } from 'lucide-react';

const FeedbackForm = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 w-full max-w-md ">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">We'd Love Your Feedback!</h2>
        <p className="text-gray-600 mb-6">Please take a moment to rate your experience.</p>
        
        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Feedback Text Area */}
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              id="feedback"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Submit Feedback
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm; 