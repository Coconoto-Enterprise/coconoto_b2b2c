import { Machine } from './types';

export const machines: Machine[] = [
  {
    id: 'desheller',
    name: 'Coconut Desheller',
    description: 'Advanced coconut deshelling machine with high efficiency and minimal waste.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/UP/YE/YH/3823480/coconut-deshelling-machine.jpg',
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
    image: 'https://4.imimg.com/data4/QY/YY/MY-3823480/coconut-dehusking-machine-500x500.jpg',
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
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/12/MI/CM/DN/142585347/coco-peat-block-making-machine.jpg',
    features: [
      'Integrated crushing system',
      'Automatic sieving',
      'Moisture control',
      'Block forming capability'
    ]
  },
  {
    id: 'grinder',
    name: 'Shell Grinder',
    description: 'Precision grinding machine for coconut shell processing.',
    image: 'https://4.imimg.com/data4/PW/PW/GLADMIN-3823480/1-500x500.jpg',
    features: [
      'Multiple grinding sizes',
      'Dust collection system',
      'Energy efficient',
      'Low noise operation'
    ]
  }
];