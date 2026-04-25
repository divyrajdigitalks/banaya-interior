import { Header } from "@/components/header";

export default function InteriorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" />
      <main className="pt-20">{children}</main>
    </div>
  );
}
