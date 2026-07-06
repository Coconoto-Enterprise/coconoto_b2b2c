import JacobPhoto from '../assets/team/Jacob.jpg';
import JamiuPhoto from '../assets/team/Jamiu.png';
import DanielPhoto from '../assets/team/Daniel.jpg';
import MojolaoluwaPhoto from '../assets/team/Mojolaoluwa Abiodun Jolaoluwa.jpg';
import PreciousCharlesPhoto from '../assets/team/Precious (Charles).jpg';
import AbiolaPreciousPhoto from '../assets/team/Abiola Precious.jpg';
import EnochPhoto from '../assets/team/enoch.jpeg';
import OluwatokeFaejiPhoto from '../assets/team/Oluwatoke Faeji.jpeg';
import TimilehinOluwayemiPhoto from '../assets/team/Oluwayemi.jpeg';

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
      'Jacob Abiodun is an engineer, entrepreneur, and sustainability advocate. He holds a degree in Mechanical Engineering from FUTA and is focused on building technology-driven solutions for societal challenges through agritech and circular economy innovation.'
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
      'A dedicated, hardworking, and results-driven professional with strong communication and organizational skills. Daniel enjoys learning new things, taking on challenges, and contributing positively wherever he works.'
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
      'Precious Charles is a video content editor for business owners and a business enthusiast who helps brands create memorable visual stories through editing and production support.'
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
    role: 'Software Engineer',
    email: 'enoch.bamigboye@coconoto.africa',
    phone: '+2349131678833',
    linkedIn: 'https://www.linkedin.com/in/bamigboye-enoch-5a82a8368',
    profileImage: EnochPhoto,
    description:
      "Computer Science graduate from Babcock University and software developer focused on web development, AI, automation, cybersecurity, and cloud computing.",
  },
  {
    id: 'oluwatoke-evelyn-faeji',
    firstName: 'Oluwatoke',
    lastName: 'Faeji',
    role: 'Project Manager / Website Management & Coco Fiber Sales',
    email: 'oluwatoke.evelyn@coconoto.africa',
    phone: '+2349075775276',
    linkedIn:
      'https://www.linkedin.com/in/oluwatoke-faeji-349684251?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    profileImage: OluwatokeFaejiPhoto,
    description:
      'Oluwatoke is a passionate environmentalist and marine science student with experience in climate advocacy, environmental education, waste management, project management, and community-driven sustainability initiatives.'
  },
  {
    id: 'timilehin-favour-oluwayemi',
    firstName: 'Timilehin',
    lastName: 'Oluwayemi',
    role: 'Customer Care & Social Media Representative',
    email: 'timilehin.favour@coconoto.africa',
    phone: '+2348108767512',
    linkedIn:
      'https://www.linkedin.com/in/timilehin-oluwayemi-6963a32ab?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    profileImage: TimilehinOluwayemiPhoto,
    description:
      'Timilehin is passionate about driving personal growth and operational development, with strong customer service, communication, and organizational skills.'
  }
];
