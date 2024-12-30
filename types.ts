import { ReactNode } from 'react'; 




export interface UserAttributes {
  role: string;
  department: string;
  clearance_level: string;
  trust_score: number;
  id:string;
}

export interface Request {
  id: string;
  resource: string;
  action: string;
  timestamp: string;
  status: 'Approved' | 'Denied';
}

export interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface DashboardPageProps {
  userAttributes: UserAttributes;
  previousRequests: Request[];
}

export interface AttributesPageProps {
  userAttributes: UserAttributes;
}

export interface PreviousRequestsPageProps {
  requests: Request[];
}

export interface NewRequestPageState {
  resource: string;
  action: string;
  response: 'Approved' | 'Denied' | null;
}


export interface UserInfo {
  role: string;
  department: string;
  clearance_level: string;
  trust_score:number;
  id:string;
}

export interface NewRequestPageProps {
    userAttributes: UserAttributes;
  }