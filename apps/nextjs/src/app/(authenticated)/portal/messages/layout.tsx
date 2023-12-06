import Header from "~/components/header";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <main className="container col-span-1 mx-auto flex items-center justify-center px-4 md:col-span-1 xl:col-span-2">
        {children}
      </main>
    </div>
  );
}
