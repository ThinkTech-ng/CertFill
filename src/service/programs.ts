import customFetch from "./https"

export const getMyPrograms = async ()=>{
    const {data} = await customFetch('/programs')
    console.log('programs', data)
}
export const createProgram = async (formData: Record<string, string>) => {
      const response = await customFetch("/programs", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      return response
  };
