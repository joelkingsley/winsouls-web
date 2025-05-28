import React, { useState, useEffect, useCallback, createContext } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Marathon, Area, HouseNumber, AppContextType, Group, InteractionOutcome } from './types';
import { MOCK_MARATHONS, MOCK_GROUP } from './constants.tsx';
import { Header, Footer, BiblicalPathModal, LoadingSpinner, Button } from './components'; // Added Button
import { CurrentMarathonPage, UpcomingMarathonsPage, StatisticsPage } from './pages';

// Create context
export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [currentMarathon, setCurrentMarathonState] = useState<Marathon | null>(null);
  const [selectedArea, setSelectedAreaState] = useState<Area | null>(null);
  const [activeGroup, setActiveGroup] = useState<Group | null>(MOCK_GROUP); // Simulate logged-in group
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBiblicalPathModal, setShowBiblicalPathModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      try {
        // Deep copy MOCK_MARATHONS to avoid unintentional mutations if MOCK_MARATHONS objects are complex
        const initialMarathons = JSON.parse(JSON.stringify(MOCK_MARATHONS));
        setMarathons(initialMarathons);
        const initialCurrent = initialMarathons.find((m: Marathon) => m.status === 'CURRENT');
        if (initialCurrent) {
          setCurrentMarathonState(initialCurrent);
        } else {
          setCurrentMarathonState(initialMarathons.find((m: Marathon) => m.status === 'UPCOMING') || initialMarathons[0] || null);
        }
      } catch (e) {
        console.error("Failed to initialize marathons:", e);
        setError("Failed to load marathon data.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const setCurrentMarathon = useCallback((marathon: Marathon | null) => {
    setCurrentMarathonState(marathon);
    setSelectedAreaState(null); // Reset selected area when marathon changes
    if (activeGroup && marathon) {
      const groupIsActiveInNewMarathonArea = marathon.areas.some(area => area.id === activeGroup.activeAreaId);
      if (!groupIsActiveInNewMarathonArea) {
         setActiveGroup(prev => prev ? {...prev, activeAreaId: null} : null);
      }
    } else if (!marathon) {
       setActiveGroup(prev => prev ? {...prev, activeAreaId: null} : null);
    }
  }, [activeGroup]);

  const setSelectedArea = useCallback((area: Area | null) => {
    setSelectedAreaState(area);
  }, []);

  const updateHouseNumber = useCallback((marathonId: string, areaId: string, houseNumberId: string, updates: Partial<HouseNumber>) => {
    setMarathons(prevMarathons =>
      prevMarathons.map(m => {
        if (m.id === marathonId) {
          return {
            ...m,
            areas: m.areas.map(a => {
              if (a.id === areaId) {
                return {
                  ...a,
                  houseNumbers: a.houseNumbers.map(hn =>
                    hn.id === houseNumberId ? { ...hn, ...updates } : hn
                  ),
                };
              }
              return a;
            }),
          };
        }
        return m;
      })
    );
  }, []);

  const startSoulWinning = useCallback((marathonId: string, areaId: string, groupId: string) => {
    if (activeGroup && activeGroup.id === groupId) {
      setActiveGroup(prev => prev ? { ...prev, activeAreaId: areaId } : null);
      // Ensure selectedArea is also updated to the one being started in.
      const currentM = marathons.find(m=>m.id === marathonId);
      const areaToStart = currentM?.areas.find(a=>a.id === areaId);
      setSelectedAreaState(areaToStart || null);
      console.log(`Group ${groupId} started soul winning in area ${areaId} of marathon ${marathonId}`);
    } else {
      console.error("Group mismatch or no active group. Cannot start soul winning.");
    }
  }, [activeGroup, marathons]); // Added marathons to dependency array for finding areaToStart

  const endSoulWinning = useCallback((lastHouseNumberId?: string) => {
    if (activeGroup) {
      console.log(`Group ${activeGroup.id} ended soul winning. Last house ID (if provided): ${lastHouseNumberId}`);
      setActiveGroup(prev => prev ? { ...prev, activeAreaId: null } : null);
    }
  }, [activeGroup]);


  const contextValue: AppContextType = {
    marathons,
    setMarathons,
    currentMarathon,
    setCurrentMarathon,
    selectedArea,
    setSelectedArea,
    activeGroup,
    setActiveGroup,
    updateHouseNumber,
    startSoulWinning,
    endSoulWinning,
    showBiblicalPathModal,
    setShowBiblicalPathModal,
    isLoading,
    error,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-brand-background">
        <LoadingSpinner />
        <p className="mt-4 text-brand-text-secondary">Loading Soul Winning Tracker...</p>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-brand-background p-4">
        <p className="text-red-400 text-xl">Error: {error}</p>
         <Button onClick={() => { setIsLoading(true); setError(null); setTimeout(() => { setMarathons(JSON.parse(JSON.stringify(MOCK_MARATHONS))); setIsLoading(false); }, 100);}} className="mt-4">
            Retry Loading Mock Data
        </Button>
      </div>
    );
  }


  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-brand-background">
          <Header onOpenBiblicalPath={() => setShowBiblicalPathModal(true)} />
          <main className="flex-grow container mx-auto px-0 sm:px-4 py-4">
            <Routes>
              <Route path="/" element={<CurrentMarathonPage />} />
              <Route path="/upcoming" element={<UpcomingMarathonsPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
            </Routes>
          </main>
          <Footer />
          <BiblicalPathModal isOpen={showBiblicalPathModal} onClose={() => setShowBiblicalPathModal(false)} />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;