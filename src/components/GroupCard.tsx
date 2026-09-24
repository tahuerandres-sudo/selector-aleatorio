import React, { useState } from 'react';
import { Dice5, UserPlus, X, RotateCcw, Check, Trash2, Edit2 } from 'lucide-react';
import { Apprentice, Group } from '../types';

interface GroupCardProps {
  group: Group;
  onSelectRandom: (groupId: string) => void;
  onResetSelections: (groupId: string) => void;
  onToggleAvoidRepeats: (groupId: string) => void;
  onAddApprenticeToGroup: (groupId: string, name: string) => void;
  onRemoveApprenticeFromGroup: (groupId: string, apprenticeId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onSelectRandom,
  onResetSelections,
  onToggleAvoidRepeats,
  onAddApprenticeToGroup,
  onRemoveApprenticeFromGroup,
  onDeleteGroup,
  onRenameGroup,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newApprenticeName, setNewApprenticeName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState(group.name);

  const total = group.apprentices.length;
  const selectedCount = group.selectedIds.filter(id =>
    group.apprentices.some(a => a.id === id)
  ).length;
  const isAllSelected = group.avoidRepeats && total > 0 && selectedCount >= total;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newApprenticeName.trim()) {
      onAddApprenticeToGroup(group.id, newApprenticeName.trim());
      setNewApprenticeName('');
      setIsAdding(false);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupNameInput.trim()) {
      onRenameGroup(group.id, groupNameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-6 md:p-7 border-b border-neutral-100 bg-neutral-50/60">
        <div className="flex items-center justify-between gap-3">
          {isEditingName ? (
            <form onSubmit={handleRenameSubmit} className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                autoFocus
                onBlur={handleRenameSubmit}
                className="w-full text-2xl font-black text-neutral-900 bg-white border border-neutral-300 rounded-xl px-3 py-1 uppercase tracking-wide focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
              <button
                type="submit"
                className="p-2 bg-neutral-900 text-white rounded-xl hover:bg-black cursor-pointer"
                title="Save name"
              >
                <Check className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 group/title">
              <h3 
                onClick={() => setIsEditingName(true)}
                className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight cursor-pointer hover:text-neutral-700 transition-colors flex items-center gap-2"
                title="Click to rename"
              >
                {group.name}
                <Edit2 className="w-4 h-4 text-neutral-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
              </h3>
            </div>
          )}

          <button
            onClick={() => onDeleteGroup(group.id)}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Delete this group"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Info */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-800 text-base md:text-lg">
              {total} {total === 1 ? 'APPRENTICE' : 'APPRENTICES'}
            </span>
            {group.avoidRepeats && total > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAllSelected 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-neutral-200 text-neutral-700'
              }`}>
                {selectedCount} / {total} SELECTED
              </span>
            )}
          </div>

          {/* Reset Selections quick link if any are selected */}
          {selectedCount > 0 && (
            <button
              onClick={() => onResetSelections(group.id)}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* Progress bar if avoid repeats is active */}
        {group.avoidRepeats && total > 0 && (
          <div className="mt-3 w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isAllSelected ? 'bg-amber-500' : 'bg-neutral-900'
              }`}
              style={{ width: `${(selectedCount / total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Apprentices List */}
      <div className="p-6 md:p-7 flex-1 min-h-[190px]">
        {group.apprentices.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-neutral-200 rounded-2xl">
            <p className="text-neutral-400 font-medium text-base mb-3">
              No apprentices in this group yet.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              + ADD APPRENTICE
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {group.apprentices.map((apprentice) => {
              const isSelected = group.selectedIds.includes(apprentice.id);
              return (
                <li
                  key={apprentice.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all border ${
                    isSelected && group.avoidRepeats
                      ? 'bg-neutral-100/80 border-neutral-200 text-neutral-400'
                      : 'bg-neutral-50/80 hover:bg-neutral-100/90 border-neutral-200/60 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {group.avoidRepeats && (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-300 text-neutral-700'
                            : 'border-2 border-neutral-300 text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                    )}
                    <span
                      className={`text-lg md:text-xl font-bold tracking-tight ${
                        isSelected && group.avoidRepeats ? 'line-through text-neutral-400' : ''
                      }`}
                    >
                      {apprentice.name}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveApprenticeFromGroup(group.id, apprentice.id)}
                    className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title={`Remove ${apprentice.name}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Add Apprentice Form */}
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Apprentice name..."
              value={newApprenticeName}
              onChange={(e) => setNewApprenticeName(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2.5 bg-neutral-100 border border-neutral-300 rounded-xl text-base font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              ADD
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-2.5 text-neutral-500 hover:text-neutral-800 text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </form>
        ) : (
          group.apprentices.length > 0 && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 w-full py-2.5 border border-dashed border-neutral-300 hover:border-neutral-500 text-neutral-600 hover:text-neutral-900 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50"
            >
              <UserPlus className="w-4 h-4" />
              + ADD APPRENTICE
            </button>
          )
        )}
      </div>

      {/* Card Footer Controls */}
      <div className="p-6 md:p-7 bg-neutral-50/70 border-t border-neutral-100 space-y-4">
        {/* Avoid repeats toggle */}
        <label className="flex items-center gap-2.5 text-sm font-bold text-neutral-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={group.avoidRepeats}
            onChange={() => onToggleAvoidRepeats(group.id)}
            className="w-5 h-5 rounded-md border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
          />
          <span>AVOID REPEATS</span>
        </label>

        {/* Action Button */}
        {isAllSelected ? (
          <div className="space-y-2">
            <div className="text-center py-1 text-sm font-bold text-amber-700 bg-amber-50 rounded-xl border border-amber-200">
              Everyone has been selected!
            </div>
            <button
              onClick={() => onResetSelections(group.id)}
              className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <RotateCcw className="w-5 h-5" />
              RESET SELECTIONS
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSelectRandom(group.id)}
            disabled={group.apprentices.length === 0}
            className="w-full py-4 bg-neutral-900 hover:bg-black active:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-black text-lg md:text-xl rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wide transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Dice5 className="w-6 h-6" />
            🎲 SELECT RANDOM
          </button>
        )}
      </div>
    </div>
  );
};
