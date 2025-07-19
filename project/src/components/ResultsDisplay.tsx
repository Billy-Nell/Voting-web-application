import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { VotingCategory, VoteData } from '../types/voting';

interface ResultsDisplayProps {
  categories: VotingCategory[];
  votes: VoteData[];
  getVotesByCategory: (categoryId: string) => VoteData[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  categories,
  votes,
  getVotesByCategory
}) => {
  const getOptionVotes = (categoryId: string, optionId: string) => {
    return votes.filter(vote => vote.categoryId === categoryId && vote.optionId === optionId);
  };

  const getCategoryResults = (category: VotingCategory) => {
    const categoryVotes = getVotesByCategory(category.id);
    const totalVotes = categoryVotes.length;
    
    return category.options.map(option => {
      const optionVotes = getOptionVotes(category.id, option.id);
      const percentage = totalVotes > 0 ? (optionVotes.length / totalVotes) * 100 : 0;
      
      return {
        ...option,
        votes: optionVotes.length,
        percentage: Math.round(percentage * 10) / 10
      };
    }).sort((a, b) => b.votes - a.votes);
  };

  const getLeadingCandidate = (category: VotingCategory) => {
    const results = getCategoryResults(category);
    return results.length > 0 ? results[0] : null;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Election Results</h2>
        <p className="text-lg text-gray-600">Real-time vote counting and analysis</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-3xl font-bold text-blue-600">{votes.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-teal-600">{categories.length}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Participation</p>
              <p className="text-3xl font-bold text-green-600">
                {votes.length > 0 ? Math.round((votes.length / 1000) * 100) : 0}%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Results */}
      <div className="space-y-8">
        {categories.map((category) => {
          const results = getCategoryResults(category);
          const leading = getLeadingCandidate(category);
          const totalCategoryVotes = getVotesByCategory(category.id).length;

          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600">{totalCategoryVotes} votes cast</p>
                </div>
                {leading && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Leading</p>
                    <p className="font-semibold text-green-600">{leading.name}</p>
                    <p className="text-sm text-green-600">{leading.percentage}%</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={result.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.name}</h4>
                          <p className="text-sm text-gray-600">{result.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{result.votes} votes</p>
                        <p className="text-sm text-gray-600">{result.percentage}%</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-orange-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {votes.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Votes Yet</h3>
          <p className="text-gray-600">Results will appear here once voting begins.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;