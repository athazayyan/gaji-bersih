import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
