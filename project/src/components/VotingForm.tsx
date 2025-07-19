import React, { useState } from 'react';
import { CheckCircle, User, Mail, MapPin, Send } from 'lucide-react';
import { VotingCategory, VoteData } from '../types/voting';

interface VotingFormProps {
  categories: VotingCategory[];
  onVoteSubmit: (vote: VoteData) => void;
}

const VotingForm: React.FC<VotingFormProps> = ({ categories, onVoteSubmit }) => {
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [voterInfo, setVoterInfo] = useState({
    name: '',
    email: '',
    district: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVoteSelect = (categoryId: string, optionId: string) => {
    setSelectedVotes(prev => ({
      ...prev,
      [categoryId]: optionId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voterInfo.name || !voterInfo.email || !voterInfo.district) {
      alert('Please fill in all voter information fields.');
      return;
    }

    if (Object.keys(selectedVotes).length === 0) {
      alert('Please select at least one vote option.');
      return;
    }

    Object.entries(selectedVotes).forEach(([categoryId, optionId]) => {
      const voteData: VoteData = {
        id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        categoryId,
        optionId,
        voterInfo,
        timestamp: new Date()
      };
      onVoteSubmit(voteData);
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedVotes({});
      setVoterInfo({ name: '', email: '', district: '' });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Vote Submitted Successfully!</h2>
        <p className="text-lg text-gray-600 mb-8">Thank you for participating in the democratic process.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-blue-800 font-medium">Your votes have been securely recorded and will be counted in the final tally.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Cast Your Vote</h2>
        <p className="text-lg text-gray-600">Make your voice heard in this democratic process</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Voter Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Voter Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={voterInfo.name}
                onChange={(e) => setVoterInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={voterInfo.email}
                onChange={(e) => setVoterInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                District *
              </label>
              <select
                value={voterInfo.district}
                onChange={(e) => setVoterInfo(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Select District</option>
                <option value="north">North District</option>
                <option value="south">South District</option>
                <option value="east">East District</option>
                <option value="west">West District</option>
                <option value="central">Central District</option>
              </select>
            </div>
          </div>
        </div>

        {/* Voting Categories */}
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
            <p className="text-gray-600 mb-6">{category.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleVoteSelect(category.id, option.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedVotes[category.id] === option.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{option.name}</h4>
                      <p className="text-sm text-gray-600">{option.party}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedVotes[category.id] === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedVotes[category.id] === option.id && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Send className="h-5 w-5" />
            <span>Submit All Votes</span>
          </button>
          <p className="text-sm text-gray-500 mt-4">
            By submitting, you confirm that your vote choices are accurate and final.
          </p>
        </div>
      </form>
    </div>
  );
};

export default VotingForm;