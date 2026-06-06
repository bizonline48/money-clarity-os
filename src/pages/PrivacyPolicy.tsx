import { Shield, Database, Lock, Eye } from 'lucide-react';
import { Card } from '../design-system/components';

export function PrivacyPolicy(): JSX.Element {
  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-mc-text-1">Privacy Policy</h1>
        <p className="mb-6 text-sm text-mc-text-3">Last updated: 6 June 2026</p>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <Database size={24} className="mb-2 text-mc-accent" />
              <p className="text-xs font-medium text-mc-text-2">100% Local</p>
            </div>
          </Card>
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <Lock size={24} className="mb-2 text-mc-accent" />
              <p className="text-xs font-medium text-mc-text-2">No Cloud</p>
            </div>
          </Card>
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <Shield size={24} className="mb-2 text-mc-accent" />
              <p className="text-xs font-medium text-mc-text-2">PDPA Ready</p>
            </div>
          </Card>
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <Eye size={24} className="mb-2 text-mc-accent" />
              <p className="text-xs font-medium text-mc-text-2">You Control</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Our Commitment</h2>
            <p className="text-mc-text-2">
              Money Clarity OS is built with privacy as the foundation. All your financial data stays on your device.
              We never send your transactions, balances, or any financial information to external servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">What Data We Store</h2>
            <p className="mb-3 text-mc-text-2">All data is stored locally in your browser using IndexedDB:</p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Transactions you manually enter (income and expenses)</li>
              <li>Budgets, savings goals, and debt information you create</li>
              <li>Categories you use (default and custom if Pro)</li>
              <li>Your app settings (theme, currency preference)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">What We Do NOT Collect</h2>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Banking credentials or API connections</li>
              <li>NRIC, passport, or government ID numbers</li>
              <li>Personal contact information beyond what you voluntarily provide</li>
              <li>Location data or device identifiers</li>
              <li>Analytics or tracking cookies</li>
              <li>Usage data or behaviour tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Bank Integration</h2>
            <p className="text-mc-text-2">
              We deliberately do not integrate with banks or financial institutions. You manually enter all transactions.
              This means we never have access to your bank accounts or credentials.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Your Control</h2>
            <p className="mb-3 text-mc-text-2">You have complete control over your data:</p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Export all your data anytime (Pro feature)</li>
              <li>Delete all data permanently from Settings</li>
              <li>Clear browser data to remove the app and all its data</li>
              <li>No server backups means no data retention after deletion</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">PDPA Compliance (Singapore)</h2>
            <p className="text-mc-text-2">
              Money Clarity OS is architected to comply with Singapore's Personal Data Protection Act (PDPA).
              Since all data is stored locally on your device and we collect no personal information,
              traditional data protection concerns do not apply. You are the data controller of your own information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Financial Advice Disclaimer</h2>
            <p className="text-mc-text-2">
              Money Clarity OS is a tracking and calculation tool only. We provide no financial advice,
              investment recommendations, or professional guidance. Always consult qualified financial advisers
              for your specific circumstances.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Updates to This Policy</h2>
            <p className="text-mc-text-2">
              We may update this privacy policy from time to time. The "Last updated" date at the top will reflect changes.
              Continued use of the app after updates constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Contact</h2>
            <p className="text-mc-text-2">
              Questions about privacy? Email us at{' '}
              <a href="mailto:privacy@skempire.sg" className="font-medium text-mc-accent hover:underline">
                privacy@skempire.sg
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 rounded-mc-md border border-mc-border bg-mc-bg-subtle p-4 text-center">
          <p className="text-sm text-mc-text-2">
            © 2026 SK Empire, Singapore. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
