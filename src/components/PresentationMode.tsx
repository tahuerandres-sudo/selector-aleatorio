import React, { useEffect, useState } from 'react';
import { X, Dice5, Volume2, VolumeX, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { Group, Apprentice } from '../types';

interface PresentationModeProps {
  groups: Group[];
  activeGroupId: string | 'ALL';
  setActiveGroupId: (id: string | 'ALL') => void;
  onSelectRandom: (groupId: string | 'ALL') => void;
  onResetSelections: (groupId: string) => void;
  onExit: () => void;
  isSelecting: boolean;
  currentCandidate: string;
  winner: Apprentice | null;
  selectedGroupName: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  groups,
  activeGroupId,
  setActiveGroupId,
  onSelectRandom,
  onResetSelections,
  onExit,
  isSelecting,
  currentCandidate,
  winner,
  selectedGroupName,
  soundEnabled,
  onToggleSound,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcut: ESC to exit, Space/Enter to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.code === 'Space' && !isSelecting && (e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        onSelectRandom(activeGroupId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGroupId, isSelecting, onExit, onSelectRandom]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const totalInActive = activeGroupId === 'ALL'
    ? groups.reduce((acc, g) => acc + g.apprentices.length, 0)
    : (activeGroup ? activeGroup.apprentices.length : 0);

  const selectedInActive = activeGroupId === 'ALL'
    ? groups.reduce((acc, g) => acc + g.selectedIds.length, 0)
    : (activeGroup ? activeGroup.selectedIds.length : 0);

  const isAllSelected = activeGroupId !== 'ALL' && activeGroup && activeGroup.avoidRepeats && totalInActive > 0 && selectedInActive >= totalInActive;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between p-6 md:p-12 select-none overflow-y-auto">
      {/* Top Bar for Instructor Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-black uppercase tracking-widest">
            🖥️ PRESENTATION MODE
          </span>
          <span className="text-neutral-500 text-xs font-medium hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded-md text-neutral-300 font-mono">ESC</kbd> to exit, <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded-md text-neutral-300 font-mono">SPACE</kbd> to select
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          <button
            onClick={onExit}
            className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-sm font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span>EXIT</span>
          </button>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 py-6">
        <button
          onClick={() => setActiveGroupId('ALL')}
          className={`px-5 py-3 rounded-2xl font-black text-sm md:text-base tracking-wider uppercase transition-all cursor-pointer ${
            activeGroupId === 'ALL'
              ? 'bg-white text-black shadow-lg scale-105'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400'
          }`}
        >
          🎲 ALL GROUPS
        </button>

        {groups.map((group) => {
          const isSelected = activeGroupId === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={`px-5 py-3 rounded-2xl font-black text-sm md:text-base tracking-wider uppercase transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              {group.name}
              <span className="ml-2 text-xs opacity-75 font-semibold">
                ({group.apprentices.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Classroom Projection Stage */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-4 py-8">
        <div className="w-full max-w-4xl bg-neutral-900/90 rounded-3xl border border-neutral-800 p-8 sm:p-14 lg:p-20 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle group label */}
          <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-widest text-neutral-400 uppercase mb-4">
            {activeGroupId === 'ALL' ? 'ALL GROUPS COMBINED' : activeGroup?.name || selectedGroupName}
          </div>

          {/* If selection is in progress */}
          {isSelecting ? (
            <div className="space-y-6 py-10">
              <div className="inline-block px-6 py-2 rounded-full bg-neutral-800 text-neutral-300 font-bold text-sm tracking-widest uppercase animate-pulse">
                🎲 SELECTING APPRENTICE...
              </div>
              <div className="min-h-[140px] flex items-center justify-center">
                <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white animate-bounce">
                  {currentCandidate || '...'}
                </div>
              </div>
            </div>
          ) : isAllSelected && activeGroup ? (
            <div className="space-y-6 py-10">
              <div className="text-amber-400 text-4xl sm:text-5xl font-black">
                Everyone has been selected!
              </div>
              <p className="text-neutral-400 text-xl font-medium">
                All {totalInActive} apprentices from {activeGroup.name} have been called.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onResetSelections(activeGroup.id)}
                  className="px-8 py-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-6 h-6" />
                  RESET SELECTIONS
                </button>
              </div>
            </div>
          ) : winner ? (
            /* Selected Apprentice Display */
            <div className="space-y-6 py-4">
              <div className="border-t border-neutral-800 my-4" />

              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-widest uppercase">
                🎉 SELECTED 🎉
              </div>

              {/* Massive Name */}
              <div className="py-2">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md break-words">
                  {winner.name}
                </h1>
              </div>

              <div className="text-xl sm:text-2xl font-bold text-neutral-400">
                Selected from <span className="text-white font-extrabold">{selectedGroupName}</span>
              </div>

              <div className="border-b border-neutral-800 my-4" />
            </div>
          ) : (
            /* Idle Ready State */
            <div className="space-y-6 py-12">
              <div className="text-neutral-500 text-base sm:text-lg font-bold uppercase tracking-widest">
                READY TO PICK
              </div>
              <div className="text-4xl sm:text-6xl font-black text-neutral-300">
                {totalInActive} {totalInActive === 1 ? 'APPRENTICE' : 'APPRENTICES'} AVAILABLE
              </div>
              {activeGroup?.avoidRepeats && totalInActive > 0 && (
                <div className="text-neutral-400 text-lg font-medium">
                  {selectedInActive} of {totalInActive} already selected
                </div>
              )}
            </div>
          )}

          {/* Large Action Button */}
          {!isSelecting && !isAllSelected && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onSelectRandom(activeGroupId)}
                disabled={totalInActive === 0}
                className="w-full sm:w-auto px-12 py-6 bg-white hover:bg-neutral-100 active:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed text-black font-black text-2xl sm:text-3xl rounded-3xl shadow-2xl transition-all transform hover:scale-105 active:scale-100 flex items-center justify-center gap-4 cursor-pointer uppercase tracking-wider"
              >
                <Dice5 className="w-8 h-8 sm:w-10 sm:h-10" />
                {winner ? '🎲 SELECT AGAIN' : '🎲 SELECT RANDOM'}
              </button>

              {activeGroupId !== 'ALL' && activeGroup && activeGroup.selectedIds.length > 0 && (
                <button
                  onClick={() => onResetSelections(activeGroup.id)}
                  className="px-6 py-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-lg rounded-3xl transition-all flex items-center gap-2 cursor-pointer"
                  title="Reset selections for this group"
                >
                  <RotateCcw className="w-5 h-5" />
                  RESET
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Info */}
      <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold text-neutral-500 border-t border-neutral-800/80 pt-4">
        <div>
          {activeGroupId === 'ALL'
            ? `All ${groups.length} groups loaded`
            : `${activeGroup?.name || ''}: ${totalInActive} apprentices`}
        </div>
        <div>
          RANDOM APPRENTICE SELECTOR • CLASSROOM EDITION
        </div>
      </div>
    </div>
  );
};
