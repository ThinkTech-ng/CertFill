import customFetch from "./https";

export const getMyPrograms = async () => {
  const { data } = await customFetch("/programs");
  return data;
};
export const getProgramsCourses = async (params: Record<string, any>) => {
  const { data } = await customFetch(`/programs/pub/${params.username}/${params.id}`);
  return data;
};

export const getRecipientCourse = async (params: Record<string, any>) => {
  const { data } = await customFetch(`/courses/pub/recipient/${params.username}`);
  return data;
};

export const getSinglePrograms = async (id: string) => {
  const { data } = await customFetch(`/programs/${id}`);
  return data;
};

export const createProgram = async (formData: Record<string, string>) => {
  const response = await customFetch("/programs", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  return response;
};

export const confirmProgramSetup = async (data: Record<any, any>) => {
  const response = await customFetch(`/transaction/program/${data.id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const confirmProgramPayment = async (data: Record<any, any>) => {
  const response = await customFetch(`/transaction/program/confirm-payment/${data.reference}`);
  return response;
};

export const fetchCertificate = async (data: Record<any, any>) => {
  return await customFetch(
    `/certificates/certificates/${data.id}`)
};

export const fetchUserCertificate = async (data: Record<any, any>) => {
  return await customFetch(
    `/certificates/my/${data.id}`)
};

export const generateRecipientPayment = async (data: Record<any, any>) => {
  return await customFetch(
    `/transaction/certificate/${data.id}`)
};

export const completeRecipientPayment = async (data: Record<any, any>) => {
  return await customFetch(
    `/transaction/certificate/${data.reference || data.id}/complete`)
};
