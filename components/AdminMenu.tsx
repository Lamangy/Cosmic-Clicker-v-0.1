
import React, { useState, useMemo } from 'react';
import { GameState, Resource, RandomEvent } from '../types';
import { EPOCHS, RANDOM_EVENTS, RANDOM_EVENT_CHANCE } from '../constants';

interface AdminMenuProps {
  onStart: (initialState?: Partial<GameState>) => void;
  onClose: () => void;
  secretStarCoords: { x: number; y: number } | null;
  onTriggerEvent?: (event: RandomEvent) => void;
}

const ALL_RESOURCES = Object.values(Resource);

const AdminMenu: React.FC<AdminMenuProps> = ({ onStart, onClose, secretStarCoords, onTriggerEvent }) => {
    const [expandedEpoch, setExpandedEpoch] = useState<number | null>(null);
    const [resourceValues, setResourceValues] = useState<Record<number, Partial<Record<Resource, string>>>>({});

    const eventsByEpoch = useMemo(() => EPOCHS.map((_, index) => {
        return RANDOM_EVENTS.filter(event => event.requiredEpoch <= index);
    }), []);
    const maxEvents = Math.max(1, ...eventsByEpoch.map(events => events.length));

    const eventProbabilitiesByEpoch = useMemo(() => {
        if (expandedEpoch === null) return null;

        const availableEvents = RANDOM_EVENTS.filter(
            event => event.requiredEpoch <= expandedEpoch
        );

        if (availableEvents.length === 0) {
            return {
                totalProbability: 0,
                events: []
            };
        }

        const totalWeight = availableEvents.reduce((sum, event) => sum + event.weight, 0);

        const eventsWithProbs = availableEvents.map(event => ({
            ...event,
            probability: (event.weight / totalWeight) * RANDOM_EVENT_CHANCE
        }));

        return {
            totalProbability: RANDOM_EVENT_CHANCE,
            events: eventsWithProbs
        };
    }, [expandedEpoch]);


    const handleResourceChange = (epochIndex: number, resource: Resource, value: string) => {
        setResourceValues(prev => ({
            ...prev,
            [epochIndex]: {
                ...prev[epochIndex],
                [resource]: value,
            },
        }));
    };
    
    const handleJump = (epochIndex: number) => {
        const resources: Partial<Record<Resource, number>> = {};
        const epochResources = resourceValues[epochIndex] || {};

        for (const resource of ALL_RESOURCES) {
            const valueStr = epochResources[resource];
            if (valueStr && valueStr.trim() !== '') {
                const valueNum = parseFloat(valueStr);
                if (!isNaN(valueNum)) {
                    resources[resource] = valueNum;
                }
            }
        }
        
        const initialGameState: Partial<GameState> = {
            currentEpochIndex: epochIndex,
            resources: resources as Record<Resource, number>,
        };
        
        onStart(initialGameState);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="w-11/12 max-w-2xl h-[90vh] bg-gray-900 border border-red-500/50 rounded-lg shadow-2xl shadow-red-500/20 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-red-400">Admin Panel</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>

                {secretStarCoords && (
                    <div className="p-3 border-b border-gray-700 bg-gray-800">
                        <h3 className="text-sm font-semibold text-gray-300">Secret Star Location</h3>
                        <p className="font-mono text-cyan-300">
                            X: {secretStarCoords.x.toFixed(2)}, Y: {secretStarCoords.y.toFixed(2)}
                        </p>
                    </div>
                )}
                
                {/* Event Debugger Section */}
                {onTriggerEvent && (
                    <div className="p-4 border-b border-gray-700 bg-gray-800/30">
                        <h3 className="text-lg font-semibold text-yellow-300 mb-2">Event Debugger</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {RANDOM_EVENTS.map(event => (
                                <button
                                    key={event.id}
                                    onClick={() => onTriggerEvent(event)}
                                    className="px-3 py-2 bg-gray-700 hover:bg-yellow-600 hover:text-black text-white text-xs font-bold rounded border border-gray-600 transition-all truncate"
                                    title={event.description}
                                >
                                    {event.name}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">Clicking an event will close this menu and trigger the event immediately.</p>
                    </div>
                )}

                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Events Unlocked by Epoch</h3>
                    <div className="flex items-end justify-between h-24 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                        {eventsByEpoch.map((events, index) => {
                            const count = events.length;
                            return (
                             <div key={index} className="flex-1 h-full flex flex-col items-center justify-end text-center group relative">
                                <div className="absolute bottom-full mb-2 w-max max-w-xs hidden group-hover:block px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-normal text-left z-10">
                                    {count > 0 ? (
                                        <div>
                                            <p className="font-bold border-b border-gray-600 mb-1 pb-1">{count} {count === 1 ? 'event' : 'events'}</p>
                                            <ul className="list-disc list-inside">
                                                {events.map(e => <li key={e.id}>{e.name}</li>)}
                                            </ul>
                                        </div>
                                    ) : 'No events unlocked'}
                                </div>
                                <div 
                                    className="w-1/2 bg-red-600 rounded-t-sm transition-all duration-300 group-hover:bg-red-500"
                                    style={{ height: `${(count / maxEvents) * 100}%` }}
                                >
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{index}</span>
                            </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {EPOCHS.map((epoch, index) => (
                        <div key={epoch.name} className="bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="flex items-center p-3">
                                <span className="font-semibold text-white flex-grow">{epoch.name}</span>
                                <button
                                    onClick={() => setExpandedEpoch(expandedEpoch === index ? null : index)}
                                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md mr-2 transition-colors"
                                >
                                    {expandedEpoch === index ? 'Collapse' : 'Details'}
                                </button>
                                <button
                                    onClick={() => handleJump(index)}
                                    className="text-xs px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md font-bold transition-colors"
                                >
                                    Jump
                                </button>
                            </div>
                            {expandedEpoch === index && (
                                <div className="p-4 border-t border-gray-700">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {ALL_RESOURCES.map(resource => (
                                            <div key={resource}>
                                                <label className="block text-sm text-gray-400 mb-1">{resource}</label>
                                                <input
                                                    type="text"
                                                    value={resourceValues[index]?.[resource] || ''}
                                                    onChange={(e) => handleResourceChange(index, resource, e.target.value)}
                                                    placeholder="0"
                                                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {eventProbabilitiesByEpoch && (
                                        <div className="mt-4 pt-4 border-t border-gray-600">
                                            <h4 className="text-lg font-semibold text-gray-300 mb-2">Event Probabilities (per 5s check)</h4>
                                            <p className="text-sm text-gray-400 mb-3">
                                                Overall chance of any event: <strong>{(eventProbabilitiesByEpoch.totalProbability * 100).toFixed(1)}%</strong>
                                            </p>
                                            {eventProbabilitiesByEpoch.events.length > 0 ? (
                                                <div className="space-y-2">
                                                    {eventProbabilitiesByEpoch.events.map(event => (
                                                        <div key={event.id} className="grid grid-cols-5 items-center gap-2 text-sm">
                                                            <span className="col-span-2 truncate text-gray-300">{event.name}</span>
                                                            <div className="col-span-3 flex items-center">
                                                                <div className="w-full bg-gray-700 rounded-full h-4" title={`Relative chance: ${(event.probability / RANDOM_EVENT_CHANCE * 100).toFixed(1)}%`}>
                                                                    <div 
                                                                        className="bg-red-500 h-4 rounded-full"
                                                                        style={{ width: `${(event.probability / RANDOM_EVENT_CHANCE) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="ml-2 w-16 text-right font-mono text-red-300">{(event.probability * 100).toFixed(2)}%</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No random events can occur in this epoch.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fade-in 0.3s ease-out;
              }
            `}</style>
        </div>
    );
};

export default AdminMenu;
