type ProfileMilestone = {
  hidden?: boolean;
  year: string;
  title: string;
  description: string;
};

type ProfileTrajectoryItem = {
  hidden?: boolean;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  description: string;
  interests: string;
  learning: string;
  personalInterests: string[];
  trajectory: ProfileTrajectoryItem[];
  milestones: ProfileMilestone[];
};
