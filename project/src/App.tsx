import React, { useState } from 'react';
import { Vote } from 'lucide-react';
import VotingForm from './components/VotingForm';
import ResultsDisplay from './components/ResultsDisplay';
import FlowChart from './components/FlowChart';
import { VoteData, VotingCategory } from './types/voting';

const votingCategories: VotingCategory[] = [
  {
    id: 'president',
    title: 'Presidential Election',
    description: 'Choose your preferred candidate for President',
    options: [
      { id: 'candidate-a', name: 'Alex Johnson', party: 'Progressive Party' },
      { id: 'candidate-b', name: 'Sarah Chen', party: 'Unity Alliance' },
      { id: 'candidate-c', name: 'Michael Torres', party: 'Reform Coalition' },
      { id: 'candidate-d', name: 'Emma Williams', party: 'Green Future' }
    ]
  },
  {
    id: 'mayor',
    title: 'Mayor Election',
    description: 'Select your choice for City Mayor',
    options: [
      { id: 'mayor-a', name: 'David Park', party: 'Independent' },
      { id: 'mayor-b', name: 'Lisa Rodriguez', party: 'Citizens First' },
      { id: 'mayor-c', name: 'James Mitchell', party: 'Progress Alliance' }
    ]
  },
  {
    id: 'proposition',
    title: 'Education Funding Proposition',
    description: 'Should the city increase education funding by 15%?',
    options: [
      { id: 'prop-yes', name: 'Yes - Support Education', party: 'Pro-Education' },
      { id: 'prop-no', name: 'No - Maintain Current', party: 'Fiscal Conservative' }
    ]
  }
];

function App() {
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [activeTab, setActiveTab] = useState<'vote' | 'results' | 'analytics'>('vote');

  const handleVoteSubmit = (newVote: VoteData) => {
    setVotes(prevVotes => [...prevVotes, newVote]);
  };

  const getTotalVotes = () => votes.length;

  const getVotesByCategory = (categoryId: string) => {
    return votes.filter(vote => vote.categoryId === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VotePortal</h1>
                <p className="text-sm text-gray-500">Secure Digital Voting</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Votes Cast</p>
              <p className="text-2xl font-bold text-blue-600">{getTotalVotes()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'vote', label: 'Cast Vote', icon: '🗳️' },
              { id: 'results', label: 'Live Results', icon: '📊' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'vote' && (
          <VotingForm 
            categories={votingCategories}
            onVoteSubmit={handleVoteSubmit}
          />
        )}
        
        {activeTab === 'results' && (
          <ResultsDisplay 
            categories={votingCategories}
            votes={votes}
            getVotesByCategory={getVotesByCategory}
          />
        )}
        
        {activeTab === 'analytics' && (
          <FlowChart 
            categories={votingCategories}
            votes={votes}
            getVotesByCategory={getVotesByCategory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2025 VotePortal. Secure, transparent, and accessible voting for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;