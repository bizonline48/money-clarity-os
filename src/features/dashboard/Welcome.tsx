import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, TrendingUp, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '../../design-system/components';

interface BenefitCardProps {
  icon: typeof Shield;
  title: string;
  description: string;
}

function BenefitCard({ icon: Icon, title, description }: BenefitCardProps): JSX.Element {
  return (
    <Card variant="elevated">
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 rounded-full bg-mc-accent-light p-3">
            <Icon size={24} className="text-mc-accent" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-mc-text-1">{title}</h3>
          <p className="text-sm text-mc-text-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function Welcome(): JSX.Element {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    localStorage.setItem('mc_onboarded', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="inline-block rounded-2xl bg-mc-accent-light p-4">
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Money Clarity OS"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#16653A"
                  strokeWidth="3"
                  fill="none"
                />
                <polyline
                  points="25,65 35,55 45,60 55,45 65,50 75,35"
                  stroke="#16653A"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="75,35 75,42 68,35"
                  stroke="#16653A"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-3 text-4xl font-bold text-mc-text-1">
            Money Clarity OS
          </h1>
          <p className="text-xl text-mc-text-2">
            Track Money Clearly. Decide Calmly.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <BenefitCard
            icon={Shield}
            title="Privacy First"
            description="All your financial data stays on your device. No cloud. No tracking."
          />
          <BenefitCard
            icon={Smartphone}
            title="Works Offline"
            description="Full PWA support. Install on any device and use without internet."
          />
          <BenefitCard
            icon={TrendingUp}
            title="Health Score"
            description="Get a clear picture of your financial health across 5 key pillars."
          />
        </div>

        <div className="mb-8">
          <Button
            size="lg"
            fullWidth
            onClick={handleGetStarted}
            className="group"
          >
            Get Started
            <ArrowRight
              size={20}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Button>
        </div>

        <Card variant="subtle" className="mb-8">
          <CardContent>
            <h2 className="mb-3 text-lg font-semibold text-mc-text-1">
              Install as PWA
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium text-mc-text-1">iPhone / iPad</h3>
                <ol className="list-inside list-decimal space-y-1 text-sm text-mc-text-2">
                  <li>Tap the Share button in Safari</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-mc-text-1">Android</h3>
                <ol className="list-inside list-decimal space-y-1 text-sm text-mc-text-2">
                  <li>Tap the menu icon (three dots)</li>
                  <li>Tap "Add to Home screen" or "Install app"</li>
                  <li>Tap "Add" or "Install"</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 text-sm text-mc-text-3">
          <button
            onClick={() => navigate('/privacy')}
            className="hover:text-mc-accent"
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            onClick={() => navigate('/terms')}
            className="hover:text-mc-accent"
          >
            Terms of Use
          </button>
          <span>·</span>
          <button
            onClick={() => navigate('/help')}
            className="hover:text-mc-accent"
          >
            Help
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-mc-text-3">
          © 2026 SK Empire, Singapore. All rights reserved.
        </p>
      </div>
    </div>
  );
}
