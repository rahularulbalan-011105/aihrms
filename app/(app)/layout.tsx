import AppHeader from "@/modules/dashboard/components/AppHeader";
import AppSidebar from "@/modules/dashboard/components/AppSidebar";
import { ProfileProvider } from "@/modules/dashboard/context/ProfileContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-[#F8F7FF]">
        <AppHeader />
        <div className="flex flex-1 pt-2 pr-2 pb-2 gap-5 overflow-hidden min-h-0">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto min-h-0">
            <div className="py-2">{children}</div>
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}
