import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, MessageCircle, FileText, HelpCircle } from 'lucide-react';

export function HelpCenter() {
  const categories = [
    {
      icon: <Book className="h-6 w-6" />,
      title: "Getting Started",
      topics: ["Account Setup", "Platform Overview", "Trading Basics"]
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Trading & Transactions",
      topics: ["Making Offers", "Payment Methods", "Escrow Service"]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Documentation",
      topics: ["Required Documents", "Verification Process", "Trade Agreements"]
    }
  ];

  const faqs = [
    {
      question: "How do I get verified as a seller?",
      answer: "To become a verified seller, submit your business documentation through your dashboard and complete our verification process."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept payments through CoconotoPay, bank transfers, and major credit cards."
    },
    {
      question: "How does the escrow service work?",
      answer: "Our escrow service holds payment until both parties confirm the transaction is complete, ensuring safe trading."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">How can we help you?</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 mb-4">{category.icon}</div>
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <ul className="space-y-2">
                {category.topics.map((topic, topicIndex) => (
                  <li key={topicIndex}>
                    <a href="#" className="text-gray-600 hover:text-green-600">{topic}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is available 24/7 to assist you</p>
          <Link
            to="/contact"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}