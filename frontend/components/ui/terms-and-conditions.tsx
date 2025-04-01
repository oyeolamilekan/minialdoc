import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-6">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to Minialdoc (&ldquo;the Service&rdquo;), a software application that enables engineers to create API documentation. The Service is provided by Minialdoc (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using our Service, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree with these Terms, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
          <p className="text-gray-700">
            You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you have the legal capacity to enter into these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
          <p className="text-gray-700">
            To access certain features, you may be required to create an account. You are responsible for maintaining the security of your account and all activities occurring under it. You agree to provide accurate and up-to-date information when creating an account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
          <p className="text-gray-700">You agree not to:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Use the Service for any illegal or unauthorized purposes.</li>
            <li>Interfere with the operation of the Service.</li>
            <li>Attempt to access restricted areas of the Service without authorization.</li>
            <li>Upload malicious code or conduct activities that may harm the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, trademarks, and intellectual property related to the Service are owned by Minialdoc or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. User-Generated Content</h2>
          <p className="text-gray-700">
            If you submit or upload content to the Service, you grant us a non-exclusive, royalty-free, worldwide license to use, modify, and display such content for the purpose of operating and improving the Service. You retain ownership of your content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Fees and Payments</h2>
          <p className="text-gray-700">
            Certain features of the Service may require payment. If applicable, you agree to pay all fees as described on our pricing page. Payments are non-refundable except as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate your access to the Service at any time if you violate these Terms. You may also terminate your account by discontinuing the use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind. We do not warrant that the Service will be error-free, secure, or uninterrupted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the fullest extent permitted by law, Minialdoc shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of your jurisdiction. Any disputes shall be resolved in the courts of your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Changes to These Terms</h2>
          <p className="text-gray-700">
            We may update these Terms from time to time. Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">13. Applicability to Existing Users</h2>
          <p className="text-gray-700">
            These Terms of Service apply to both new and existing users of the Service. If you are an existing user as of the Effective Date, your continued use of the Service after this date constitutes your acceptance of these Terms. If you do not agree to the updated Terms, you must discontinue use of the Service before the Effective Date. We reserve the right to require existing users to explicitly accept these Terms before continuing to access certain features of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">14. Privacy Policy</h2>
          <p className="text-gray-700">
            Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the Service, you agree to our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">15. Data Security and Storage</h2>
          <p className="text-gray-700">
            We implement reasonable security measures to protect your data. However, we do not guarantee that unauthorized access, data breaches, or cyberattacks will not occur. You are responsible for safeguarding your account credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">16. Third-Party Services</h2>
          <p className="text-gray-700">
            The Service may contain links to or integrate with third-party services. We are not responsible for the content, policies, or practices of any third-party services. Your use of such services is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">17. Indemnification</h2>
          <p className="text-gray-700">
            You agree to indemnify and hold Minialdoc, its affiliates, and employees harmless from any claims, damages, liabilities, or expenses arising from your use of the Service, your violation of these Terms, or any third-party rights infringement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">18. Service Availability</h2>
          <p className="text-gray-700">
            We strive to maintain the availability of the Service but do not guarantee uninterrupted operation. We may modify, suspend, or discontinue certain features or functionalities at any time without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">19. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, contact us at support@minialdoc.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions; 