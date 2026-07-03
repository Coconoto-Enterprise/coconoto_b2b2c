export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  linkedIn?: string;
  profileImage: string;
  description: string;
}

export const profiles: Profile[] = [
  {
    id: 'jacob-abiodun',
    firstName: 'Jacob',
    lastName: 'Abiodun',
    role: 'Founder / CEO',
    email: 'Jacob.abiodun@coconoto.africa',
    phone: '+2348148609051',
    linkedIn:
      'https://www.linkedin.com/in/jacob-abiodun-0a2aa0109?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Jacob%20Abiodun',
    description:
      'Jacob Abiodun is an engineer, entrepreneur, and sustainability advocate. He holds a degree in Mechanical Engineering from FUTA and builds Agritech solutions to transform the coconut value chain through innovative processing technologies and waste-to-value systems.'
  },
  {
    id: 'adetonajamiu',
    firstName: 'Jamiu',
    lastName: 'Adetona',
    role: 'Production R&D Engineer',
    email: 'adetonajamiu50@gmail.com',
    phone: '07068957675',
    linkedIn:
      'https://www.linkedin.com/in/adetona-jamiu-6bb6981b1?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Jamiu%20Adetona',
    description:
      'Designing the future of agritech hardware through end-to-end 3D CAD development, parametric modeling, and assembly verification. Jamiu bridges virtual engineering with practical fabrication to build patent-backed, high-efficiency industrial processing machinery.'
  },
  {
    id: 'daniel-abiodun',
    firstName: 'Daniel',
    lastName: 'Abiodun',
    role: 'Head of Operations',
    email: 'danieliyanuoluwa2@gmail.com',
    phone: '08108101319',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Daniel%20Abiodun',
    description:
      'A dedicated, hardworking operations leader with strong communication and organizational skills. Daniel works independently and in teams to deliver results, continuously learning and making a positive impact across business operations.'
  },
  {
    id: 'mojolaoluwa-abiodun',
    firstName: 'Mojolaoluwa',
    lastName: 'Abiodun',
    role: 'Technical Writer / Creative Lead',
    email: 'jolabiodun@gmail.com',
    phone: '07016547356',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Mojolaoluwa%20Abiodun',
    description:
      'A versatile writer and creative professional skilled in academic research writing, technical writing, creative brand strategy, and CV building, with a growing interest in business development.'
  },
  {
    id: 'precious-charles',
    firstName: 'Precious',
    lastName: 'Charles',
    role: 'Video Editor',
    email: 'preciouscharles.theva@gmail.com',
    phone: '09165387838',
    linkedIn: 'https://linktr.ee/PreciousCharles1',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Precious%20Charles',
    description:
      'Precious Charles is a video content editor and business enthusiast who helps brands create memorable visual stories through editing and production support.'
  },
  {
    id: 'precious-abiola',
    firstName: 'Precious',
    lastName: 'Abiola',
    role: 'Creative Director / Graphics Designer',
    email: 'preciousabiola202726@gmail.com',
    phone: '08051243003',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Precious%20Abiola',
    description:
      'A creative, detail-oriented graphic designer with a strong eye for visual storytelling. Precious transforms ideas into engaging designs that enhance brand identity and support marketing campaigns.'
  }
];
