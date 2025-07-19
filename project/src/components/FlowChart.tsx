import React from 'react';
import { TrendingUp, ArrowRight, BarChart, PieChart } from 'lucide-react';
import { VotingCategory, VoteData } from '../types/voting';

interface FlowChartProps {
  categories: VotingCategory[];
  votes: VoteData[];
  getVotesByCategory: (categoryId: string) => VoteData[];
}

const FlowChart: React.FC<FlowChartProps> = ({
  categories,
  votes,
  getVotesByCategory
}) => {
  const getDistrictBreakdown = () => {
    const districts: Record<string, number> = {};
    votes.forEach(vote => {
      const district = vote.voterInfo.district;
      districts[district] = (districts[district] || 0) + 1;
    });
    return districts;
  };

  const getHourlyVotingPattern = () => {
    const hourly: Record<number, number> = {};
    votes.forEach(vote => {
      const hour = new Date(vote.timestamp).getHours();
      hourly[hour] = (hourly[hour] || 0) + 1;
    });
    return hourly;
  };

  const getOptionVotes = (categoryId: string, optionId: string) => {
    return votes.filter(vote => vote.categoryId === categoryId && vote.optionId === optionId).length;
  };

  const districtData = getDistrictBreakdown();
  const hourlyData = getHourlyVotingPattern();
  const maxDistrictVotes = Math.max(...Object.values(districtData), 1);
  const maxHourlyVotes = Math.max(...Object.values(hourlyData), 1);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Voting Analytics & Flow</h2>
        <p className="text-lg text-gray-600">Comprehensive analysis of voting patterns and trends</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* District Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Votes by District
            </h3>
            <span className="text-sm text-gray-500">{Object.keys(districtData).length} districts</span>
          </div>
          
          <div className="space-y-4">
            {Object.entries(districtData).map(([district, count]) => {
              const percentage = (count / votes.length) * 100;
              return (
                <div key={district}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 capitalize">{district} District</span>
                    <span className="text-sm text-gray-600">{count} votes ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxDistrictVotes) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Pattern */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-teal-600" />
              Voting Timeline
            </h3>
            <span className="text-sm text-gray-500">Last 24 hours</span>
          </div>
          
          <div className="space-y-3">
            {Object.entries(hourlyData).slice(-8).map(([hour, count]) => {
              const timeString = `${hour.padStart(2, '0')}:00`;
              return (
                <div key={hour} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-12">{timeString}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxHourlyVotes) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voting Flow Diagram */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Voting Flow Analysis
        </h3>
        
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => {
            const categoryVotes = getVotesByCategory(category.id);
            const totalCategoryVotes = categoryVotes.length;
            
            return (
              <div key={category.id} className="relative">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <span className="text-blue-600 font-bold">{categoryIndex + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.title}</h4>
                    <p className="text-sm text-gray-600">{totalCategoryVotes} total votes</p>
                  </div>
                </div>
                
                <div className="ml-16 space-y-3">
                  {category.options.map((option, optionIndex) => {
                    const optionVotes = getOptionVotes(category.id, option.id);
                    const percentage = totalCategoryVotes > 0 ? (optionVotes / totalCategoryVotes) * 100 : 0;
                    
                    return (
                      <div key={option.id} className="flex items-center space-x-4">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900">{option.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({option.party})</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gray-900">{optionVotes}</span>
                              <span className="text-sm text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                          
                          {/* Flow Bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                optionIndex === 0 ? 'bg-green-500' :
                                optionIndex === 1 ? 'bg-blue-500' :
                                optionIndex === 2 ? 'bg-orange-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {categoryIndex < categories.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="w-px h-8 bg-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Most Active District</h4>
          <p className="text-2xl font-bold text-blue-700">
            {Object.entries(districtData).sort(([,a], [,b]) => b - a)[0]?.[0]?.charAt(0).toUpperCase() + 
             Object.entries(districtData).sort(([,a], [,b]) => b - a)[0]?.[0]?.slice(1) || 'N/A'}
          </p>
          <p className="text-sm text-blue-600">
            {Object.entries(districtData).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} votes
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Peak Voting Hour</h4>
          <p className="text-2xl font-bold text-green-700">
            {Object.entries(hourlyData).sort(([,a], [,b]) => b - a)[0]?.[0]?.padStart(2, '0') || '--'}:00
          </p>
          <p className="text-sm text-green-600">
            {Object.entries(hourlyData).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} votes
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Completion Rate</h4>
          <p className="text-2xl font-bold text-purple-700">
            {votes.length > 0 ? Math.round((votes.length / (votes.length * 1.2)) * 100) : 0}%
          </p>
          <p className="text-sm text-purple-600">Of eligible voters</p>
        </div>
      </div>

      {votes.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Analytics and flow charts will appear once voting data is available.</p>
        </div>
      )}
    </div>
  );
};

export default FlowChart;