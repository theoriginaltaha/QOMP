import type { Meeting, Task, Renewal, SuccessPlan } from '../models/types';

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q3 Business Review',
    customerId: '1', // GEMS
    type: 'QBR',
    date: '2026-07-20',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    status: 'Scheduled',
    organizer: 'Sara Ahmed'
  },
  {
    id: '2',
    title: 'Platform Onboarding',
    customerId: '2', // MOE
    type: 'Onboarding',
    date: '2026-07-25',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    status: 'Planned',
    organizer: 'Nour El Din'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Send API Documentation',
    description: 'Customer requested the latest API docs for integration.',
    customerId: '1',
    assignee: 'Sara Ahmed',
    priority: 'High',
    dueDate: '2026-07-21',
    status: 'To Do'
  },
  {
    id: '2',
    title: 'Follow up on Training',
    description: 'Check if the admin team completed the LMS training.',
    customerId: '3', // Al-Noor
    assignee: 'Layla Saad',
    priority: 'Medium',
    dueDate: '2026-07-22',
    status: 'Waiting Customer'
  }
];

export const mockRenewals: Renewal[] = [
  {
    id: '1',
    customerId: '1',
    contractValue: '$150,000',
    renewalDate: '2028-10-01',
    status: 'Upcoming',
    owner: 'Ahmed Ali'
  },
  {
    id: '2',
    customerId: '3',
    contractValue: '$45,000',
    renewalDate: '2025-10-01',
    status: 'In Progress',
    owner: 'Omar Farooq'
  }
];
