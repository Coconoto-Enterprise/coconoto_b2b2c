
import React, { useState } from 'react';
import { Award, CheckCircle, FileCheck } from 'lucide-react';
import patent1 from '../../../assets/patent docs _page-0001.jpg';
import patent2 from '../../../assets/patent docs _page-0002.jpg';
import companyCert from '../../../assets/CompanyCertificate.jpg';

export function CertificatesSection() {
  const certificates = [
    {
      type: 'Patent',
      title: 'Certificate of Registration of Utility Model Patent',
      number: 'NG/PT/NC/O/2024/14257',
      issueDate: '2024',
      image: patent1,
      description: 'Federal Republic of Nigeria Utility Model Patent for Coconut Deshelling Machine.'
    },
    {
      type: 'Patent',
      title: 'Certificate of Registration of Utility Model Patent',
      number: 'NG/PT/NC/2024/14256',
      issueDate: '2024',
      image: patent2,
      description: 'Federal Republic of Nigeria Utility Model Patent for Coconut Dehusking Machine.'
    },
    {
      type: 'License',
      title: 'Certificate of Registration',
      number: '3674818',
      issueDate: '2022',
      image: companyCert,
      description: 'Business Name Registration for Coconoto Enterprise, Nigeria.'
    }
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Certifications</h2>
          <p className="text-xl text-gray-600">
            Recognized and certified for excellence in coconut processing technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {certificates.map((cert, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
              <div className="h-48 overflow-hidden" onClick={() => { setSelectedCert(cert); setModalOpen(true); }}>
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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

        {/* Modal for full image */}
        {modalOpen && selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="relative max-w-3xl w-full mx-4 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-700 bg-white bg-opacity-80 rounded-full p-1 hover:bg-gray-200"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold mb-2">{selectedCert.title}</h3>
                <p className="text-gray-600 mb-2">{selectedCert.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Certificate No: {selectedCert.number}</p>
                  <p>Issue Date: {selectedCert.issueDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}