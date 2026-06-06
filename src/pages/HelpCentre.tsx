import { useState } from 'react';
import { Smartphone, HelpCircle, ChevronDown } from 'lucide-react';
import { Card } from '../design-system/components';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Is my data safe?',
    answer: 'Yes. All your data is stored locally in your browser using IndexedDB. We never send your financial information to external servers. Your data stays on your device.',
  },
  {
    question: 'Does it work offline?',
    answer: 'Yes. Money Clarity OS is a Progressive Web App (PWA) that works completely offline once installed. You can track transactions without internet connection.',
  },
  {
    question: 'How do I back up my data?',
    answer: 'Pro users can export their complete data to JSON from the Export Centre. This creates a full backup that can be saved to cloud storage or external drives.',
  },
  {
    question: 'What happens if I clear my browser data?',
    answer: 'Clearing your browser data will permanently delete all app data, including transactions, budgets, and goals. Always export a backup before clearing browser data.',
  },
  {
    question: 'How do I upgrade to Pro?',
    answer: 'Tap any Pro feature (dark mode, currency selector, or multi-budget) and you\'ll see the upgrade prompt. Pro costs SGD $39 one-time and unlocks all features permanently.',
  },
  {
    question: 'Can I use it on multiple devices?',
    answer: 'Each device stores data independently. Pro purchases are also per-device. Use the JSON export feature to transfer data between devices manually.',
  },
  {
    question: 'What currencies are supported?',
    answer: 'Pro users can choose from 12 currencies: SGD, USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, MYR, THB. Free users can use SGD only.',
  },
  {
    question: 'How is the financial health score calculated?',
    answer: 'The score uses 5 pillars: Savings rate (25pts), Budget control (25pts), Cashflow (20pts), Goal progress (15pts), and Debt ratio (15pts). Pro users see the detailed breakdown.',
  },
];

function FAQAccordion({ item }: { item: FAQItem }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card variant="default" className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
      >
        <span className="flex-1 font-medium text-mc-text-1">{item.question}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-mc-text-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-mc-border bg-mc-bg-subtle px-4 py-3">
          <p className="text-sm text-mc-text-2">{item.answer}</p>
        </div>
      )}
    </Card>
  );
}

export function HelpCentre(): JSX.Element {
  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-mc-text-1">Help Centre</h1>

        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Smartphone size={24} className="text-mc-accent" />
            <h2 className="text-2xl font-semibold text-mc-text-1">iPhone Installation</h2>
          </div>
          <Card variant="elevated">
            <div className="space-y-4 p-4">
              <p className="text-mc-text-2">Install Money Clarity OS as a full-screen app on your iPhone:</p>
              <ol className="list-inside list-decimal space-y-3 text-mc-text-2">
                <li>Open Money Clarity OS in <strong>Safari</strong> (not Chrome or other browsers)</li>
                <li>Tap the <strong>Share button</strong> at the bottom (square with up arrow)</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> in the top right corner</li>
                <li>The app icon will appear on your home screen</li>
              </ol>
              <div className="rounded-mc-sm bg-mc-accent-light p-3">
                <p className="text-sm text-mc-text-1">
                  <strong>Tip:</strong> Once installed, the app works offline and feels like a native iOS app.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Smartphone size={24} className="text-mc-accent" />
            <h2 className="text-2xl font-semibold text-mc-text-1">Android Installation</h2>
          </div>
          <Card variant="elevated">
            <div className="space-y-4 p-4">
              <p className="text-mc-text-2">Install Money Clarity OS as an app on your Android device:</p>
              <ol className="list-inside list-decimal space-y-3 text-mc-text-2">
                <li>Open Money Clarity OS in <strong>Chrome</strong></li>
                <li>Tap the <strong>menu icon</strong> (three vertical dots) in the top right</li>
                <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                <li>Tap <strong>"Add"</strong> or <strong>"Install"</strong> to confirm</li>
                <li>The app will be added to your home screen and app drawer</li>
              </ol>
              <div className="rounded-mc-sm bg-mc-accent-light p-3">
                <p className="text-sm text-mc-text-1">
                  <strong>Tip:</strong> Some Android devices show an automatic install banner at the top of the page.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle size={24} className="text-mc-accent" />
            <h2 className="text-2xl font-semibold text-mc-text-1">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQAccordion key={index} item={faq} />
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-mc-md border border-mc-border bg-mc-bg-subtle p-4 text-center">
          <p className="mb-2 text-sm font-medium text-mc-text-1">Still need help?</p>
          <p className="text-sm text-mc-text-2">
            Email us at{' '}
            <a href="mailto:support@skempire.sg" className="font-medium text-mc-accent hover:underline">
              support@skempire.sg
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
