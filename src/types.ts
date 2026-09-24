export interface Apprentice {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  apprentices: Apprentice[];
  selectedIds: string[];
  avoidRepeats: boolean;
}

export interface HistoryEntry {
  id: string;
  apprenticeName: string;
  groupName: string;
  groupId: string;
  timestamp: number;
}

export interface SelectionState {
  isSelecting: boolean;
  groupId: string | 'ALL';
  groupName: string;
  currentCandidate: string;
  winner: Apprentice | null;
  allCompleted: boolean;
}
