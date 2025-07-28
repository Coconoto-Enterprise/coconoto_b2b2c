import { Machine } from './types';

export const machines: Machine[] = [
  {
    id: 'desheller',
    name: 'Coconut Desheller',
    description: 'Advanced coconut deshelling machine with high efficiency and minimal waste.',
    image: './src/assets/IMG_20250311_180248.jpg',
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
    image: './src/assets/dehusking.png',
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
    image: './src/assets/cocpeat1.jpeg',
    features: [
      'Integrated crushing system',
      'Automatic sieving',
      'Moisture control',
      'Block forming capability'
    ]
  }
];