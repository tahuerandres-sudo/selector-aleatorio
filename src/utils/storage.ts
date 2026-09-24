import { Apprentice, Group, HistoryEntry } from '../types';

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'GROUP 1',
    apprentices: [
      { id: 'app-1-1', name: 'Andrés' },
      { id: 'app-1-2', name: 'Carlos' },
      { id: 'app-1-3', name: 'Laura' },
      { id: 'app-1-4', name: 'Juan' },
    ],
    selectedIds: [],
    avoidRepeats: true,
  },
  {
    id: 'group-2',
    name: 'GROUP 2',
    apprentices: [
      { id: 'app-2-1', name: 'María' },
      { id: 'app-2-2', name: 'Pedro' },
      { id: 'app-2-3', name: 'Sofía' },
      { id: 'app-2-4', name: 'Daniel' },
    ],
    selectedIds: [],
    avoidRepeats: true,
  },
  {
    id: 'group-3',
    name: 'GROUP 3',
    apprentices: [
      { id: 'app-3-1', name: 'Camila' },
      { id: 'app-3-2', name: 'José' },
      { id: 'app-3-3', name: 'Valentina' },
      { id: 'app-3-4', name: 'Miguel' },
    ],
    selectedIds: [],
    avoidRepeats: true,
  },
  {
    id: 'group-4',
    name: 'GROUP 4',
    apprentices: [
      { id: 'app-4-1', name: 'Paula' },
      { id: 'app-4-2', name: 'David' },
      { id: 'app-4-3', name: 'Natalia' },
      { id: 'app-4-4', name: 'Sebastián' },
    ],
    selectedIds: [],
    avoidRepeats: true,
  },
];

export const INITIAL_AVAILABLE: Apprentice[] = [
  { id: 'avail-1', name: 'Andrés' },
  { id: 'avail-2', name: 'Carlos' },
  { id: 'avail-3', name: 'María' },
  { id: 'avail-4', name: 'Laura' },
  { id: 'avail-5', name: 'Juan' },
];

const STORAGE_KEYS = {
  GROUPS: 'random_apprentice_groups_v1',
  AVAILABLE: 'random_apprentice_available_v1',
  HISTORY: 'random_apprentice_history_v1',
  SOUND_ENABLED: 'random_apprentice_sound_v1',
};

export function loadGroups(): Group[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!raw) return INITIAL_GROUPS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load groups from localStorage', e);
  }
  return INITIAL_GROUPS;
}

export function saveGroups(groups: Group[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  } catch (e) {
    console.error('Failed to save groups to localStorage', e);
  }
}

export function loadAvailableApprentices(): Apprentice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AVAILABLE);
    if (!raw) return INITIAL_AVAILABLE;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load available apprentices', e);
  }
  return INITIAL_AVAILABLE;
}

export function saveAvailableApprentices(apprentices: Apprentice[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.AVAILABLE, JSON.stringify(apprentices));
  } catch (e) {
    console.error('Failed to save available apprentices', e);
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load history', e);
  }
  return [];
}

export function saveHistory(history: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export function loadSoundSetting(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    if (raw === null) return true;
    return raw === 'true';
  } catch {
    return true;
  }
}

export function saveSoundSetting(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
  } catch (e) {
    console.error('Failed to save sound setting', e);
  }
}

export function resetAllStorage(): { groups: Group[]; available: Apprentice[]; history: HistoryEntry[] } {
  localStorage.removeItem(STORAGE_KEYS.GROUPS);
  localStorage.removeItem(STORAGE_KEYS.AVAILABLE);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  return {
    groups: INITIAL_GROUPS,
    available: INITIAL_AVAILABLE,
    history: [],
  };
}
