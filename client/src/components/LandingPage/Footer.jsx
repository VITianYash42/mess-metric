import { Leaf } from "lucide-react";

export function Footer(){
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Mess-Metric</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making campus dining sustainable, one meal at a time.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="/impact" className="hover:text-white">Impact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">NGO Partners</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Feeding India</li>
                <li>Akshaya Patra</li>
                <li>Robin Hood Army</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@messmetric.edu</li>
                <li>+91 1234 567 890</li>
                <li>Campus Admin Office</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Mess-Metric. All rights reserved. Building a sustainable future together.</p>
          </div>
        </div>
      </footer>
  );
}