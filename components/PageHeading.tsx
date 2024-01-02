import { ReactNode } from 'react';

export default function PageHeading({ children }: { children: ReactNode }) {
    return (
      <h1 className="text-xl font-bold leading-7 text-center text-blue-300 sm:truncate sm:text-3xl sm:tracking-tight">
        {children}
      </h1>
    );
  }