"use client";

import { MastraRuntimeProvider } from "@/app/MastraRuntimeProvider";
import { Thread } from "@/components/assistant-ui/thread";

export const Assistant = () => {
  return (
    <MastraRuntimeProvider>
      <Thread />
    </MastraRuntimeProvider>
  );
};
