import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user?.role || session.user.role !== 'admin') {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#FBF7F4] dark:bg-[#1F1B1A] pt-16">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
