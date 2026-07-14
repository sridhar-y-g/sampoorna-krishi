'use client';

import { useState, useEffect } from 'react';
import { LanguageSwitcher } from '../language-switcher';
import { UserNav } from './user-nav';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

export function DynamicHeader() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="ml-auto flex items-center gap-2">
            <div className="h-9 w-[336px] rounded-lg bg-muted" />
            <div className="h-10 w-10" />
            <div className="ml-4">
                <div className="h-9 w-9 rounded-full bg-muted" />
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-1 items-center gap-4 md:ml-auto md:flex-initial">
        <div className="relative flex-1 md:grow-0 ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search features, schemes..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
        </div>
        <LanguageSwitcher />
        <div className="ml-4">
            <UserNav />
        </div>
    </div>
  );
}
