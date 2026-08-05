import * as authRepository from '../repositories/authRepository';

export const loginUser = async (email: string, password: string) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const fetchAllUsers = async () => {
  const users = await authRepository.getAllUsers();
  return users.map(u => {
    const { password, ...safeUser } = u;
    return safeUser;
  });
};

export const registerUser = async (data: any) => {
  const existing = await authRepository.findUserByEmail(data.email);
  if (existing) {
    throw new Error('Email already exists');
  }
  return await authRepository.createUser(data);
};

export const updateUserPermissions = async (userId: string, permissions: any[]) => {
  await authRepository.deleteUserPermissions(userId);
  if (permissions && permissions.length > 0) {
    const permissionsData = permissions.map(p => ({
      userId,
      moduleName: p.moduleName,
      canRead: p.canRead,
      canWrite: p.canWrite
    }));
    await authRepository.createUserPermissions(permissionsData);
  }
  return await authRepository.findUserById(userId);
};

export const fetchNotifications = async (userId: string) => {
  return await authRepository.getNotificationsByUserId(userId);
};

export const readNotification = async (notificationId: string) => {
  return await authRepository.updateNotificationReadStatus(notificationId, true);
};
