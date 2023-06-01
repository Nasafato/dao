import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Dictionary",
    href: "/dictionary",
  },
];

export function Header() {
  // const { data: session, status } = useSession();
  //   const router = useRouter();
  //   const isActive: (pathname: string) => boolean = (pathname) =>
  //     router.pathname === pathname;

  let right = null;
  right = (
    <ul className="flex text-sm items-center font-sans">
      {links.map((link) => (
        <li
          key={link.href}
          className="border-r border-gray-300 pr-2 pl-2 hover:underline last-of-type:border-r-0"
        >
          <Link href={link.href}>{link.name}</Link>
        </li>
      ))}
    </ul>
  );
  // right = (
  //   <button onClick={toggleReaderMode}>
  //     {readerMode ? "Disable reader mode" : "Enable reader mode"}
  //   </button>
  // );
  // if (session) {
  //   right = (
  //     <div className="flex items-center gap-x-2 text-xs">
  //       <div className="rounded-full py-2 px-3 ring-1 ring-gray-950/5">
  //         {session.user?.name ?? "No name"}
  //       </div>
  //       <button
  //         onClick={() => signOut()}
  //         className="px-2 py1 text-center hover:text-gray-500"
  //       >
  //         Sign out
  //       </button>
  //     </div>
  //   );
  // } else if (status === "loading") {
  //   right = <div className="text-xs flex items-center">Loading...</div>;
  // } else {
  //   right = (
  //     <div className="text-xs flex items-center">
  //       <Link href="/api/auth/signin" data-active={isActive("/signup")}>
  //         Log in
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <nav className="h-12 px-5 lg:px-24 py-2 fixed top-0 w-full bg-white dark:bg-gray-950 z-20 border-b border-gray-200/10">
      <div className="m-auto max-w-xl font-mono text-sm h-full flex items-center">
        <div className="flex justify-between items-center flex-1">
          <ModeToggle />
          {right}
        </div>
      </div>
    </nav>
  );
}
