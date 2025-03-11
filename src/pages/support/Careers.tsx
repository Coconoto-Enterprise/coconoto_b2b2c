import React from 'react';
import Navbar from '/src/components/Navbar';
import Footer from '/src/components/Footer';
import { Briefcase, Users, Globe, TrendingUp } from 'lucide-react';

export default function Careers() {
  const positions = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "New York / Remote",
      type: "Full-time"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "London",
      type: "Full-time"
    },
    {
      title: "Business Development Manager",
      department: "Sales",
      location: "Singapore",
      type: "Full-time"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    }
  ];

  const benefits = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Remote-First",
      description: "Work from anywhere in the world"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Great Team",
      description: "Collaborate with talented individuals"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth",
      description: "Continuous learning and development"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-green-700 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-green-100 mb-8">
              Help us revolutionize the coconut trade industry
            </p>
            <a
              href="#positions"
              className="bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition"
            >
              View Open Positions
            </a>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-green-600 flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div id="positions" className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div key={index} className="border-b pb-6 last:border-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {position.department}
                        </span>
                        <span className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          {position.location}
                        </span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <button className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't see the right position?</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals to join our team.
            </p>
            <a
              href="mailto:careers@coconoto.com"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Send us your resume →
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
