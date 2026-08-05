const API_URL = 'http://localhost:3000/api';

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const getMeetings = async () => {
  const response = await fetch(`${API_URL}/meetings`);
  if (!response.ok) throw new Error('Failed to fetch meetings');
  return response.json();
};

export const getRenewals = async () => {
  const response = await fetch(`${API_URL}/renewals`);
  if (!response.ok) throw new Error('Failed to fetch renewals');
  return response.json();
};

export const createTask = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const createMeeting = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create meeting');
  return response.json();
};

export const createRenewal = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/renewals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create renewal');
  return response.json();
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};
