import * as environmentRepository from '../repositories/environmentRepository';

export const fetchEnvironments = async () => {
  return await environmentRepository.getAllEnvironments();
};

export const fetchEnvironmentDetails = async (id: string) => {
  const env = await environmentRepository.getEnvironmentById(id);
  if (!env || env.isDeleted) throw new Error('Environment not found');
  return env;
};

export const addEnvironment = async (customerId: string, data: any) => {
  return await environmentRepository.createEnvironment({
    customerId,
    ...data
  });
};

export const editEnvironment = async (id: string, data: any) => {
  return await environmentRepository.updateEnvironment(id, data);
};

export const removeEnvironment = async (id: string) => {
  return await environmentRepository.softDeleteEnvironment(id);
};

export const addCertificate = async (environmentId: string, data: any) => {
  return await environmentRepository.createCertificate({
    environmentId,
    ...data
  });
};

export const editCertificate = async (id: string, data: any) => {
  return await environmentRepository.updateCertificate(id, data);
};

export const removeCertificate = async (id: string) => {
  return await environmentRepository.softDeleteCertificate(id);
};
