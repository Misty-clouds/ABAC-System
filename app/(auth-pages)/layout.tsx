export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex m-20 flex-col gap-20 items-start">{children}</div>
  );
}
