import { NavbarSimple } from "@/components/Navbar/NavbarSimple";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="flex p-3">
        <NavbarSimple />

      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>

  );
}
