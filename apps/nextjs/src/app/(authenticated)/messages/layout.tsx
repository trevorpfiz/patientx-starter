import * as React from "react";
import Link from "next/link";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between border-b border-gray-200 bg-white px-4 py-6 sm:px-6">
        <div className="flex items-center">
          <Link href="/">
            <h1>Logo</h1>
          </Link>
        </div>
        <div className="ml-10 flex items-baseline space-x-4">Get Help</div>
      </header>
      <main className="container col-span-1 mx-auto flex items-center justify-center px-4 md:col-span-1 xl:col-span-2">
        {children}
      </main>
    </>
  );
}

