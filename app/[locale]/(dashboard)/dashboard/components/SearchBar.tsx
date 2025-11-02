"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const DEBOUNCE_MS = 150;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const [internal, setInternal] = React.useState(value);

  React.useEffect(() => setInternal(value), [value]);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (internal !== value) onChange(internal);
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [internal, value, onChange]);

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-3 h-5 w-5 text-main" />
      <Input
        placeholder="Search for a chat..."
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        className="pl-10 min-h-12 border-2 border-main placeholder:text-main caret-main"
        aria-label="Search chats"
      />
    </div>
  );
}
