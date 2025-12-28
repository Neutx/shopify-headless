import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex h-screen max-w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-hidden [&>*]:h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

