import customFetch from "./https"

export const getMyPrograms = async ()=>{
    const {data} = await customFetch('/programs')
    return data
}
export const getSinglePrograms = async (id: string)=>{
    const {data} = await customFetch(`/programs/${id}`)
    return data
}
export const createProgram = async (formData: Record<string, string>) => {
      const response = await customFetch("/programs", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      return response
  };
