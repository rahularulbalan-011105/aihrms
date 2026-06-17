import CompanyHeader from "@/modules/company/components/CompanyHeader";
import CompanySidebar from "@/modules/company/components/CompanySidebar";

export default function CompanyAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <CompanyHeader />
      <div className="flex flex-1 pt-2 pr-2 pb-2 gap-3 overflow-hidden min-h-0">
        <CompanySidebar />
        <main className="flex-1 overflow-y-auto min-h-0 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
