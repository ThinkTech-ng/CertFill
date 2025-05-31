export default function MobileWarning() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-black p-8 text-center md:hidden">
      <div className="max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Best Viewed on Desktop</h2>
        <p>
          This website is best experienced on a desktop or laptop. Please switch to a larger screen
          for full functionality.
        </p>
      </div>
    </div>
  );
}
