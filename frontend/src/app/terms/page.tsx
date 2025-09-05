import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this authentication system, you accept and agree to be bound by 
              the terms and provision of this agreement.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Our service provides secure user authentication and account management functionality. 
              This includes user registration, login, profile management, and related features.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the service, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access to other accounts</li>
            </ul>

            <h2>5. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the service.
            </p>

            <h2>6. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access to 
              the service. We may modify or discontinue the service at any time.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              The service is provided "as is" without warranties of any kind. We shall not be liable 
              for any indirect, incidental, or consequential damages.
            </p>

            <h2>8. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at: 
              <a href="mailto:support@xsis.online" className="text-blue-600 hover:underline">
                support@xsis.online
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}