'use client';

import { useState } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Logo from '@/components/logo/logo';
import { CopyButton } from '@/components/copy-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

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
            <div className="h-px bg-border" />
            <Link
              href="https://github.com/dtnewman/tasknode"
              className={buttonVariants({
                variant: 'ghost',
                size: 'lg',
                className: 'w-full justify-center'
              })}
              onClick={() => setIsMenuOpen(false)}
            >
              <GitHubLogoIcon className="mr-2 h-5 w-5" />
              GitHub
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-y-auto">
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
          <span className="text-xl font-bold">TaskNode</span>
        </div>
        <NavMenu />
      </header>
      <main className="relative">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-8">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              TaskNode
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Run Python scripts and Jupyter notebooks on cloud containers,
              trivially
            </p>
            <div className="space-x-4">
              <Link
                href="https://github.com/dtnewman/tasknode"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                <GitHubLogoIcon className="mr-2 h-5 w-5" />
                View on GitHub
              </Link>
            </div>
          </div>
        </section>

        <section className="container max-w-[64rem] py-6">
          <h2 className="mb-4 text-2xl font-bold">Why TaskNode?</h2>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              Run long-running scripts or notebooks without keeping your
              computer on
            </li>
            <li>Process resource-intensive tasks in the background</li>
            <li>Leverage faster cloud internet speeds</li>
          </ul>
          <p className="text-muted-foreground">
            Zero infrastructure setup. Submit your Python scripts or Jupyter
            notebooks and we&apos;ll copy your local environment and run them on
            AWS Fargate, sending you an email when complete. And it&apos;s{' '}
            <Link
              href="https://github.com/dtnewman/tasknode"
              className="underline"
            >
              open source
            </Link>
            .
          </p>
        </section>

        <section className="container max-w-[64rem] py-8">
          <h2 className="mb-4 text-2xl font-bold">Get started in 2 minutes</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2">1. Install TaskNode:</p>
              <pre className="relative rounded-md bg-zinc-800 p-4 text-zinc-100">
                <code>pip install tasknode</code>
                <CopyButton text="pip install tasknode" />
              </pre>
            </div>
            <div>
              <p className="mb-2">
                2. (Optional) Generate a sample Jupyter notebook:
              </p>
              <pre className="relative rounded-md bg-zinc-800 p-4 text-zinc-100">
                <code>tasknode generate-sample</code>
                <CopyButton text="tasknode generate-sample" />
              </pre>
            </div>
            <div>
              <p className="mb-2">3. Submit your Jupyter notebook or script:</p>
              <pre className="relative rounded-md bg-zinc-800 p-4 text-zinc-100">
                <code>tasknode submit sample.ipynb</code>
                <CopyButton text="tasknode submit sample.ipynb" />
              </pre>
              <p className="my-2 text-center">or</p>
              <pre className="relative rounded-md bg-zinc-800 p-4 text-zinc-100">
                <code>tasknode submit your_script.py</code>
                <CopyButton text="tasknode submit your_script.py" />
              </pre>
            </div>
            <p>
              That&apos;s it! We&apos;ll send you an email like the one below
              when it&apos;s done, with links to download outputs and generated
              files.
            </p>
          </div>
          <Card className="mx-auto mt-8 border-zinc-950/10 bg-zinc-300/[0.03]">
            <CardHeader className="border-b-2 pb-3 pt-2">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-black-500 mr-1 mt-3 flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-500/10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 3.5L8 8L14.5 3.5M2 13H14C14.5523 13 15 12.5523 15 12V4C15 3.44772 14.5523 3 14 3H2C1.44772 3 1 3.44772 1 4V12C1 12.5523 1.44772 13 2 13Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      From: TaskNode &lt;notifications@tasknode.com&gt;
                    </div>
                    <div className="text-sm text-muted-foreground">
                      To: you@example.com
                    </div>
                    <div className="font-bold">
                      Your TaskNode job has completed
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p>
                Your job &quot;sample.ipynb&quot; has finished running
                successfully! 🎉
              </p>

              <div className="space-y-2">
                <p className="font-medium">
                  The following files were generated:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    results.csv
                    <span className="text-muted-foreground">(2.3 MB)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    output.logs
                    <span className="text-muted-foreground">(156 KB)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">
                  You can download the files using these links:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="cursor-pointer text-blue-500 hover:underline">
                      Output logs
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="cursor-pointer text-blue-500 hover:underline">
                      Generated files (ZIP)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                View detailed job logs and download files on your {}
                <span className="cursor-pointer text-blue-500 hover:underline">
                  TaskNode dashboard
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </section>

        <footer className="container max-w-[64rem] py-8 text-center text-sm text-muted-foreground">
          <p>
            TaskNode is in alpha. If you encounter any issues, please report
            them on our{' '}
            <Link
              href="https://github.com/dtnewman/tasknode/issues"
              className="underline"
            >
              GitHub issues page
            </Link>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
