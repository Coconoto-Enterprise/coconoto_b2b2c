import React from 'react';
import { MachineCard } from './MachineCard';
import { machines } from './machinesData';

export function MachinesList() {
  return (
    <section id="machines" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Processing Equipment
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </section>
  );
}