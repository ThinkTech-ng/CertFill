import * as React from "react"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm inputField h-[45px]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

export const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (props, ref) =>{
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        { ...props}
        type={showPassword ? "text" : "password"}
        className={cn("h-[46px] pr-10", props.className)}
        ref={ref}
      />
      <div
        className="absolute cursor-pointer right-0 top-0 bottom-0 flex justify-center items-center h-full px-3 py-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeIcon className="h-4 w-4 text-gray-600" /> :
        <EyeOffIcon className="h-4 w-4 text-gray-600" />}
      </div>
      </div>
  )
})