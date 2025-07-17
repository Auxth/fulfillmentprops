import { ReactNode } from "react";
import { AdminHeader } from "@/components/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-primary text-white font-display transition-colors">
      <AdminHeader />
      <main className="p-6 space-y-6">{children}</main>
    </div>
  );
}
