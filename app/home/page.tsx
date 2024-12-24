'use client';

import { useState } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Logo from '@/components/logo/logo';

export function NavMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button className="sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <nav className="hidden sm:flex sm:items-center sm:gap-4">
        <Link
          href="/signin"
          className={buttonVariants({
            variant: 'ghost',
            size: 'lg'
          })}
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className={buttonVariants({
            size: 'lg'
          })}
        >
          Sign Up
        </Link>
      </nav>
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-background p-4 shadow-lg sm:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/signin"
              className={buttonVariants({
                variant: 'ghost',
                size: 'lg',
                className: 'w-full justify-center'
              })}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <div className="h-px bg-border" />
            <Link
              href="/signup"
              className={buttonVariants({
                variant: 'ghost',
                size: 'lg',
                className: 'w-full justify-center'
              })}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-background px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Logo
              isDarkMode={false}
              height={40}
              width={40}
              className="pl-2 pt-2"
            />
          </div>
          <span className="text-xl font-bold">Casca Extract</span>
        </div>
        <NavMenu />
      </header>
      <main className="relative">
        <section className="container flex min-h-[80vh] max-w-[64rem] flex-col items-center justify-center gap-8 py-12">
          <div className="flex max-w-[42rem] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold sm:text-6xl">
              Make Better Loan Decisions
            </h1>
            <p className="text-xl text-muted-foreground">
              Extract valuable insights from financial documents automatically.
              Save time. Reduce risk. Increase accuracy.
            </p>
            <Link
              href="/signup"
              className={buttonVariants({
                size: 'lg',
                className: 'text-lg px-8 py-6 mt-4'
              })}
            >
              Sign Up Now
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Automated Extraction</h3>
              <p className="text-muted-foreground">
                Process financial documents in seconds
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Accurate Analysis</h3>
              <p className="text-muted-foreground">
                AI-powered data extraction
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Easy Integration</h3>
              <p className="text-muted-foreground">
                Intuitive and easy to use
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
