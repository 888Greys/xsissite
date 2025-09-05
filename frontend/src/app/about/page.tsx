import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Authentication System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A secure, modern authentication platform designed to protect user accounts and provide 
            seamless access management for applications and services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Enterprise-grade security with encryption, secure password hashing, and multi-factor authentication.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <CardTitle>User-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Intuitive interface designed for easy registration, login, and account management.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Your data is protected with strict privacy policies and secure data handling practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <CardTitle>Fast & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                High-performance infrastructure ensuring quick response times and reliable service.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We are committed to providing a secure, reliable, and user-friendly authentication system 
              that protects user privacy while enabling seamless access to digital services.
            </p>
            <p className="text-gray-700 mb-4">
              Our platform is built with modern security standards and best practices, ensuring that 
              user accounts and personal information remain protected at all times.
            </p>
            <p className="text-gray-700">
              We continuously monitor and improve our security measures to stay ahead of emerging threats 
              and provide the best possible experience for our users.
            </p>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Have questions or need support? We're here to help.
              </p>
              <a 
                href="mailto:support@xsis.online" 
                className="text-blue-600 hover:underline font-medium"
              >
                support@xsis.online
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}