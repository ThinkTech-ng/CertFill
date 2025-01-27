import customFetch from "./https"

export const getMyPrograms = async ()=>{
    const {data} = await customFetch('/programs')
    console.log('programs', data)
}