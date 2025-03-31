"use client";

import { MastraRuntimeProvider } from "@/app/MastraRuntimeProvider";
import { Thread } from "@/components/assistant-ui/thread";

export const Assistant = () => {
  return (
    <MastraRuntimeProvider>
      <div className="grid h-dvh gap-x-2 px-4 py-4">
        <Thread />
      </div>
    </MastraRuntimeProvider>
  );
};
