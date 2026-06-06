import { useEffect, useState } from 'react';
import { X, Share, Plus } from 'lucide-react';
import { Card } from '../design-system/components';

export function IOSInstallPrompt(): JSX.Element | null {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenPrompt = localStorage.getItem('mc_ios_prompt_dismissed');

    if (isIOS && !isInStandaloneMode && !hasSeenPrompt) {
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('mc_ios_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <Card variant="elevated" className="relative border-2 border-mc-accent">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-mc-sm p-1 text-mc-text-3 hover:bg-mc-bg-subtle hover:text-mc-text-1"
          aria-label="Dismiss install prompt"
        >
          <X size={20} />
        </button>

        <div className="p-4 pr-10">
          <h3 className="mb-2 font-semibold text-mc-text-1">Install Money Clarity OS</h3>
          <p className="mb-3 text-sm text-mc-text-2">
            Add to your home screen for the best experience
          </p>

          <ol className="space-y-2 text-sm text-mc-text-2">
            <li className="flex items-center gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-mc-accent-light">
                <span className="text-xs font-bold text-mc-accent">1</span>
              </div>
              <span>
                Tap the <Share size={14} className="mx-1 inline" /> Share button below
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-mc-accent-light">
                <span className="text-xs font-bold text-mc-accent">2</span>
              </div>
              <span>
                Scroll and tap <Plus size={14} className="mx-1 inline" /> "Add to Home Screen"
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-mc-accent-light">
                <span className="text-xs font-bold text-mc-accent">3</span>
              </div>
              <span>Tap "Add" to install</span>
            </li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
