import * as statsRepository from '../repositories/statsRepository';

export const getDashboardStats = async () => {
  const customerCount = await statsRepository.countActiveCustomers();
  const envCount = await statsRepository.countActiveEnvironments();
  const activeTickets = await statsRepository.countActiveJiraTickets();
  const pendingTasks = await statsRepository.countPendingTasks();

  return { customerCount, envCount, activeTickets, pendingTasks };
};

export const searchEntities = async (query: string) => {
  if (!query) return { customers: [], schools: [] };
  
  const customers = await statsRepository.searchCustomers(query);
  const schools = await statsRepository.searchSchools(query);
  
  return { customers, schools };
};
