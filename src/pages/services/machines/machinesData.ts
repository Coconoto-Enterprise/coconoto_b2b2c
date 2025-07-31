import { Machine } from './types';
import deshellerImage from '../../../assets/IMG_20250311_180248.jpg';
import dehuskerImage from '../../../assets/dehusking.jpg';
import cocopeatImage from '../../../assets/cocpeat1.jpeg';

export const machines: Machine[] = [
  {
    id: 'desheller',
    name: 'Coconut Desheller',
    description: 'Advanced coconut deshelling machine with high efficiency and minimal waste.',
    image: deshellerImage,
    features: [
      'Processes up to 3000 coconuts per hour',
      'Stainless steel construction',
      'Low maintenance design',
      'Minimal kernel damage'
    ]
  },
  {
    id: 'dehusker',
    name: 'Coconut Dehusker',
    description: 'Industrial-grade dehusking machine for quick and efficient husk removal.',
    image: dehuskerImage,
    features: [
      'Automatic feeding system',
      'Heavy-duty construction',
      'Safe operation design',
      'Easy maintenance'
    ]
  },
  {
    id: 'cocopeat',
    name: 'Cocopeat Production',
    description: 'Complete cocopeat processing line for high-quality output.',
    image: cocopeatImage,
    features: [
      'Integrated crushing system',
      'Automatic sieving',
      'Moisture control',
      'Block forming capability'
    ]
  }
];
