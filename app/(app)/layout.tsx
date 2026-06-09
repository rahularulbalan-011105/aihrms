import AppSidebar from "@/modules/dashboard/components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F8F7FF]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
