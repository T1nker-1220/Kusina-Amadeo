import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>When you use Kusina De Amadeo, we collect:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Information you provide (name, email, delivery address)</li>
            <li>Order history and preferences</li>
            <li>Authentication data when you sign in with Google</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Process and deliver your orders</li>
            <li>Improve our services</li>
            <li>Communicate about promotions and updates</li>
            <li>Ensure account security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Contact Us</h2>
          <p>For privacy-related questions, please contact us at:</p>
          <p className="mt-2">Email: kusinadeamadeo@gmail.com</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Updates to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        </section>
      </div>
    </div>
  );
}
