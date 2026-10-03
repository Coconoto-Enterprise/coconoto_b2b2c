import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { HuskSaleModal } from './HuskSaleModal';

const FloatingChatIcon: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Expand to show text after 2 seconds
    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 2000);

    // Collapse back to icon after 6 seconds
    const collapseTimer = setTimeout(() => {
      setIsExpanded(false);
    }, 6000);

    // Repeat the cycle every 10 seconds
    const interval = setInterval(() => {
      setIsExpanded(true);
      setTimeout(() => {
        setIsExpanded(false);
      }, 4000);
    }, 10000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(collapseTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="floating-chat-container" onClick={handleClick}>
        <div className={`floating-chat-wrapper ${isExpanded ? 'expanded' : ''}`}>
          <div className="floating-chat-icon">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <div className="floating-chat-text">
              Sell your coconut husk to us
            </div>
          )}
        </div>

        <style>{`
        .floating-chat-container {
          position: fixed;
          bottom: 80px;
          right: 30px;
          /* Below the sticky navbar (z-50) and every modal (z-[60]+). At 1000 it
             sat on top of the waitlist and order modals, floating over their
             form fields and submit button. */
          z-index: 40;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .floating-chat-wrapper {
          display: flex;
          align-items: center;
          /* Brand green — was the emerald pair #10b981 → #059669. */
          background: linear-gradient(135deg, #27D71D 0%, #1AC212 100%);
          border-radius: 50px;
          padding: 12px;
          box-shadow: 0 10px 25px rgba(26, 194, 18, 0.3);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          overflow: hidden;
          white-space: nowrap;
        }

        .floating-chat-wrapper:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(26, 194, 18, 0.4);
        }

        .floating-chat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          min-height: 24px;
          flex-shrink: 0;
        }

        .floating-chat-wrapper.expanded {
          padding: 12px 20px 12px 12px;
          border-radius: 25px;
        }

        .floating-chat-text {
          color: white;
          font-weight: 600;
          font-size: 14px;
          margin-left: 10px;
          animation: fadeInText 0.5s ease-in-out;
        }

        @keyframes fadeInText {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .floating-chat-container {
            bottom: 24px;
            right: 16px;
          }

          /* Icon-only on phones. The expanded pill is ~230px wide, so on a
             390px screen it sat across whatever it floated over (machine
             photos, product cards). The label is a nice-to-have; not covering
             the page is not. */
          .floating-chat-text {
            display: none;
          }

          .floating-chat-wrapper,
          .floating-chat-wrapper.expanded {
            padding: 12px;
            border-radius: 50px;
          }
        }
      `}</style>
      </div>

      <HuskSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FloatingChatIcon;
