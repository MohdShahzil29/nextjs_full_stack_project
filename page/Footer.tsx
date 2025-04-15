import React from 'react'
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Job Categories</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Technology
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Healthcare
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Finance
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Education
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Marketing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Resume Builder
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Career Advice
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Salary Calculator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Interview Tips
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Connect</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fa-brands fa-facebook-f text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fa-brands fa-twitter text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fa-brands fa-linkedin-in text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>
          </div>

          <h3 className="text-white font-semibold mb-2">Payment Methods</h3>
          <div className="flex space-x-3">
            <i className="fa-brands fa-cc-visa text-xl"></i>
            <i className="fa-brands fa-cc-mastercard text-xl"></i>
            <i className="fa-brands fa-cc-paypal text-xl"></i>
            <i className="fa-brands fa-cc-apple-pay text-xl"></i>
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-gray-800" />

      <div className="flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2025 JobPortal. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer