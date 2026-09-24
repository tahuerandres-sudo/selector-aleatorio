import React, { useState } from 'react';
import { 
  Dice5, 
  Tv, 
  Plus, 
  Save, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check 
} from 'lucide-react';

interface HeaderProps {
  onAddGroup: () => void;
  onSelectFromAll: () => void;
  onEnterPresentation: () => void;
  onSave: () => void;
  onResetAll: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalApprentices: number;
}

export const Header: React.FC<HeaderProps> = ({
  onAddGroup,
  onSelectFromAll,
  onEnterPresentation,
  onSave,
  onResetAll,
  soundEnabled,
  onToggleSound,
  totalApprentices,
}) => {
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSaveClick = () => {
    onSave();
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  return (
    <header className="border-b border-neutral-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Main Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title and Subtitle */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl" role="img" aria-label="Dice">
                🎲
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight uppercase">
                RANDOM APPRENTICE SELECTOR
              </h1>
            </div>
            <p className="text-neutral-500 font-medium text-base sm:text-lg mt-1">
              Add your apprentices and organize them into groups.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Primary presentation button */}
            <button
              onClick={onEnterPresentation}
              className="px-5 py-3 bg-neutral-900 hover:bg-black active:bg-neutral-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer uppercase tracking-wider transform hover:-translate-y-0.5"
              title="Launch Fullscreen Classroom Mode"
            >
              <Tv className="w-5 h-5 text-amber-400" />
              <span>🖥️ PRESENTATION MODE</span>
            </button>

            {/* Select from all groups */}
            <button
              onClick={onSelectFromAll}
              disabled={totalApprentices === 0}
              className="px-5 py-3 bg-white hover:bg-neutral-100 border-2 border-neutral-900 text-neutral-900 font-extrabold text-sm sm:text-base rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none"
              title="Randomly select from all groups combined"
            >
              <Dice5 className="w-5 h-5 text-neutral-900" />
              <span>🎲 SELECT FROM ALL</span>
            </button>

            {/* Add Group */}
            <button
              onClick={onAddGroup}
              className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-sm rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wide"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD GROUP</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Save to LocalStorage */}
            <button
              onClick={handleSaveClick}
              className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer relative"
              title="Save state"
            >
              {showSavedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">SAVED!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>💾 SAVE</span>
                </>
              )}
            </button>

            {/* Reset All */}
            <button
              onClick={onResetAll}
              className="px-3.5 py-3 text-neutral-500 hover:text-red-600 hover:bg-red-50 font-bold text-sm rounded-2xl transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset all groups to initial template"
            >
              <RotateCcw className="w-4 h-4" />
              <span>↻ RESET ALL</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
