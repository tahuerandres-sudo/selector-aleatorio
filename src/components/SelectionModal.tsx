import React from 'react';
import { X, Sparkles, RotateCcw, Dice5 } from 'lucide-react';
import { Apprentice } from '../types';

interface SelectionModalProps {
  isOpen: boolean;
  isSelecting: boolean;
  currentCandidate: string;
  winner: Apprentice | null;
  groupName: string;
  allCompleted: boolean;
  onClose: () => void;
  onSelectAgain: () => void;
  onResetSelections?: () => void;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  isSelecting,
  currentCandidate,
  winner,
  groupName,
  allCompleted,
  onClose,
  onSelectAgain,
  onResetSelections,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 sm:p-12 text-center relative overflow-hidden winner-glow"
        role="dialog"
        aria-modal="true"
      >
        {/* Top close button */}
        <button
          onClick={onClose}
          disabled={isSelecting}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal content */}
        {allCompleted ? (
          <div className="py-8 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 mb-2">
              <RotateCcw className="w-10 h-10" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Everyone has been selected!
            </h3>

            <p className="text-xl text-neutral-600 font-medium">
              All apprentices in <span className="font-bold text-neutral-900">{groupName}</span> have been chosen.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {onResetSelections && (
                <button
                  onClick={onResetSelections}
                  className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-black text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <RotateCcw className="w-6 h-6" />
                  RESET SELECTIONS
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-lg rounded-2xl transition-all cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : isSelecting ? (
          <div className="py-12 space-y-8">
            <div className="flex items-center justify-center gap-2 text-neutral-500 font-bold uppercase tracking-widest text-sm">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              SELECTING RANDOM APPRENTICE...
            </div>

            {/* Huge Cycling Name */}
            <div className="min-h-[140px] flex items-center justify-center">
              <span className="text-5xl sm:text-6xl md:text-7xl font-black text-neutral-900 tracking-tight transition-all duration-75 animate-pulse">
                {currentCandidate || '...'}
              </span>
            </div>

            <p className="text-neutral-500 font-semibold text-lg tracking-wide uppercase">
              From {groupName}
            </p>
          </div>
        ) : winner ? (
          <div className="py-6 space-y-6">
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-neutral-100 text-neutral-700 font-bold tracking-wider text-base sm:text-lg uppercase">
              <span>🎉</span> RANDOM APPRENTICE <span>🎉</span>
            </div>

            {/* Selected Name - Ultra Big Typography */}
            <div className="py-4">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-neutral-900 tracking-tight leading-tight uppercase drop-shadow-xs break-words">
                {winner.name}
              </h2>
            </div>

            <div className="text-xl sm:text-2xl text-neutral-600 font-medium">
              Selected from <span className="font-bold text-neutral-900">{groupName}</span>
            </div>

            {/* Action buttons */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onSelectAgain}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-black text-white font-extrabold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Dice5 className="w-7 h-7" />
                SELECT AGAIN
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-lg rounded-2xl transition-all cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
