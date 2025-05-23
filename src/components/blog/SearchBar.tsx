
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void; // Optional: Implement search logic if needed
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // Placeholder for actual search functionality
      console.log("Search query:", query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-xl items-center space-x-2">
      <Input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
        aria-label="Search posts"
      />
      <Button type="submit" variant="default" aria-label="Submit search">
        <Search className="h-4 w-4 mr-2 md:hidden" />
        <span className="hidden md:inline">Search</span>
      </Button>
    </form>
  );
}
