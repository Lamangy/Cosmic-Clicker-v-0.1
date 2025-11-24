
import React, { useState } from 'react';
import { GameSettings, GameState } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
  gameState: GameState;
  onLoadGame: (state: GameState) => void;
  onResetGame: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdateSettings, onClose, gameState, onLoadGame, onResetGame }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');
  const [importString, setImportString] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [exportString, setExportString] = useState<string | null>(null);

  const handleExport = () => {
    try {
        const json = JSON.stringify(gameState);
        const base64 = btoa(json);
        setExportString(base64);
    } catch (e) {
        console.error("Export failed", e);
    }
  };

  const handleImport = () => {
      setImportError(null);
      try {
          const json = atob(importString);
          const parsed = JSON.parse(json);
          if (!parsed.resources || !parsed.upgrades) {
              throw new Error("Invalid save file format");
          }
          onLoadGame(parsed);
          onClose();
      } catch (e) {
          setImportError("Invalid save string. Please check and try again.");
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-11/12 max-w-lg bg-gray-900 border border-gray-600 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cosmic Configuration
             </h2>
             <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="flex border-b border-gray-700">
            <button 
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'general' ? 'bg-gray-800 text-cyan-300 border-b-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-800/50'}`}
                onClick={() => setActiveTab('general')}
            >
                General
            </button>
            <button 
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'data' ? 'bg-gray-800 text-cyan-300 border-b-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-800/50'}`}
                onClick={() => setActiveTab('data')}
            >
                Data & Saves
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {activeTab === 'general' && (
                <div className="space-y-6">
                    {/* Audio Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Audio</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-200">Master Volume</span>
                            <span className="text-cyan-300 font-mono">{(settings.masterVolume * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={settings.masterVolume}
                            onChange={(e) => onUpdateSettings({ masterVolume: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    <div className="border-t border-gray-700 my-4"></div>

                    {/* Visuals Section */}
                     <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Visuals</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-200 font-semibold">Low Performance Mode</p>
                                <p className="text-xs text-gray-500">Reduces particle count and disables expensive glow effects. Recommended for mobile.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.lowPerformanceMode}
                                    onChange={(e) => onUpdateSettings({ lowPerformanceMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>
                    </div>

                     <div className="border-t border-gray-700 my-4"></div>

                     {/* Gameplay Section */}
                     <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Gameplay</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-200 font-semibold">Scientific Notation</p>
                                <p className="text-xs text-gray-500">Display numbers as 1.23e6 instead of 1.23M.</p>
                            </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.scientificNotation}
                                    onChange={(e) => onUpdateSettings({ scientificNotation: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'data' && (
                <div className="space-y-6">
                    {/* Export */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-cyan-300 font-bold mb-2">Export Save</h3>
                        <p className="text-xs text-gray-400 mb-3">Copy this code to back up your save or transfer it to another device.</p>
                        {exportString ? (
                            <div className="relative">
                                <textarea 
                                    readOnly 
                                    value={exportString} 
                                    className="w-full h-24 bg-black border border-gray-600 rounded p-2 text-xs text-green-400 font-mono focus:outline-none resize-none"
                                />
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(exportString); alert("Copied to clipboard!"); }}
                                    className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                                >
                                    Copy
                                </button>
                            </div>
                        ) : (
                             <button onClick={handleExport} className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded font-bold text-sm">
                                Generate Export Code
                            </button>
                        )}
                    </div>

                     {/* Import */}
                     <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-yellow-300 font-bold mb-2">Import Save</h3>
                        <p className="text-xs text-gray-400 mb-3">Paste an export code here to load it. <span className="text-red-400">Warning: This will overwrite your current save!</span></p>
                        <textarea 
                            value={importString}
                            onChange={(e) => setImportString(e.target.value)}
                            placeholder="Paste save string here..."
                            className="w-full h-24 bg-black border border-gray-600 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-yellow-500 resize-none mb-2"
                        />
                        {importError && <p className="text-red-400 text-xs mb-2">{importError}</p>}
                        <button 
                            onClick={handleImport} 
                            disabled={!importString}
                            className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-bold text-sm"
                        >
                            Load Save
                        </button>
                    </div>

                     {/* Hard Reset */}
                     <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/50 mt-8">
                        <h3 className="text-red-400 font-bold mb-2">Hard Reset</h3>
                        <p className="text-xs text-gray-400 mb-3">Wipe all progress, including Achievements and Essence. Start from absolute zero.</p>
                        <button onClick={onResetGame} className="w-full px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded font-bold text-sm">
                            DELETE EVERYTHING
                        </button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
