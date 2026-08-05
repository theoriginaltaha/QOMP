const API_URL = '/api';

export const getEnvironments = async () => {
  const response = await fetch(`${API_URL}/environments`);
  if (!response.ok) throw new Error('Failed to fetch environments');
  return response.json();
};

export const getEnvironmentById = async (id: string) => {
  const response = await fetch(`${API_URL}/environments/${id}`);
  if (!response.ok) throw new Error('Failed to fetch environment details');
  return response.json();
};

export const createEnvironment = async (customerId: string, data: any) => {
  const response = await fetch(`${API_URL}/customers/${customerId}/environments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create environment');
  return response.json();
};

export const createCertificate = async (environmentId: string, data: any) => {
  const response = await fetch(`${API_URL}/environments/${environmentId}/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create certificate');
  return response.json();
};

export const createJiraTicket = async (environmentId: string, data: any) => {
  const response = await fetch(`${API_URL}/environments/${environmentId}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create Jira ticket');
  return response.json();
};
