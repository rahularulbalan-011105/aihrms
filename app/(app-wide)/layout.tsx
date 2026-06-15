import AppHeader from "@/modules/dashboard/components/AppHeader";

// No ProfileProvider here — ProfilePage fetches its own full profile.
// AppHeader falls back to localStorage for name display (set at login/register).
export default function AppWideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8F7FF]">
      <AppHeader />
      <main className="flex-1 pt-2 pr-2 pb-2 overflow-y-auto min-h-0">{children}</main>
    </div>
  );
}
