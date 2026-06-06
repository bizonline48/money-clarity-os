import { WifiOff } from 'lucide-react';
import { Card } from '../design-system/components';

export function OfflineFallback(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mc-bg-base px-4">
      <Card variant="elevated" className="max-w-md text-center">
        <div className="flex flex-col items-center p-8">
          <div className="mb-4 rounded-full bg-mc-bg-subtle p-6">
            <WifiOff size={48} className="text-mc-text-3" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-mc-text-1">You're Offline</h1>
          <p className="mb-4 text-mc-text-2">
            Money Clarity OS works offline, but you need to load it at least once while connected.
          </p>
          <p className="text-sm text-mc-text-3">
            Please check your internet connection and try again.
          </p>
        </div>
      </Card>
    </div>
  );
}
