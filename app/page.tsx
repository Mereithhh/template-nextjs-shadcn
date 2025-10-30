"use client";

import { ModeToggle } from "@/components/mode-toggle";

export default function TGIList() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Hello World</h1>
          <ModeToggle />
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to your Next.js app with dark mode support!
          </p>
          <p className="text-muted-foreground">
            Click the theme toggle button in the top-right corner to switch between light, dark, and system themes.
          </p>
        </div>
      </div>
    </div>
  );
}
