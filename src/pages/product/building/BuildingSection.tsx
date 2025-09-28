import React from 'react';
import dehuskingImg from '../../../assets/dehusking.jpg';
import deshellingImg from '../../../assets/IMG_20250311_180248.jpg';

export function BuildingSection() {
  return (
    <section id="building" className="py-5 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Industrial Machinery Specifications
        </h2>

        {/* Dehusking Machine */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6">Coconut Dehusking Machine</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Advantages and Applications</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>High Throughput:</strong> Processes 500-900 coconuts per hour, significantly increasing productivity over manual methods.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Safety and Ease of Use:</strong> Automated operation minimizes injury risk, operable by a single user with minimal training.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Cost-Effectiveness:</strong> Uses locally available materials, making it affordable for farmers and processors.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  <span><strong>Versatility:</strong> Suitable for various settings from small farms to large processing plants.</span>
                </li>
              </ul>
            </div>
            <div>
              <img
                src={dehuskingImg}
                alt="Dehusking Machine"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Deshelling Machine */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-2xl font-bold mb-6">Coconut Deshelling Machine</h3>
            {/* Mobile layout: image right, text left */}
            <div className="flex md:hidden flex-col gap-8 mb-8">
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div>
                  <h5 className="font-semibold text-green-700">Material Construction</h5>
                  <p className="text-gray-600">Built with locally sourced materials including mild steel angle iron frame, stainless steel cutting teeth, and corrosion-resistant exterior.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700">Industrial Application</h5>
                  <p className="text-gray-600">Designed for coconut processing factories producing oil, milk, and water, ensuring efficient processing without compromising product quality.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700">Dual-User Operation</h5>
                  <p className="text-gray-600">Engineered for simultaneous operation by two users, enhancing workflow efficiency and output.</p>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={deshellingImg}
                  alt="Deshelling Machine"
                  className="rounded-lg shadow-md w-full h-64 object-cover mb-4"
                />
              </div>
            </div>
            {/* Desktop layout: image left, text right */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center">
                <img
                  src={deshellingImg}
                  alt="Deshelling Machine"
                  className="rounded-lg shadow-md w-full h-64 object-cover mb-4 md:mb-0"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-green-700">Material Construction</h5>
                  <p className="text-gray-600">Built with locally sourced materials including mild steel angle iron frame, stainless steel cutting teeth, and corrosion-resistant exterior.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700">Industrial Application</h5>
                  <p className="text-gray-600">Designed for coconut processing factories producing oil, milk, and water, ensuring efficient processing without compromising product quality.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700">Dual-User Operation</h5>
                  <p className="text-gray-600">Engineered for simultaneous operation by two users, enhancing workflow efficiency and output.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}