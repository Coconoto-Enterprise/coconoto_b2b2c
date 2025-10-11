import React from 'react';
import cocopeat from '../../../assets/cocpeat1.jpeg';
import cocofiber from '../../../assets/fiber.jpeg';
import cocopot from '../../../assets/cocopot2.jpg';
import biochar from '../../../assets/biochar.jpeg';

export function BuildingSection() {
  return (
    <section id="building" className="py-5 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Eco-Friendly Coconut Products
        </h2>

        {/* Cocopeat */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6">Cocopeat</h3>
          <p className="text-gray-600 mb-6">Nutrient-rich growing medium perfect for sustainable agriculture and gardening.</p>
          
          {/* Desktop: Text left, Image right */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>High Water Retention:</strong> Holds up to 10 times its weight in water, reducing irrigation needs.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>pH Neutral:</strong> Provides optimal growing conditions for most plants and crops.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Sustainable Alternative:</strong> Eco-friendly replacement for traditional peat moss.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Disease Resistant:</strong> Natural antifungal properties protect plant roots.</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src={cocopeat}
                alt="Cocopeat"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Mobile: Text first, Image below */}
          <div className="md:hidden">
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>High Water Retention:</strong> Holds up to 10 times its weight in water, reducing irrigation needs.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>pH Neutral:</strong> Provides optimal growing conditions for most plants and crops.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Sustainable Alternative:</strong> Eco-friendly replacement for traditional peat moss.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Disease Resistant:</strong> Natural antifungal properties protect plant roots.</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src={cocopeat}
                alt="Cocopeat"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Fiber */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-2xl font-bold mb-6">Fiber</h3>
            <p className="text-gray-600 mb-6">Biodegradable material perfect for eco-friendly crafts and sustainable packaging solutions.</p>
            
            {/* Mobile: Text first, Image below */}
            <div className="md:hidden">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>100% Biodegradable:</strong> Naturally decomposes without environmental impact.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>High Durability:</strong> Strong fiber structure suitable for various applications.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Moisture Resistant:</strong> Natural properties protect against humidity and water damage.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Versatile Usage:</strong> Ideal for crafts, packaging, and industrial applications.</span>
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src={cocofiber}
                  alt="Coconut Fiber"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Desktop: Image left, Text right */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center">
                <img
                  src={cocofiber}
                  alt="Coconut Fiber"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>100% Biodegradable:</strong> Naturally decomposes without environmental impact.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>High Durability:</strong> Strong fiber structure suitable for various applications.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>Moisture Resistant:</strong> Natural properties protect against humidity and water damage.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>Versatile Usage:</strong> Ideal for crafts, packaging, and industrial applications.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cocopot */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-2xl font-bold mb-6">Cocopot</h3>
            <p className="text-gray-600 mb-6">Eco-friendly plant containers that biodegrade naturally while nurturing plant growth.</p>
            
            {/* Desktop: Text left, Image right */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Biodegradable Design:</strong> Breaks down naturally in soil, enriching the earth.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Root-Friendly:</strong> Allows roots to grow through walls as pot decomposes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Zero Transplant Shock:</strong> Plant directly in ground without removing container.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Sustainable Choice:</strong> Made from renewable coconut waste materials.</span>
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src={cocopot}
                  alt="Cocopot"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Mobile: Text first, Image below */}
            <div className="md:hidden">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Biodegradable Design:</strong> Breaks down naturally in soil, enriching the earth.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Root-Friendly:</strong> Allows roots to grow through walls as pot decomposes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Zero Transplant Shock:</strong> Plant directly in ground without removing container.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Sustainable Choice:</strong> Made from renewable coconut waste materials.</span>
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src={cocopot}
                  alt="Cocopot"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Biochar */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-2xl font-bold mb-6">Biochar</h3>
            <p className="text-gray-600 mb-6">Premium carbon-rich soil amendment created from coconut shells through sustainable pyrolysis.</p>
            
            {/* Mobile: Text first, Image below */}
            <div className="md:hidden">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Carbon Sequestration:</strong> Locks carbon in soil for decades, fighting climate change.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Soil Enhancement:</strong> Improves soil structure, water retention, and nutrient availability.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Microbial Support:</strong> Creates ideal habitat for beneficial soil microorganisms.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                    <span><strong>Long-lasting:</strong> Stable in soil for hundreds of years, providing lasting benefits.</span>
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src={biochar}
                  alt="Biochar"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Desktop: Image left, Text right */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center">
                <img
                  src={biochar}
                  alt="Biochar"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Key Features & Benefits</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>Carbon Sequestration:</strong> Locks carbon in soil for decades, fighting climate change.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>Soil Enhancement:</strong> Improves soil structure, water retention, and nutrient availability.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>Microbial Support:</strong> Creates ideal habitat for beneficial soil microorganisms.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                      <span><strong>Long-lasting:</strong> Stable in soil for hundreds of years, providing lasting benefits.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}