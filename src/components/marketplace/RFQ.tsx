import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RFQ() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productDetails: '',
    quantity: '',
    deliveryDate: '',
    quoteDeadline: '',
    paymentTerms: '',
    evaluationCriteria: '',
    additionalContactInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('RFQ submitted successfully!');
    // Implement backend integration here
  };

  return (
    <div  id="rfq" className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 space-y-6">
      {/* Heading and Subheading */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Request for Quote</h1>
        <p className="text-lg text-gray-600 mt-2">Submit your request to get quotes from verified suppliers.</p>
      </div>

      {/* Introductory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 border-l-4 border-green-600 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold text-green-800">Easy</h3>
          <p className="text-gray-700 text-sm">It'll take less than 2 minutes to fill the RFQ form.</p>
        </div>
        <div className="p-4 bg-blue-100 border-l-4 border-blue-600 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold text-blue-800">Efficient</h3>
          <p className="text-gray-700 text-sm">Streamline the buying process with a structured request.</p>
        </div>
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-600 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-800">Time-Saving</h3>
          <p className="text-gray-700 text-sm">Receive competitive quotes faster and make informed decisions.</p>
        </div>
      </div>

      {/* RFQ Form */}
      <div  className="p-6 bg-gray-50 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Submit Your RFQ</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email Address" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <input type="number" name="quantity" placeholder="Quantity Required" required className="w-full p-3 border rounded-md" onChange={handleChange} />
          </div>
          
          <textarea name="productDetails" placeholder="Product/Service Requirements" required className="w-full p-3 border rounded-md" onChange={handleChange}></textarea>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Desired Delivery Date</label>
              <input type="date" name="deliveryDate" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Quote Submission Deadline</label>
              <input type="date" name="quoteDeadline" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            </div>
          </div>
          
          <textarea name="paymentTerms" placeholder="Preferred Payment Terms" className="w-full p-3 border rounded-md" onChange={handleChange}></textarea>
          <textarea name="evaluationCriteria" placeholder="Evaluation Criteria (Optional)" className="w-full p-3 border rounded-md" onChange={handleChange}></textarea>
          <textarea name="additionalContactInfo" placeholder="Additional Contact Information" className="w-full p-3 border rounded-md" onChange={handleChange}></textarea>
          
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition">Submit RFQ</button>
        </form>
        
        {/* Explore RFQs Link */}
        <div className="text-center mt-4">
          <Link to="/marketplace/rfqs" className="text-green-600 underline hover:font-bold transition">
            Explore RFQs
          </Link>
        </div>
      </div>
    </div>
  );
}
