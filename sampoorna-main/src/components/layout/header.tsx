
import Link from 'next/link';
import {
  Menu,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/constants';
import { LeafIcon } from '../icons';
import { DynamicHeader } from './dynamic-header';


export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
           <SheetHeader className="mb-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <LeafIcon className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl text-primary">Sampoorna Krishi</span>
            </Link>
          </SheetHeader>
          <nav className="grid gap-4 text-base font-medium">
            {NAV_LINKS.map((link) => (
               <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="hidden md:flex items-center gap-2">
        <LeafIcon className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-headline font-bold text-primary">
            Sampoorna Krishi
        </h1>
      </div>
      <DynamicHeader />
    </header>
  );
}
