import React, { useState } from 'react';
import { UserPlus, Plus, Trash2, Users, ChevronDown, ListFilter } from 'lucide-react';
import { Apprentice, Group } from '../types';

interface AddApprenticesSectionProps {
  availableApprentices: Apprentice[];
  groups: Group[];
  onAddApprenticeToAvailable: (name: string) => void;
  onAddMultipleToAvailable: (names: string[]) => void;
  onDeleteAvailableApprentice: (id: string) => void;
  onAssignToGroup: (apprenticeName: string, groupId: string) => void;
  onAssignToAllGroups: (apprenticeName: string) => void;
}

export const AddApprenticesSection: React.FC<AddApprenticesSectionProps> = ({
  availableApprentices,
  groups,
  onAddApprenticeToAvailable,
  onAddMultipleToAvailable,
  onDeleteAvailableApprentice,
  onAssignToGroup,
  onAssignToAllGroups,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [showBulkMode, setShowBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onAddApprenticeToAvailable(nameInput.trim());
      setNameInput('');
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = bulkInput
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length > 0) {
      onAddMultipleToAvailable(names);
      setBulkInput('');
      setShowBulkMode(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight flex items-center gap-3">
            <UserPlus className="w-7 h-7 text-neutral-900" />
            ADD APPRENTICES
          </h2>
          <p className="text-neutral-500 font-medium text-sm md:text-base mt-1">
            Add names to your pool and quickly assign them to your groups.
          </p>
        </div>

        <button
          onClick={() => setShowBulkMode(!showBulkMode)}
          className="self-start sm:self-auto text-xs font-bold text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          <ListFilter className="w-4 h-4" />
          {showBulkMode ? 'Single Add' : 'Paste Multiple Names'}
        </button>
      </div>

      {/* Input area */}
      {showBulkMode ? (
        <form onSubmit={handleBulkSubmit} className="space-y-3 mb-8">
          <textarea
            rows={4}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Paste multiple names (one per line or separated by commas)...&#10;Andrés&#10;Carlos&#10;María&#10;Laura"
            className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-base font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!bulkInput.trim()}
              className="px-6 py-3 bg-neutral-900 hover:bg-black disabled:bg-neutral-300 text-white font-bold text-base rounded-xl transition-all cursor-pointer"
            >
              ADD ALL NAMES
            </button>
            <button
              type="button"
              onClick={() => setShowBulkMode(false)}
              className="px-4 py-3 text-neutral-600 hover:text-neutral-900 text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSingleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter apprentice name..."
              className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-lg font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="px-8 py-3.5 bg-neutral-900 hover:bg-black active:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-extrabold text-base rounded-2xl shadow-sm hover:shadow transition-all uppercase tracking-wider cursor-pointer"
          >
            ADD
          </button>
        </form>
      )}

      {/* Available Apprentices List */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-lg md:text-xl font-extrabold text-neutral-800 uppercase tracking-tight flex items-center gap-2">
            AVAILABLE APPRENTICES
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
              {availableApprentices.length}
            </span>
          </h3>
        </div>

        {availableApprentices.length === 0 ? (
          <p className="text-neutral-400 text-base italic py-4">
            No apprentices in available pool. Type a name above to add one.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {availableApprentices.map((apprentice) => {
              const isDropdownOpen = activeDropdownId === apprentice.id;

              return (
                <div
                  key={apprentice.id}
                  className="flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100/90 rounded-2xl border border-neutral-200 transition-all relative"
                >
                  <span className="text-lg font-bold text-neutral-900 truncate mr-2">
                    • {apprentice.name}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Add to group dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdownId(isDropdownOpen ? null : apprentice.id)
                        }
                        className="px-2.5 py-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Add to group"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Group</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1.5 z-30 w-52 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                            <div className="text-[10px] font-black uppercase text-neutral-400 px-3 py-1 tracking-wider">
                              Add to:
                            </div>

                            {groups.map((group) => {
                              const alreadyInGroup = group.apprentices.some(
                                (a) => a.name.toLowerCase() === apprentice.name.toLowerCase()
                              );

                              return (
                                <button
                                  key={group.id}
                                  onClick={() => {
                                    onAssignToGroup(apprentice.name, group.id);
                                    setActiveDropdownId(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                                    alreadyInGroup
                                      ? 'text-neutral-400 hover:bg-neutral-50'
                                      : 'text-neutral-800 hover:bg-neutral-100'
                                  }`}
                                >
                                  <span className="truncate">{group.name}</span>
                                  {alreadyInGroup && (
                                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
                                      added
                                    </span>
                                  )}
                                </button>
                              );
                            })}

                            <div className="border-t border-neutral-100 my-1" />

                            <button
                              onClick={() => {
                                onAssignToAllGroups(apprentice.name);
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-sm font-black text-neutral-900 hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Users className="w-3.5 h-3.5" />
                              All Groups
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteAvailableApprentice(apprentice.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete from available"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
