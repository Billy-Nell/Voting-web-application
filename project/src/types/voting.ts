export interface VoteOption {
  id: string;
  name: string;
  party: string;
}

export interface VotingCategory {
  id: string;
  title: string;
  description: string;
  options: VoteOption[];
}

export interface VoteData {
  id: string;
  categoryId: string;
  optionId: string;
  voterInfo: {
    name: string;
    email: string;
    district: string;
  };
  timestamp: Date;
}