'use client';

import { usePathname } from 'next/navigation';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import Image from 'next/image';
import Link from 'next/link';

import { navLinks } from '@/constants';
import { Button } from '../ui/button';

function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link className="flex items-center gap-2 md:py-2" href="/">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <Image
                className="cursor-pointer"
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
              />
            </SheetTrigger>
            <SheetContent content="sheet-content sm:w-64">
              <>
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="logo"
                  width={152}
                  height={23}
                />

                <nav>
                  <ul className="header-nav_elements">
                    {navLinks.slice(0, 6).map((link, i) => {
                      const isActive = link.route === pathname;

                      return (
                        <li
                          key={i}
                          className={`${
                            isActive && 'gradient-text'
                          } p-18 flex whitespace-nowrap text-dark-700`}
                        >
                          <Link
                            className="sidebar-link cursor-pointer"
                            href={link.route}
                          >
                            <Image
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
                </nav>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button className="button bg-purple-gradient bg-cover" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}

export default MobileNav;
