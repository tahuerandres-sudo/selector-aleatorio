import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { HistoryEntry } from '../types';

interface SelectionHistoryProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
}

export const SelectionHistory: React.FC<SelectionHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  return (
    <section className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-8 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-neutral-800" />
          <h2 className="text-xl md:text-2xl font-black text-neutral-900 uppercase tracking-tight">
            SELECTION HISTORY
          </h2>
          {history.length > 0 && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
              {history.length}
            </span>
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-bold text-neutral-500 hover:text-red-600 bg-neutral-100 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <Trash2 className="w-3.5 h-3.5" />
            CLEAR HISTORY
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
          <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-neutral-400 font-medium text-base">
            No selections yet. Roll a group to see history here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {history.map((entry, index) => (
            <div
              key={entry.id}
              className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm font-black text-neutral-400 shrink-0">
                  {index + 1}.
                </span>
                <span className="text-base font-bold text-neutral-900 truncate">
                  {entry.apprenticeName}
                </span>
              </div>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-white border border-neutral-200 text-neutral-600 rounded-lg shrink-0">
                {entry.groupName}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
