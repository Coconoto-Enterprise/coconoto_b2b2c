import { Machine } from './types';
import deshellerImage from '../../../assets/IMG_20250311_180248.jpg';
import dehuskerImage from '../../../assets/dehusking.jpg';
import cocopeatImage from '../../../assets/cocpeat1.jpeg';

export const machines: Machine[] = [
  {
    id: 'desheller',
    name: 'Coconut Desheller',
    description: 'High-efficiency coconut deshelling machine for removing coconut kernel from shell. We sell this machine for commercial and industrial use.',
    image: deshellerImage,
    features: [
      'Removes kernel cleanly from shell',
      'Processes up to 3000 coconuts per hour',
      'Stainless steel construction',
      'Low maintenance design',
      'Available for purchase'
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
    name: 'Cocopeat',
    description: 'Premium cocopeat blocks and loose cocopeat for horticulture, gardening, and soil improvement. We sell high-quality cocopeat, not machinery or processing services.',
    image: cocopeatImage,
    features: [
      '100% natural and organic',
      'Excellent water retention',
      'Ideal for seed starting and potting mixes',
      'Bulk and retail orders accepted'
    ]
  }
];
