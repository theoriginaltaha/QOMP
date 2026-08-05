export interface Meeting {
  id: string;
  title: string;
  customerId: string;
  environmentId?: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Planned' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  outcome?: string;
  organizer: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  customerId: string;
  environmentId?: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Waiting Customer' | 'Blocked' | 'Done';
}

export interface Renewal {
  id: string;
  customerId: string;
  contractValue: string;
  renewalDate: string;
  status: 'Upcoming' | 'In Progress' | 'Renewed' | 'Cancelled' | 'Lost';
  owner: string;
}

export interface SuccessPlan {
  id: string;
  title: string;
  customerId: string;
  status: 'Active' | 'Completed' | 'On Hold';
  targetDate: string;
  progress: number;
}
