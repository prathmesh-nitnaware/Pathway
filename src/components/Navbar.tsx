"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">Pathway</span>
        </Link>
        
        <div className="flex items-center gap-4">

          <Link href="/discussions" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Discussions
          </Link>
          <Link href="/compare" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Compare
          </Link>

          {session ? (
            <div className="flex items-center gap-4 ml-4">
              <Link href="/saved" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Saved Colleges
              </Link>
              <div className="flex items-center gap-2 bg-gray-100 py-1.5 px-3 rounded-full">
                <UserIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
