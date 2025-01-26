import * as React from "react";

import { cn } from "@/utils/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { OTPInput, OTPInputProps, SlotProps } from "input-otp";

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
    );
  }
);
Input.displayName = "Input";

export { Input };

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>((props, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...props as any}
        type={showPassword ? "text" : "password"}
        className={cn("h-[46px] pr-10", props.className)}
        ref={ref}
      />
      <div
        className="absolute cursor-pointer right-0 top-0 bottom-0 flex justify-center items-center h-full px-3 py-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeIcon className="h-4 w-4 text-gray-600" />
        ) : (
          <EyeOffIcon className="h-4 w-4 text-gray-600" />
        )}
      </div>
    </div>
  );
});
function OtpInpuSlot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative w-[40px] h-[40px] sm:w-[64px] w-[40px] h-[40px] sm:h-[64px] text-[2rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'outline rounded outline-accent-foreground/20 mx-1 sm:mx-2',
        { 'outline-1 outline-accent-foreground': props.isActive },
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20 max-sm:text-lg">
        {props.char ?? props.placeholderChar}
      </div>
    </div>
  )
}
export const OtpInput = React.forwardRef<
  HTMLInputElement,
  OTPInputProps 
>((props, ref) => {

  return (
    <div className="relative max-sm:-ml-2">
      <OTPInput
        maxLength={6}
        ref={ref}
        containerClassName="group flex items-center has-[:disabled]:opacity-30"
        {...props as any}
        render={({ slots }) => (
          <>
            <div className="flex">
              {slots.map((slot, idx) => (
                <OtpInpuSlot key={idx} {...slot} />
              ))}
            </div>
          </>
        )}
      />
    </div>
  );
});
