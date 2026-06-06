import { Crown, Check } from 'lucide-react';
import { Modal, Button } from '../../design-system/components';
import { PRO_PRICE_SGD } from '../../lib/constants';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  benefits: string[];
}

export function ProUpgradeModal({ isOpen, onClose, feature, benefits }: ProUpgradeModalProps): JSX.Element {
  const handleUpgrade = () => {
    alert('Pro upgrade functionality will be implemented in a future release. This is a placeholder.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade to Clarity Pro"
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-mc-md bg-gradient-to-r from-mc-accent to-mc-income p-4 text-white">
          <Crown size={32} />
          <div>
            <h3 className="text-lg font-semibold">Unlock {feature}</h3>
            <p className="text-sm opacity-90">One-time payment • Lifetime access</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-mc-text-1">What you'll unlock:</p>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-mc-text-2">
                <Check size={16} className="mt-0.5 flex-shrink-0 text-mc-income" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-mc-md border border-mc-border bg-mc-bg-subtle p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-mc-text-2">One-time payment</span>
            <div className="text-right">
              <span className="text-3xl font-bold text-mc-text-1 tabular-nums">
                SGD ${PRO_PRICE_SGD}
              </span>
              <p className="text-xs text-mc-text-3">Lifetime access</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" fullWidth onClick={onClose}>
            Maybe Later
          </Button>
          <Button fullWidth onClick={handleUpgrade}>
            Unlock Pro
          </Button>
        </div>
      </div>
    </Modal>
  );
}
