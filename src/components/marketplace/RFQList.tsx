import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { MarketplaceNavbar } from '../marketplace/MarketplaceNavbar';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import { MarketplaceEscrow } from '../marketplace/MarketplaceEscrow';
import { buyerRequests } from '../ProBuyerRequests';
import { ProSupplyModal } from './ProSupplyModal';
import { RFQResponseModal } from './RFQResponseModal';

// Regular RFQ data
const rfqData = [
  {
    id: 1,
    productName: "Fresh Young Coconuts",
    image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=800",
    type: "Raw Coconuts",
    specifications: "Green, young coconuts, 6-8 months maturity",
    quantity: "20,000 units",
    price: "$1.20 - $1.50 per unit",
    location: "Dubai, UAE",
    deliveryTimeframe: "Within 30 days",
    expiryDate: "2024-02-15",
    status: "Urgent",
    buyerInfo: {
      name: "Global Foods Trading LLC",
      verificationStatus: "Verified"
    }
  },
  {
    id: 2,
    productName: "Virgin Coconut Oil",
    image: "https://images.unsplash.com/photo-1620905969432-d7a31d1b4598?w=800",
    type: "Processed Products",
    specifications: "Organic certified, cold-pressed, unrefined",
    quantity: "5,000 liters",
    price: "$8.00 - $10.00 per liter",
    location: "Singapore",
    deliveryTimeframe: "45 days",
    expiryDate: "2024-02-20",
    status: "Active",
    buyerInfo: {
      name: "Healthy Foods Asia Pte Ltd",
      verificationStatus: "Verified"
    }
  },
  {
    id: 3,
    productName: "Coconut Shell Charcoal",
    image: "https://images.unsplash.com/photo-1563473213013-c27140191b88?w=800",
    type: "Industrial Products",
    specifications: "High-grade activated carbon, mesh size 8x16",
    quantity: "10 containers",
    price: "Market Price",
    location: "Rotterdam, Netherlands",
    deliveryTimeframe: "60 days",
    expiryDate: "2024-02-25",
    status: "Urgent",
    buyerInfo: {
      name: "Euro Charcoal Imports BV",
      verificationStatus: "Verified"
    }
  },
  {
    id: 4,
    productName: "Desiccated Coconut",
    image: "https://images.unsplash.com/photo-1586377253577-f8b11f929ad8?w=800",
    type: "Processed Products",
    specifications: "Fine grade, low fat, white color",
    quantity: "25 tons",
    price: "$2.80 - $3.20 per kg",
    location: "Melbourne, Australia",
    deliveryTimeframe: "40 days",
    expiryDate: "2024-02-28",
    status: "Active",
    buyerInfo: {
      name: "Pacific Food Distributors",
      verificationStatus: "Verified"
    }
  },
  {
    id: 5,
    productName: "Coir Fiber",
    image: "https://images.unsplash.com/photo-1585560595756-c85530798b13?w=800",
    type: "Industrial Products",
    specifications: "Brown fiber, length 15-20cm",
    quantity: "100 tons",
    price: "$350 - $400 per ton",
    location: "Mumbai, India",
    deliveryTimeframe: "30 days",
    expiryDate: "2024-03-05",
    status: "Active",
    buyerInfo: {
      name: "Indian Coir Exports Ltd",
      verificationStatus: "Verified"
    }
  },
  {
    id: 6,
    productName: "Coconut Water",
    image: "https://images.unsplash.com/photo-1544253014-b43c3c12b8d2?w=800",
    type: "Beverages",
    specifications: "100% pure, no additives",
    quantity: "50,000 liters",
    price: "$1.50 - $1.80 per liter",
    location: "Los Angeles, USA",
    deliveryTimeframe: "25 days",
    expiryDate: "2024-03-10",
    status: "Urgent",
    buyerInfo: {
      name: "West Coast Beverages Inc",
      verificationStatus: "Verified"
    }
  },
  {
    id: 7,
    productName: "Coconut Sugar",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800",
    type: "Processed Products",
    specifications: "Organic certified, crystalline form",
    quantity: "15 tons",
    price: "$3.50 - $4.00 per kg",
    location: "Berlin, Germany",
    deliveryTimeframe: "35 days",
    expiryDate: "2024-03-15",
    status: "Active",
    buyerInfo: {
      name: "Bio Foods GmbH",
      verificationStatus: "Verified"
    }
  },
  {
    id: 8,
    productName: "Coconut Milk Powder",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
    type: "Processed Products",
    specifications: "Spray-dried, 65% fat content",
    quantity: "10 tons",
    price: "$8.00 - $9.50 per kg",
    location: "Toronto, Canada",
    deliveryTimeframe: "45 days",
    expiryDate: "2024-03-20",
    status: "Active",
    buyerInfo: {
      name: "North American Foods Ltd",
      verificationStatus: "Verified"
    }
  },
  {
    id: 9,
    productName: "Coconut Shell Powder",
    image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800",
    type: "Industrial Products",
    specifications: "80-100 mesh size",
    quantity: "50 tons",
    price: "$400 - $450 per ton",
    location: "Shanghai, China",
    deliveryTimeframe: "30 days",
    expiryDate: "2024-03-25",
    status: "Urgent",
    buyerInfo: {
      name: "Shanghai Industrial Group",
      verificationStatus: "Verified"
    }
  },
  {
    id: 10,
    productName: "Coconut Fiber Pots",
    image: "https://images.unsplash.com/photo-1624451546441-fb4191a74ca3?w=800",
    type: "Agricultural Products",
    specifications: "6-inch diameter, biodegradable",
    quantity: "100,000 units",
    price: "$0.50 - $0.75 per unit",
    location: "Amsterdam, Netherlands",
    deliveryTimeframe: "40 days",
    expiryDate: "2024-03-30",
    status: "Active",
    buyerInfo: {
      name: "Dutch Garden Supplies BV",
      verificationStatus: "Verified"
    }
  }
];

// Transform Pro buyer requests to match RFQ data structure
const proRequests = buyerRequests.map(request => ({
  id: `pro-${request.id}`,
  productName: request.product,
  image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=800",
  type: "Coconoto Pro",
  specifications: `${request.quantity} ${request.unit}`,
  quantity: `${request.quantity} ${request.unit}`,
  price: `$${request.price} per ${request.unit.replace(/s$/, '')}`,
  location: request.location,
  deliveryTimeframe: "As per agreement",
  expiryDate: request.deadline,
  status: request.urgent ? "Urgent" : "Active",
  isPro: true,
  buyerInfo: {
    name: "Verified Pro Buyer",
    verificationStatus: "Coconoto Pro"
  }
}));

// Combine all requests
const allRequests = [...rfqData, ...proRequests];

export function RFQList() {
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isProSupplyModalOpen, setIsProSupplyModalOpen] = useState(false);
  const [isRFQResponseModalOpen, setIsRFQResponseModalOpen] = useState(false);

  const filteredRFQs = filter === 'all' 
    ? allRequests 
    : filter === 'pro'
    ? allRequests.filter(rfq => rfq.isPro)
    : allRequests.filter(rfq => rfq.status.toLowerCase() === filter && !rfq.isPro);

  const handleResponseClick = (request: any) => {
    setSelectedRequest(request);
    if (request.isPro) {
      setIsProSupplyModalOpen(true);
    } else {
      setIsRFQResponseModalOpen(true);
    }
  };

  return (
    <>
      <MarketplaceNavbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Request For Quotes, RFQs</h1>
            <p className="text-xl text-gray-600">Browse and respond to buyer requests</p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              All RFQs
            </button>
            <button 
              onClick={() => setFilter('urgent')}
              className={`px-6 py-2 rounded-full ${
                filter === 'urgent' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              Urgent RFQs
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-6 py-2 rounded-full ${
                filter === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              Active RFQs
            </button>
            <button 
              onClick={() => setFilter('pro')}
              className={`px-6 py-2 rounded-full ${
                filter === 'pro' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              Coconoto Pro
            </button>
          </div>

          {/* RFQ List */}
          <div className="grid gap-6">
            {filteredRFQs.map((rfq) => (
              <div key={rfq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-48 h-48">
                      <img
                        src={rfq.image}
                        alt={rfq.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* RFQ Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{rfq.productName}</h2>
                        <div className="flex items-center gap-2">
                          {rfq.isPro && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              Coconoto Pro
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            rfq.status === 'Urgent' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {rfq.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600">Type: {rfq.type}</p>
                          <p className="text-gray-600">Specifications: {rfq.specifications}</p>
                          <p className="text-gray-600">Quantity: {rfq.quantity}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-5 w-5" />
                            <span>Price Range: {rfq.price}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-5 w-5" />
                            <span>{rfq.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-5 w-5" />
                            <span>Delivery: {rfq.deliveryTimeframe}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Buyer: {rfq.buyerInfo.name}</p>
                          <div className="flex items-center gap-1 text-green-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{rfq.buyerInfo.verificationStatus}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="h-5 w-5" />
                            <span>Expires: {new Date(rfq.expiryDate).toLocaleDateString()}</span>
                          </div>
                          <button 
                            onClick={() => handleResponseClick(rfq)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                          >
                            Respond to RFQ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MarketplaceEscrow />
      <MarketplaceFooter />

      {selectedRequest && selectedRequest.isPro && (
        <ProSupplyModal
          isOpen={isProSupplyModalOpen}
          onClose={() => setIsProSupplyModalOpen(false)}
          request={{
            product: selectedRequest.productName,
            quantity: selectedRequest.quantity.split(' ')[0],
            unit: selectedRequest.quantity.split(' ')[1],
            price: parseFloat(selectedRequest.price.split(' ')[0].replace('$', '')),
            location: selectedRequest.location,
            deadline: selectedRequest.expiryDate
          }}
        />
      )}

      {selectedRequest && !selectedRequest.isPro && (
        <RFQResponseModal
          isOpen={isRFQResponseModalOpen}
          onClose={() => setIsRFQResponseModalOpen(false)}
          rfq={{
            productName: selectedRequest.productName,
            quantity: selectedRequest.quantity,
            price: selectedRequest.price,
            location: selectedRequest.location,
            expiryDate: selectedRequest.expiryDate
          }}
        />
      )}
    </>
  );
}