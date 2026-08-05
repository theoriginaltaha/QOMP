import * as ticketRepository from '../repositories/ticketRepository';

export const fetchJiraTickets = async () => {
  return await ticketRepository.getAllJiraTickets();
};

export const addJiraTicket = async (ticketData: any) => {
  let assigneeName = ticketData.assignee;

  const user = await ticketRepository.findUserById(ticketData.assignee);
  if (user) {
    assigneeName = user.name;
    await ticketRepository.createNotification({
      userId: user.id,
      message: `You were assigned to Ticket ${ticketData.ticketId}: ${ticketData.title}`,
      link: `/customers/${ticketData.customerId}`
    });
  }

  return await ticketRepository.createJiraTicket({
    customerId: ticketData.customerId,
    ticketId: ticketData.ticketId,
    title: ticketData.title,
    type: ticketData.type,
    status: ticketData.status,
    priority: ticketData.priority,
    assignee: assigneeName
  });
};

export const removeJiraTicket = async (id: string) => {
  return await ticketRepository.softDeleteJiraTicket(id);
};

export const fetchCustomerTickets = async () => {
  return await ticketRepository.getAllCustomerTickets();
};

export const addCustomerTicket = async (ticketData: any, file?: any) => {
  let attachmentUrl = ticketData.link || null;
  if (file) {
    attachmentUrl = `/uploads/${file.filename}`;
  }

  return await ticketRepository.createCustomerTicket({
    customerId: ticketData.customerId,
    title: ticketData.title,
    description: ticketData.description,
    attachmentUrl,
    status: 'Open'
  });
};

export const removeCustomerTicket = async (id: string) => {
  return await ticketRepository.softDeleteCustomerTicket(id);
};
