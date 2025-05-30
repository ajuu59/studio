"use client";

import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t py-8 mt-12 w-full">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-full mx-auto">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">{APP_NAME}</h3>
          <p className="text-sm text-muted-foreground">
            AI-driven insights for smarter testing.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
