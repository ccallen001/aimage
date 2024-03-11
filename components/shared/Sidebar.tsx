'use client';

import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { navLinks } from '@/constants';
import { Button } from '@/components/ui/button';

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link className="sidebar-logo" href="/">
          {/* <Image
            src={'/assets/images/logo-text.svg'}
            alt="logo"
            width={180}
            height={28}
          /> */}

          <h1 className="text-2xl">
            <strong>✨ AImage</strong>
          </h1>
        </Link>

        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link, i) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={i}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? 'bg-purple-gradient text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        className={`${isActive && 'brightness-200'}`}
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((link, i) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={i}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? 'bg-purple-gradient text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        className={`${isActive && 'brightness-200'}`}
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="flex-center gap-2 p-4 cursor-pointer">
                <div className="-ml-1">
                  <UserButton afterSignOutUrl="/" showName />
                </div>
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button className="button bg-purple-gradient bg-cover" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
