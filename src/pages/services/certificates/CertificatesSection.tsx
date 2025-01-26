import React from 'react';
import { Award, CheckCircle, FileCheck } from 'lucide-react';

export function CertificatesSection() {
  const certificates = [
    {
      type: 'Patent',
      title: 'Coconut Processing Technology',
      number: 'US10123456B2',
      issueDate: '2023',
      image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
      description: 'Patent for innovative coconut processing machinery design'
    },
    {
      type: 'ISO Certification',
      title: 'ISO 9001:2015',
      number: 'QMS-123456',
      issueDate: '2023',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      description: 'Quality Management System Certification'
    },
    {
      type: 'License',
      title: 'Manufacturing License',
      number: 'ML-789012',
      issueDate: '2023',
      image: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=800',
      description: 'Industrial Manufacturing Authorization'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Certifications</h2>
          <p className="text-xl text-gray-600">
            Recognized and certified for excellence in coconut processing technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {certificates.map((cert, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {cert.type === 'Patent' && <FileCheck className="h-5 w-5 text-blue-600" />}
                  {cert.type === 'ISO Certification' && <Award className="h-5 w-5 text-green-600" />}
                  {cert.type === 'License' && <CheckCircle className="h-5 w-5 text-purple-600" />}
                  <span className="text-sm font-medium text-gray-500">{cert.type}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                <p className="text-gray-600 mb-4">{cert.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Certificate No: {cert.number}</p>
                  <p>Issue Date: {cert.issueDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Patents Registered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-gray-600">ISO Certifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-gray-600">Industry Licenses</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}