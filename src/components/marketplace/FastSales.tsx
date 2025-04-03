import React, { useState } from 'react';

export default function FastSales() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    warehouseLocation: '',
    officeLocation: '',
    productDetails: '',
    pricePerUnit: '',
    priceUnit: 'kg',
    lastPrice: '',
    minQuantity: '',
    minQuantityUnit: 'tons',
    monthlySupplyCapacity: '',
    monthlySupplyUnit: 'tons',
    expiryDate: '',
    productImages: null,
    warehouseImages: null,
    cacCertificate: null,
    industryCertificates: null,
    paymentMade: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.files });
  };

  const handleFlutterwavePayment = () => {
    alert('Redirecting to Flutterwave payment gateway...');
    setTimeout(() => {
      setFormData({ ...formData, paymentMade: true });
      alert('Payment successful! You can now submit your application.');
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMade) {
      alert('Please complete the payment before submitting the application.');
      return;
    }
    alert('Application submitted successfully!');
  };

  return (
    <div id='suppliers' className="max-w-4xl mx-auto p-6 bg-green-100 shadow-lg rounded-lg mt-8 mb-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">FastSales Supplier Application</h1>
        <p className="text-lg text-gray-600 mt-2">Submit your details and get connected with buyers faster.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name" required className="w-full p-3 border rounded-md" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" required className="w-full p-3 border rounded-md" onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-3 border rounded-md" onChange={handleChange} />
          <input type="text" name="businessName" placeholder="Business Name" required className="w-full p-3 border rounded-md" onChange={handleChange} />
          <input type="text" name="warehouseLocation" placeholder="Warehouse Location" required className="w-full p-3 border rounded-md" onChange={handleChange} />
          <input type="text" name="officeLocation" placeholder="Office Location" required className="w-full p-3 border rounded-md" onChange={handleChange} />
        </div>

        <textarea name="productDetails" placeholder="Describe the product(s) you supply" required className="w-full p-3 border rounded-md" onChange={handleChange}></textarea>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <input type="number" name="pricePerUnit" placeholder="Price" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <select name="priceUnit" className="p-3 border rounded-md" onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="tons">tons</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input type="number" name="lastPrice" placeholder="Last Price" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <select name="priceUnit" className="p-3 border rounded-md" onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="tons">tons</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input type="number" name="minQuantity" placeholder="Minimum Quantity" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <select name="minQuantityUnit" className="p-3 border rounded-md" onChange={handleChange}>
              <option value="tons">tons</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input type="number" name="monthlySupplyCapacity" placeholder="Monthly Supply Capacity" required className="w-full p-3 border rounded-md" onChange={handleChange} />
            <select name="monthlySupplyUnit" className="p-3 border rounded-md" onChange={handleChange}>
              <option value="tons">tons</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Product Expiry</label>
          <input type="date" name="expiryDate" required className="w-full p-3 border rounded-md" onChange={handleChange} placeholder="Select expiry date" />
        </div>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={handleFlutterwavePayment} className="w-1/2 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition mr-2">
            Pay Now
          </button>
          <button type="submit" className={`w-1/2 p-3 rounded-md transition ${formData.paymentMade ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} disabled={!formData.paymentMade}>
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}


