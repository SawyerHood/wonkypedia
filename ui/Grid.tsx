"use client";

export function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "max-w-screen-xl mx-auto container w-full grid grid-cols-9 md:grid-cols-12 md:gap-x-12 gap-y-4 overflow-hidden " +
        (className ?? "")
      }
    >
      {children}
    </div>
  );
}
