import { ReactNode, useEffect, useState } from 'react';
import { initialiseDatabase } from '../db/schema';
import { ToastContainer } from '../design-system/components';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initialiseDatabase();
      setIsInitialised(true);
    };

    init();
  }, []);

  if (!isInitialised) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mc-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
