import JacobPhoto from '../assets/team/Jacob.jpg';
import JamiuPhoto from '../assets/team/Jamiu.png';
import DanielPhoto from '../assets/team/Daniel.jpg';
import MojolaoluwaPhoto from '../assets/team/Mojolaoluwa Abiodun Jolaoluwa.jpg';
import PreciousCharlesPhoto from '../assets/team/Precious (Charles).jpg';
import AbiolaPreciousPhoto from '../assets/team/Abiola Precious.jpg';

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
    profileImage: JacobPhoto,
    description:
      'Jacob Abiodun is an engineer, entrepreneur, and sustainability advocate. He holds a degree in Mechanical Engineering from FUTA and builds Agritech solutions to transform the coconut value chain through innovative processing technologies and waste-to-value systems.'
  },
  {
    id: 'adetonajamiu',
    firstName: 'Jamiu',
    lastName: 'Adetona',
    role: 'Production R&D Engineer',
    email: 'adetona.jamiu@coconoto.africa',
    phone: '+2347068957675',
    linkedIn:
      'https://www.linkedin.com/in/adetona-jamiu-6bb6981b1?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    profileImage: JamiuPhoto,
    description:
      'Designing the future of agritech hardware through end-to-end 3D CAD development, parametric modeling, and assembly verification. Jamiu bridges virtual engineering with practical fabrication to build patent-backed, high-efficiency industrial processing machinery.'
  },
  {
    id: 'daniel-abiodun',
    firstName: 'Daniel',
    lastName: 'Abiodun',
    role: 'Head of Operations',
    email: 'daniel.iyanuoluwa@coconoto.africa',
    phone: '+2348108101319',
    profileImage: DanielPhoto,
    description:
      'A dedicated, hardworking operations leader with strong communication and organizational skills. Daniel works independently and in teams to deliver results, continuously learning and making a positive impact across business operations.'
  },
  {
    id: 'mojolaoluwa-abiodun',
    firstName: 'Mojolaoluwa',
    lastName: 'Abiodun',
    role: 'Technical Writer / Creative Lead',
    email: 'jola.abiodun@coconoto.africa',
    phone: '+2347016547356',
    profileImage: MojolaoluwaPhoto,
    description:
      'A versatile writer and creative professional skilled in academic research writing, technical writing, creative brand strategy, and CV building, with a growing interest in business development.'
  },
  {
    id: 'precious-charles',
    firstName: 'Precious',
    lastName: 'Charles',
    role: 'Video Editor',
    email: 'precious.charles@coconoto.africa',
    phone: '+2349165387838',
    linkedIn: 'https://linktr.ee/PreciousCharles1',
    profileImage: PreciousCharlesPhoto,
    description:
      'Precious Charles is a video content editor and business enthusiast who helps brands create memorable visual stories through editing and production support.'
  },
  {
    id: 'precious-abiola',
    firstName: 'Precious',
    lastName: 'Abiola',
    role: 'Creative Director / Graphics Designer',
    email: 'precious.abiola@coconoto.africa',
    phone: '+2348051243003',
    profileImage: AbiolaPreciousPhoto,
    description:
      'A creative, detail-oriented graphic designer with a strong eye for visual storytelling. Precious transforms ideas into engaging designs that enhance brand identity and support marketing campaigns.'
  },
  {
    id: 'elisabeth-omitoyin',
    firstName: 'Elisabeth',
    lastName: 'Omitoyin',
    role: 'Coconoto Team Member',
    email: 'omitoyin.elisabeth@coconoto.africa',
    phone: '',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Elisabeth%20Omitoyin',
    description: 'Elisabeth is a valued member of the Coconoto team. Profile details are being updated.'
  },
  {
    id: 'esther-omitoyin',
    firstName: 'Esther',
    lastName: 'Omitoyin',
    role: 'Leadership & Growth Enthusiast',
    email: 'omitoyin.esther@coconoto.africa',
    phone: '',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Esther%20Omitoyin',
    description:
      'Esther is passionate about growth and leadership, with a background in adult education and English literature from the University of Benin.'
  },
  {
    id: 'enoch-bamigboye',
    firstName: 'Enoch',
    lastName: 'Bamigboye',
    role: 'Software Developer',
    email: 'enoch.bamigboye@coconoto.africa',
    phone: '+2349131678833',
    linkedIn: 'https://www.linkedin.com/in/bamigboye-enoch-5a82a8368',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Enoch%20Bamigboye',
    description:
      "I'm a software developer and graduate; I build applications across domains.",
  },
  {
    id: 'oluwatoke-evelyn-faeji',
    firstName: 'Oluwatoke',
    lastName: 'Faeji',
    role: 'Fisheries Student & Writer',
    email: 'oluwatoke.evelyn@coconoto.africa',
    phone: '',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Oluwatoke%20Evelyn%20Faeji',
    description:
      'Oluwatoke is a 500L Fisheries student at the University of Lagos with experience in social media, program management, logistics, creative writing, and team coordination.'
  },
  {
    id: 'timilehin-favour-oluwayemi',
    firstName: 'Timilehin',
    lastName: 'Oluwayemi',
    role: 'Customer Support Specialist',
    email: 'timilehin.favour@coconoto.africa',
    phone: '',
    profileImage:
      'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Timilehin%20Favour%20Oluwayemi',
    description:
      'Timilehin is a literature graduate with strong customer service, communication, and organizational skills, focused on delivering empathetic support and reliable results.'
  }
];
