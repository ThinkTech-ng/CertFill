import { LoaderCircleIcon } from "lucide-react"

export const LoadingAtom = () =>{
    return <div className="flex">
    <LoaderCircleIcon className="animate-spin" /> <span>Loading...</span>
  </div>
}