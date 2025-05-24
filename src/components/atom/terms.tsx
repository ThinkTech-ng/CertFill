import Link from 'next/link';

export const TermAndCondition = ({ type }: { type: 'register' | 'login' }) => {
  return (
    <div className="text-sm text-center text-tin mt-6 py-4">
      By {type === 'register' ? 'creating an account,' : 'continuing,'} you agree with our{' '}
      <Link href="/terms" className="underline hover:text-foreground text-onyx">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="underline hover:text-foreground text-onyx">
        Privacy Policy
      </Link>
      .
    </div>
  );
};
