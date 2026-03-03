import AdminHeader from "../components/AdminHeader";

export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
