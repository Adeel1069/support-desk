import { ReactNode } from "react";

const LayoutSkeleton = ({ children }: { children: ReactNode }) => {
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">{children}</div>
    </main>
  );
};

export default LayoutSkeleton;
