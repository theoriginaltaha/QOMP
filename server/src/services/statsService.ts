import * as statsRepository from '../repositories/statsRepository';

export const getDashboardStats = async () => {
  const customerCount = await statsRepository.countActiveCustomers();
  const envCount = await statsRepository.countActiveEnvironments();
  const activeTickets = await statsRepository.countActiveJiraTickets();
  const pendingTasks = await statsRepository.countPendingTasks();

  // Mock data for integration with external platform
  const userCount = 42500;
  const questionsCount = 15420;
  const examsCount = 385;

  return { customerCount, envCount, activeTickets, pendingTasks, userCount, questionsCount, examsCount };
};

export const searchEntities = async (query: string) => {
  if (!query) return { customers: [], schools: [] };
  
  const customers = await statsRepository.searchCustomers(query);
  const schools = await statsRepository.searchSchools(query);
  
  return { customers, schools };
};
