import Link from "next/link";

const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between border-b border-gray-200 bg-white px-4 py-6 sm:px-6">
      <div className="flex items-center">
        <Link href="/">
          <h1>Logo</h1>
        </Link>
      </div>
      <div className="ml-10 flex items-baseline space-x-4">Get Help</div>
    </header>
  );
};

export default Header;
