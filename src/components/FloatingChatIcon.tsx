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
          z-index: 1000;
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
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50px;
          padding: 12px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          overflow: hidden;
          white-space: nowrap;
        }

        .floating-chat-wrapper:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
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
            bottom: 60px;
            right: 20px;
          }

          .floating-chat-text {
            font-size: 12px;
          }

          .floating-chat-wrapper {
            padding: 10px;
          }

          .floating-chat-wrapper.expanded {
            padding: 10px 16px 10px 10px;
          }
        }
      `}</style>
      </div>

      <HuskSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FloatingChatIcon;
