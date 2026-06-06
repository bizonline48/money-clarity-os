import { FileText, AlertTriangle, DollarSign, Scale } from 'lucide-react';
import { Card } from '../design-system/components';

export function TermsOfUse(): JSX.Element {
  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-mc-text-1">Terms of Use</h1>
        <p className="mb-6 text-sm text-mc-text-3">Last updated: 6 June 2026</p>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <FileText size={24} className="mb-2 text-mc-text-2" />
              <p className="text-xs font-medium text-mc-text-2">Educational Tool</p>
            </div>
          </Card>
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <AlertTriangle size={24} className="mb-2 text-mc-text-2" />
              <p className="text-xs font-medium text-mc-text-2">No Advice</p>
            </div>
          </Card>
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <DollarSign size={24} className="mb-2 text-mc-text-2" />
              <p className="text-xs font-medium text-mc-text-2">One-Time Fee</p>
            </div>
          </Card>
          <Card variant="subtle" className="text-center">
            <div className="flex flex-col items-center p-3">
              <Scale size={24} className="mb-2 text-mc-text-2" />
              <p className="text-xs font-medium text-mc-text-2">Your Choice</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Acceptance of Terms</h2>
            <p className="text-mc-text-2">
              By using Money Clarity OS, you agree to these Terms of Use. If you do not agree, please do not use the application.
              These terms apply to both free and Pro users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Nature of Service</h2>
            <p className="mb-3 text-mc-text-2">
              Money Clarity OS is an educational personal finance tracking tool. It is designed to help you:
            </p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Manually track income and expenses</li>
              <li>Set budgets and savings goals</li>
              <li>Monitor debt repayment progress</li>
              <li>Calculate a basic financial health score</li>
              <li>Generate simple reports and visualisations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">No Financial Advice</h2>
            <p className="mb-3 text-mc-text-2 font-medium">
              Money Clarity OS does NOT provide financial advice, investment recommendations, or professional guidance.
            </p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>The health score is a basic calculation tool, not professional financial analysis</li>
              <li>Reports and charts show your entered data only, with no predictive analytics</li>
              <li>We are not licensed financial advisers, accountants, or investment professionals</li>
              <li>Always seek qualified professional advice for your specific financial situation</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Your Responsibility</h2>
            <p className="mb-3 text-mc-text-2">You are solely responsible for:</p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Accuracy of data you enter into the app</li>
              <li>All financial decisions you make</li>
              <li>Backing up your data (Pro users can export)</li>
              <li>Understanding that all data is stored locally on your device</li>
              <li>Clearing browser data will permanently delete all app data</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">No Guarantees</h2>
            <p className="text-mc-text-2">
              We provide the app "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Accuracy of calculations or health scores</li>
              <li>Fitness for any particular financial purpose</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Data integrity or permanence</li>
              <li>Specific financial outcomes from using the app</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Pro Subscription Terms</h2>
            <p className="mb-3 text-mc-text-2">
              Clarity Pro is a one-time purchase of SGD $39 that unlocks:
            </p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Unlimited transactions, budgets, and goals</li>
              <li>Dark mode and multi-currency support</li>
              <li>Advanced features (debt interest tracking, historical reports)</li>
              <li>Data export capabilities</li>
              <li>Full health score breakdown</li>
            </ul>
            <p className="mt-3 text-mc-text-2">
              <strong>Important:</strong> Pro purchases are non-refundable once Pro features have been accessed.
              The purchase is tied to your browser/device storage and is not transferable across devices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Limitation of Liability</h2>
            <p className="text-mc-text-2">
              To the maximum extent permitted by law, SK Empire and its affiliates shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of Money Clarity OS,
              including but not limited to financial losses, data loss, or business interruption.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Prohibited Uses</h2>
            <p className="mb-3 text-mc-text-2">You agree NOT to:</p>
            <ul className="list-inside list-disc space-y-2 text-mc-text-2">
              <li>Use the app for any unlawful purpose</li>
              <li>Attempt to reverse engineer or decompile the application</li>
              <li>Remove or obscure copyright notices</li>
              <li>Resell or redistribute the app</li>
              <li>Use automated systems to interact with the app</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Governing Law</h2>
            <p className="text-mc-text-2">
              These terms are governed by the laws of Singapore. Any disputes shall be resolved in Singapore courts.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Changes to Terms</h2>
            <p className="text-mc-text-2">
              We reserve the right to modify these terms at any time. The "Last updated" date will reflect changes.
              Continued use after modifications constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-mc-text-1">Contact</h2>
            <p className="text-mc-text-2">
              Questions about these terms? Email us at{' '}
              <a href="mailto:legal@skempire.sg" className="font-medium text-mc-accent hover:underline">
                legal@skempire.sg
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
