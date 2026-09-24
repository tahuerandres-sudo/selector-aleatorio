import { useState, useEffect, useRef } from 'react';
import { Group, Apprentice, HistoryEntry } from './types';
import { 
  loadGroups, 
  saveGroups, 
  loadAvailableApprentices, 
  saveAvailableApprentices, 
  loadHistory, 
  saveHistory, 
  loadSoundSetting, 
  saveSoundSetting,
  resetAllStorage,
  INITIAL_GROUPS
} from './utils/storage';
import { soundFx } from './utils/audio';
import { fireCelebrationConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { AddApprenticesSection } from './components/AddApprenticesSection';
import { GroupCard } from './components/GroupCard';
import { SelectionModal } from './components/SelectionModal';
import { PresentationMode } from './components/PresentationMode';
import { SelectionHistory } from './components/SelectionHistory';
import { ConfirmModal } from './components/ConfirmModal';
import { Plus } from 'lucide-react';

export default function App() {
  // Core state
  const [groups, setGroups] = useState<Group[]>(() => loadGroups());
  const [availableApprentices, setAvailableApprentices] = useState<Apprentice[]>(() => loadAvailableApprentices());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundSetting());

  // UI state
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationActiveGroup, setPresentationActiveGroup] = useState<string | 'ALL'>('ALL');

  // Random Selection State
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState('');
  const [selectionTargetGroup, setSelectionTargetGroup] = useState<{ id: string | 'ALL'; name: string }>({ id: 'ALL', name: 'ALL GROUPS' });
  const [winner, setWinner] = useState<Apprentice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Keep sound effect instance synced
  useEffect(() => {
    soundFx.enabled = soundEnabled;
    saveSoundSetting(soundEnabled);
  }, [soundEnabled]);

  // Persist state changes to localStorage
  useEffect(() => {
    saveGroups(groups);
  }, [groups]);

  useEffect(() => {
    saveAvailableApprentices(availableApprentices);
  }, [availableApprentices]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // Animation timer ref for clean cancellation
  const animationTimerRef = useRef<NodeJS.Timeout[]>([]);

  const clearSelectionTimers = () => {
    animationTimerRef.current.forEach(clearTimeout);
    animationTimerRef.current = [];
  };

  useEffect(() => {
    return () => clearSelectionTimers();
  }, []);

  // Handlers for Groups
  const handleAddGroup = () => {
    const nextNum = groups.length + 1;
    const newGroup: Group = {
      id: `group-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `GROUP ${nextNum}`,
      apprentices: [],
      selectedIds: [],
      avoidRepeats: true,
    };
    setGroups([...groups, newGroup]);
  };

  const handleRenameGroup = (groupId: string, newName: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, name: newName } : g));
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    if (group.apprentices.length > 0) {
      setConfirmConfig({
        isOpen: true,
        title: `Delete ${group.name}?`,
        message: `This group has ${group.apprentices.length} apprentice(s). Are you sure you want to remove it?`,
        onConfirm: () => {
          setGroups(groups.filter(g => g.id !== groupId));
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      setGroups(groups.filter(g => g.id !== groupId));
    }
  };

  const handleAddApprenticeToGroup = (groupId: string, name: string) => {
    const newApprentice: Apprentice = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
    };
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          apprentices: [...g.apprentices, newApprentice],
        };
      }
      return g;
    }));
  };

  const handleRemoveApprenticeFromGroup = (groupId: string, apprenticeId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          apprentices: g.apprentices.filter(a => a.id !== apprenticeId),
          selectedIds: g.selectedIds.filter(id => id !== apprenticeId),
        };
      }
      return g;
    }));
  };

  const handleToggleAvoidRepeats = (groupId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          avoidRepeats: !g.avoidRepeats,
        };
      }
      return g;
    }));
  };

  const handleResetSelections = (groupId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          selectedIds: [],
        };
      }
      return g;
    }));
    setAllCompleted(false);
  };

  // Handlers for Available Pool
  const handleAddApprenticeToAvailable = (name: string) => {
    const newApp: Apprentice = {
      id: `avail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
    };
    setAvailableApprentices([newApp, ...availableApprentices]);
  };

  const handleAddMultipleToAvailable = (names: string[]) => {
    const newItems: Apprentice[] = names.map((name, i) => ({
      id: `avail-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      name,
    }));
    setAvailableApprentices([...newItems, ...availableApprentices]);
  };

  const handleDeleteAvailableApprentice = (id: string) => {
    setAvailableApprentices(availableApprentices.filter(a => a.id !== id));
  };

  const handleAssignToGroup = (apprenticeName: string, groupId: string) => {
    const newApp: Apprentice = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: apprenticeName,
    };
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        // Only add if not already in group with same name (or allow multiple)
        const exists = g.apprentices.some(a => a.name.toLowerCase() === apprenticeName.toLowerCase());
        if (exists) return g;
        return {
          ...g,
          apprentices: [...g.apprentices, newApp],
        };
      }
      return g;
    }));
  };

  const handleAssignToAllGroups = (apprenticeName: string) => {
    setGroups(groups.map(g => {
      const exists = g.apprentices.some(a => a.name.toLowerCase() === apprenticeName.toLowerCase());
      if (exists) return g;
      const newApp: Apprentice = {
        id: `app-${Date.now()}-${g.id}-${Math.random().toString(36).substring(2, 7)}`,
        name: apprenticeName,
      };
      return {
        ...g,
        apprentices: [...g.apprentices, newApp],
      };
    }));
  };

  // Core Random Selection Routine
  const handleSelectRandom = (target: string | 'ALL') => {
    clearSelectionTimers();
    setWinner(null);
    setAllCompleted(false);

    let candidates: { apprentice: Apprentice; groupName: string; groupId: string }[] = [];
    let groupDisplayName = '';

    if (target === 'ALL') {
      groupDisplayName = 'ALL GROUPS';
      // Gather all candidates from all groups
      groups.forEach(group => {
        let pool = group.apprentices;
        if (group.avoidRepeats) {
          const unselected = group.apprentices.filter(a => !group.selectedIds.includes(a.id));
          if (unselected.length > 0) {
            pool = unselected;
          }
        }
        pool.forEach(apprentice => {
          candidates.push({
            apprentice,
            groupName: group.name,
            groupId: group.id,
          });
        });
      });

      if (candidates.length === 0) {
        // If all are selected, pool everyone
        groups.forEach(group => {
          group.apprentices.forEach(apprentice => {
            candidates.push({
              apprentice,
              groupName: group.name,
              groupId: group.id,
            });
          });
        });
      }
    } else {
      const targetGroup = groups.find(g => g.id === target);
      if (!targetGroup || targetGroup.apprentices.length === 0) return;

      groupDisplayName = targetGroup.name;

      if (targetGroup.avoidRepeats) {
        const unselected = targetGroup.apprentices.filter(a => !targetGroup.selectedIds.includes(a.id));
        if (unselected.length === 0) {
          // Everyone has been selected!
          setSelectionTargetGroup({ id: target, name: targetGroup.name });
          setAllCompleted(true);
          setIsModalOpen(true);
          return;
        }
        candidates = unselected.map(apprentice => ({
          apprentice,
          groupName: targetGroup.name,
          groupId: targetGroup.id,
        }));
      } else {
        candidates = targetGroup.apprentices.map(apprentice => ({
          apprentice,
          groupName: targetGroup.name,
          groupId: targetGroup.id,
        }));
      }
    }

    if (candidates.length === 0) return;

    // Pick final winner in advance
    const chosenIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[chosenIndex];

    setSelectionTargetGroup({ id: target, name: target === 'ALL' ? chosen.groupName : groupDisplayName });
    setIsSelecting(true);
    setIsModalOpen(true);

    // Dynamic easing animation
    // Intervals in ms: fast -> slowing down -> stop
    const sequence = [
      40, 40, 45, 45, 50, 50, 60, 65, 75, 90, 110, 140, 180, 230, 290, 370
    ];

    let accumulatedTime = 0;
    const allNamesPool = candidates.map(c => c.apprentice.name);

    sequence.forEach((delay, index) => {
      accumulatedTime += delay;
      const timer = setTimeout(() => {
        // Pick random name to display during roll
        const randomName = allNamesPool[Math.floor(Math.random() * allNamesPool.length)];
        setCurrentCandidate(randomName);
        soundFx.playTick(0.8 + (index / sequence.length) * 0.6);
      }, accumulatedTime);
      animationTimerRef.current.push(timer);
    });

    // Final reveal timer
    const finalTimer = setTimeout(() => {
      setIsSelecting(false);
      setWinner(chosen.apprentice);
      setCurrentCandidate(chosen.apprentice.name);

      // Sound and confetti
      soundFx.playWinner();
      fireCelebrationConfetti();

      // Update group's selectedIds if avoidRepeats is on
      setGroups(currentGroups =>
        currentGroups.map(g => {
          if (g.id === chosen.groupId && g.avoidRepeats) {
            if (!g.selectedIds.includes(chosen.apprentice.id)) {
              return {
                ...g,
                selectedIds: [...g.selectedIds, chosen.apprentice.id],
              };
            }
          }
          return g;
        })
      );

      // Record in selection history
      const newHistoryEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        apprenticeName: chosen.apprentice.name,
        groupName: chosen.groupName,
        groupId: chosen.groupId,
        timestamp: Date.now(),
      };
      setHistory(prev => [newHistoryEntry, ...prev.slice(0, 49)]);
    }, accumulatedTime + 420);

    animationTimerRef.current.push(finalTimer);
  };

  const handleResetAll = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset All Data?',
      message: 'This will reset all groups and apprentices back to the initial 4 groups. All custom names will be replaced. This action cannot be undone.',
      onConfirm: () => {
        const fresh = resetAllStorage();
        setGroups(fresh.groups);
        setAvailableApprentices(fresh.available);
        setHistory(fresh.history);
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const totalApprentices = groups.reduce((acc, g) => acc + g.apprentices.length, 0);

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Header
        onAddGroup={handleAddGroup}
        onSelectFromAll={() => handleSelectRandom('ALL')}
        onEnterPresentation={() => setPresentationMode(true)}
        onSave={() => {
          saveGroups(groups);
          saveAvailableApprentices(availableApprentices);
        }}
        onResetAll={handleResetAll}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        totalApprentices={totalApprentices}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10 flex-1 w-full">
        {/* Add Apprentices Pool Section */}
        <AddApprenticesSection
          availableApprentices={availableApprentices}
          groups={groups}
          onAddApprenticeToAvailable={handleAddApprenticeToAvailable}
          onAddMultipleToAvailable={handleAddMultipleToAvailable}
          onDeleteAvailableApprentice={handleDeleteAvailableApprentice}
          onAssignToGroup={handleAssignToGroup}
          onAssignToAllGroups={handleAssignToAllGroups}
        />

        {/* Groups Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                GROUPS ({groups.length})
              </h2>
              <p className="text-neutral-500 font-medium text-sm md:text-base mt-1">
                Each group operates independently with its own random selector and repeat protection.
              </p>
            </div>

            <button
              onClick={handleAddGroup}
              className="self-start sm:self-auto px-5 py-3 bg-neutral-900 hover:bg-black text-white font-extrabold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              + ADD GROUP
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
              <p className="text-xl font-bold text-neutral-600">
                No groups created yet.
              </p>
              <button
                onClick={handleAddGroup}
                className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-2xl text-base cursor-pointer"
              >
                Create First Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onSelectRandom={handleSelectRandom}
                  onResetSelections={handleResetSelections}
                  onToggleAvoidRepeats={handleToggleAvoidRepeats}
                  onAddApprenticeToGroup={handleAddApprenticeToGroup}
                  onRemoveApprenticeFromGroup={handleRemoveApprenticeFromGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onRenameGroup={handleRenameGroup}
                />
              ))}
            </div>
          )}
        </section>

        {/* Selection History Section */}
        <SelectionHistory
          history={history}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-center text-sm font-semibold text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>🎲 RANDOM APPRENTICE SELECTOR</span>
          <span className="text-xs text-neutral-400">
            Designed for interactive classroom instruction & projection
          </span>
        </div>
      </footer>

      {/* Normal Mode Selection Result Modal */}
      {!presentationMode && (
        <SelectionModal
          isOpen={isModalOpen}
          isSelecting={isSelecting}
          currentCandidate={currentCandidate}
          winner={winner}
          groupName={selectionTargetGroup.name}
          allCompleted={allCompleted}
          onClose={() => setIsModalOpen(false)}
          onSelectAgain={() => handleSelectRandom(selectionTargetGroup.id)}
          onResetSelections={
            selectionTargetGroup.id !== 'ALL'
              ? () => {
                  handleResetSelections(selectionTargetGroup.id as string);
                  setIsModalOpen(false);
                }
              : undefined
          }
        />
      )}

      {/* Presentation Mode Fullscreen Overlay */}
      {presentationMode && (
        <PresentationMode
          groups={groups}
          activeGroupId={presentationActiveGroup}
          setActiveGroupId={setPresentationActiveGroup}
          onSelectRandom={handleSelectRandom}
          onResetSelections={handleResetSelections}
          onExit={() => setPresentationMode(false)}
          isSelecting={isSelecting}
          currentCandidate={currentCandidate}
          winner={winner}
          selectedGroupName={selectionTargetGroup.name}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
