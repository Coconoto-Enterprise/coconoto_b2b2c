import { Machine } from './types';
import deshellerImage from '../../../assets/IMG_20250311_180248.jpg';
import dehuskerImage from '../../../assets/dehusking.jpg';
import cocomilkImageAuto from '../../../assets/coconut-milk.jpg';
import cocomilkImageManual from '../../../assets/coconut-milk-manual.jpg';

export const machines: Machine[] = [
  {
    id: 'desheller',
    name: 'Coconut Desheller',
    description: 'High-efficiency coconut deshelling machine for removing coconut kernel from shell. We sell this machine for commercial and industrial use.',
    image: deshellerImage,
    features: [
      'Removes kernel cleanly from shell',
      'Processes up to 240-400 coconuts per hour',
      'Stainless steel construction',
      'Available for purchase : ₦1,000,000',
      '60% Upfront 40% Payment on delivery'
    ]
  },
  {
    id: 'dehusker',
    name: 'Coconut Dehusker',
    description: 'Professional coconut dehusking service for farms, processors, and traders. We offer fast, safe, and efficient dehusking using industrial-grade equipment. ',
    image: dehuskerImage,
    features: [
      'Quick turnaround for bulk orders',
      'Safe and minimal kernel damage',
      'Pickup and delivery options available',
      'Service available for farms and businesses'
    ]
  },
  {
    id: 'cocopeat',
    name: 'Coconut Milk Extractor (Automatic)',
    description: 'Premium coconut milk extractor for efficient coconut milk production. We sell high-quality coconut milk extractors.',
    image: cocomilkImageAuto,
    features: [
      'Pure stainless steel construction',
      'Low maintenance design',
      'Hydraulic press operation',
      'Available for purchase on request'
    ]
  },
  {
    id: 'cocopeat',
    name: 'Coconut Milk Extractor (Manual)',
    description: 'Premium coconut milk extractor for efficient coconut milk production. We sell high-quality coconut milk extractors.',
    image: cocomilkImageManual,
    features: [
      'Pure stainless steel construction',
      'Low maintenance design',
      'Hydraulic press operation',
      'Available for purchase on request'
    ]
  }
];