import * as taskRepository from '../repositories/taskRepository';

export const fetchAllTasks = async () => {
  return await taskRepository.getAllActiveTasks();
};

export const createNewTask = async (taskData: any) => {
  let assigneeName = taskData.assignee;

  // If the assignee is a valid user ID, create a notification
  const user = await taskRepository.findUserById(taskData.assignee);
  if (user) {
    assigneeName = user.name;
    await taskRepository.createNotification({
      userId: user.id,
      message: `You were assigned to a Success Task: ${taskData.title}`,
      link: `/customers/${taskData.customerId}`
    });
  }

  return await taskRepository.createTask({
    customerId: taskData.customerId,
    title: taskData.title,
    priority: taskData.priority,
    status: taskData.status,
    dueDate: taskData.dueDate,
    assignee: assigneeName
  });
};

export const changeTaskStatus = async (taskId: string, status: string) => {
  return await taskRepository.updateTaskStatus(taskId, status);
};

export const removeTask = async (taskId: string) => {
  return await taskRepository.softDeleteTask(taskId);
};
