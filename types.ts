export enum MarathonStatus {
  Upcoming = "UPCOMING",
  Current = "CURRENT",
  Past = "PAST",
}

export enum InteractionOutcome {
  Pending = "PENDING",
  Saved = "SAVED",
  NoInterest = "NO_INTEREST",
  FollowUp = "FOLLOW_UP",
  NotHome = "NOT_HOME",
  RungBell = "RUNG_BELL",
}

export interface GeoPoint {
  lat: number;
  lng: number;
  address?: string;
}

export interface HouseNumber {
  id: string;
  address: string;
  status: InteractionOutcome;
  notes?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  lastInteractionTime?: string;
}

export interface Area {
  id: string;
  name: string;
  houseNumbers: HouseNumber[];
  startPoint?: GeoPoint;
}

export interface Group {
  id: string;
  name: string;
  activeAreaId?: string | null;
  deviceIdentifier?: string; // Simplified representation of "1 device per group"
}

export interface Marathon {
  id: string;
  name: string;
  date: string;
  status: MarathonStatus;
  areas: Area[];
  meetingPoint?: GeoPoint;
  adminPrepared: boolean; // For "Von Admin vorbereitete Karten"
}

export interface StatisticsData {
  totalMarathons: number;
  totalCompletedMarathons: number;
  overallOutcomes: { [key in InteractionOutcome]?: number };
  participantsCount: number; // Simplified
  marathonSpecificStats: {
    marathonId: string;
    marathonName: string;
    outcomes: { [key in InteractionOutcome]?: number };
    housesVisited: number;
  }[];
}

export interface BiblicalPathContent {
  language: string;
  title: string;
  content: string[]; // Array of paragraphs
  qrCodeUrl: string; // URL to an image or data for qrcode.react
}

export interface AppContextType {
  marathons: Marathon[];
  setMarathons: React.Dispatch<React.SetStateAction<Marathon[]>>;
  currentMarathon: Marathon | null;
  setCurrentMarathon: (marathon: Marathon | null) => void;
  selectedArea: Area | null;
  setSelectedArea: (area: Area | null) => void;
  activeGroup: Group | null; // Represents the current user/device's group
  setActiveGroup: React.Dispatch<React.SetStateAction<Group | null>>;
  updateHouseNumber: (marathonId: string, areaId: string, houseNumberId: string, updates: Partial<HouseNumber>) => void;
  startSoulWinning: (marathonId: string, areaId: string, groupId: string) => void;
  endSoulWinning: (lastHouseNumberId?: string) => void;
  showBiblicalPathModal: boolean;
  setShowBiblicalPathModal: (show: boolean) => void;
  isLoading: boolean;
  error: string | null;
}