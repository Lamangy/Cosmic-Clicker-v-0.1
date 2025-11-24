
import React from 'react';
import { Epoch } from '../types';

interface EpochDisplayProps {
  epoch: Epoch;
}

const EpochDisplay: React.FC<EpochDisplayProps> = ({ epoch }) => {
  return (
    <div className="text-center w-full mb-4">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 drop-shadow-md">
        {epoch.name}
      </h1>
      <p className="text-sm text-gray-400 mt-1">{epoch.time} after Big Bang</p>
      <p className="text-sm max-w-lg mx-auto text-gray-300 mt-2">{epoch.description}</p>
    </div>
  );
};

export default EpochDisplay;
