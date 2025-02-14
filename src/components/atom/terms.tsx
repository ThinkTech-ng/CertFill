import Link from "next/link";

export const TermAndCondition = ({ type }: { type: "register" | "login" }) => {
  return (
    <div className="text-sm text-center text-tin mt-6 py-4">
      By {type === "register" ? "creating an account," : "continuing,"} you
      agree with our{" "}
      <Link href="#" className="underline hover:text-foreground text-onyx">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        href="https://docs.google.com/document/d/18L1wYp5HiNtuV-binbYa-HKrA_6xPZJ70f8zQBh-9sI/edit"
        className="underline hover:text-foreground text-onyx"
      >
        Privacy Policy
      </Link>
      .
    </div>
  );
};
