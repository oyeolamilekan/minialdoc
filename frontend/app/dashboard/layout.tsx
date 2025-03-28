"use client"

import { CreditCard, FolderKanban, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname()

  const checkIfActive = (route: string): boolean => {

    return path.startsWith(route);
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard/projects">
                  <span className="text-2xl font-bold text-gray-800">MinialDoc</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard/projects" className={`border-black inline-flex items-center px-1 pt-1 gap-2 ${checkIfActive("/dashboard/projects") || checkIfActive("/dashboard/features") ? "border-b-2 text-gray-900" : "text-gray-500"} text-sm font-medium`} prefetch={true}>
                  <FolderKanban /> Projects
                </Link>
                <Link href="/dashboard/payment" className={`border-black inline-flex items-center px-1 pt-1 gap-2 ${checkIfActive("/dashboard/payment") ? "border-b-2 text-gray-900" : "text-gray-500"} text-sm font-medium`} prefetch={true}>
                  <CreditCard /> Payment
                </Link>
                <Link href="#" className={`border-black inline-flex items-center px-1 pt-1 gap-2 ${checkIfActive("/dashboard/team") ? "border-b-2 text-gray-900" : "text-gray-500"} text-sm font-medium`} prefetch={true}>
                  <Settings /> Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 my-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
}
