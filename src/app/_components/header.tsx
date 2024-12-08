"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  returnTo?: [{ title: string; href: string }];
  userName: string;
  pageName: string;
}

export function Header({ returnTo, pageName, userName }: HeaderProps) {
  return (
    <>
      <header className="bg-columbia-blue text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Plan4CU</h1>
            <h2 className="text-lg font-medium">{pageName}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span>{userName}</span>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-white px-4 py-2 text-columbia-blue transition duration-300 hover:bg-gray-100"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      {returnTo && (
        <div className={"ml-4 mt-4 flex space-x-2"}>
          {returnTo.map((link, index) => (
            <div
              className="flex items-center justify-between px-4 py-4"
              key={`link-returnto-${link.href}`}
            >
              <Link href={link.href} className="flex">
                <ArrowLeft className="mr-1 w-[20px]" /> {link.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
