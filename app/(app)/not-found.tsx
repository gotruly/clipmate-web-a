const NotFound = () => {
  return (
    <div className="w-full h-[calc(100vh-20px)] flex flex-col gap-3 items-center justify-center border border-border rounded-md">
      <p className="text-xl font-medium">Page not found</p>
      <p className="text-sm">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
