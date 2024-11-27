import React from 'react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Kusina De Amadeo's services, you agree to these terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. User Accounts</h2>
          <ul className="list-disc pl-6">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining account security</li>
            <li>We reserve the right to suspend accounts that violate our terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Ordering and Payment</h2>
          <ul className="list-disc pl-6">
            <li>All prices are in PHP and include applicable taxes</li>
            <li>Orders are subject to availability</li>
            <li>Payment must be completed before order processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Delivery</h2>
          <ul className="list-disc pl-6">
            <li>Delivery times are estimates and not guaranteed</li>
            <li>Accurate delivery information must be provided</li>
            <li>Additional delivery fees may apply</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of new terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact</h2>
          <p>For questions about these terms, contact us at:</p>
          <p className="mt-2">Email: kusinadeamadeo@gmail.com</p>
        </section>
      </div>
    </div>
  );
}
