import React from 'react';

interface CoordinateDisplayProps {
  viewportCenter: { x: number; y: number };
  zoom: number;
  anomalyCoords: { x: number; y: number } | null;
  worldWidth: number;
  worldHeight: number;
}

const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({
  viewportCenter,
  zoom,
  anomalyCoords,
  worldWidth,
  worldHeight,
}) => {
  const formatCoord = (coord: number, max: number) => {
    return Math.floor(coord).toString().padStart(max.toString().length, '0');
  };

  return (
    <div className="fixed bottom-4 left-4 z-20 p-3 bg-black/50 backdrop-blur-sm text-cyan-200 text-xs rounded-lg shadow-lg font-mono border border-cyan-500/30">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-gray-400">X:</span>
        <span className="text-right">{formatCoord(viewportCenter.x, worldWidth)}</span>
        
        <span className="text-gray-400">Y:</span>
        <span className="text-right">{formatCoord(viewportCenter.y, worldHeight)}</span>

        <span className="text-gray-400">Z:</span>
        <span className="text-right">{(zoom * 100).toFixed(0)}%</span>
      </div>

      {anomalyCoords && (
        <>
          <div className="my-2 border-t border-cyan-500/20" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-yellow-300 col-span-2">Anomaly:</span>
            <span className="text-gray-400">X:</span>
            <span className="text-right text-yellow-300">{formatCoord(anomalyCoords.x, worldWidth)}</span>
            
            <span className="text-gray-400">Y:</span>
            <span className="text-right text-yellow-300">{formatCoord(anomalyCoords.y, worldHeight)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CoordinateDisplay;
