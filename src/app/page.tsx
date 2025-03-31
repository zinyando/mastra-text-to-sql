// src/app/page.tsx
"use client";

import { Assistant } from "./assistant";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen p-4">
      <div className="flex w-full max-w-7xl gap-6">
        <div className="flex-1 min-w-[500px]">
          <Assistant />
        </div>
      </div>
    </main>
  );
}
