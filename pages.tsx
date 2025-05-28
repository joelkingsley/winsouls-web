import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContextType, Area, HouseNumber, InteractionOutcome, Marathon, MarathonStatus, StatisticsData } from './types';
import { AppContext } from './App'; 
import { Button, Card, Input, Modal, Select, TextArea, LoadingSpinner, outcomeOptions, GeoPointDisplay } from './components';
import { ICON_CALENDAR_DAYS } from './constants.tsx';


interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseNumber: HouseNumber | null;
  marathonId: string;
  areaId: string;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ isOpen, onClose, houseNumber, marathonId, areaId }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext not found");
  const { updateHouseNumber } = context;

  const [outcome, setOutcome] = useState<InteractionOutcome>(houseNumber?.status || InteractionOutcome.Pending);
  const [notes, setNotes] = useState(houseNumber?.notes || '');
  const [contactName, setContactName] = useState(houseNumber?.contactName || '');
  const [contactPhone, setContactPhone] = useState(houseNumber?.contactPhone || '');
  const [contactEmail, setContactEmail] = useState(houseNumber?.contactEmail || '');

  React.useEffect(() => {
    if (houseNumber) {
      setOutcome(houseNumber.status);
      setNotes(houseNumber.notes || '');
      setContactName(houseNumber.contactName || '');
      setContactPhone(houseNumber.contactPhone || '');
      setContactEmail(houseNumber.contactEmail || '');
    }
  }, [houseNumber]);

  const handleSubmit = () => {
    if (!houseNumber) return;
    updateHouseNumber(marathonId, areaId, houseNumber.id, {
      status: outcome,
      notes,
      contactName: outcome === InteractionOutcome.Saved || outcome === InteractionOutcome.FollowUp ? contactName : undefined,
      contactPhone: outcome === InteractionOutcome.Saved || outcome === InteractionOutcome.FollowUp ? contactPhone : undefined,
      contactEmail: outcome === InteractionOutcome.Saved || outcome === InteractionOutcome.FollowUp ? contactEmail : undefined,
      lastInteractionTime: new Date().toISOString(),
    });
    onClose();
  };

  if (!houseNumber) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Interaction: ${houseNumber.address}`}>
      <div className="space-y-4">
        <Select
          label="Outcome"
          options={outcomeOptions}
          value={outcome}
          onChange={(e) => setOutcome(e.target.value as InteractionOutcome)}
        />
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="E.g., 'Apartment building, rang bell for Apt 3B'"/>
        {(outcome === InteractionOutcome.Saved || outcome === InteractionOutcome.FollowUp) && (
          <>
            <Input label="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            <Input label="Contact Phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            <Input label="Contact Email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Interaction</Button>
        </div>
      </div>
    </Modal>
  );
};


const HouseNumberItem: React.FC<{ houseNumber: HouseNumber; marathonId: string; areaId: string; onLogInteraction: (houseNumber: HouseNumber) => void }> = ({ houseNumber, marathonId, areaId, onLogInteraction }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext not found");
  const { updateHouseNumber } = context;

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? InteractionOutcome.RungBell : InteractionOutcome.Pending;
     updateHouseNumber(marathonId, areaId, houseNumber.id, { status: newStatus, lastInteractionTime: new Date().toISOString() });
  };
  
  const isCompleted = ![InteractionOutcome.Pending].includes(houseNumber.status);

  return (
    <Card className={`mb-3 ${isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
           <input 
            type="checkbox" 
            className="h-5 w-5 text-brand-primary rounded border-gray-500 focus:ring-brand-primary mr-3"
            checked={isCompleted}
            onChange={handleStatusChange}
            aria-label={`Mark ${houseNumber.address} as visited`}
          />
          <div>
            <p className={`font-medium ${isCompleted ? 'line-through text-brand-text-secondary' : 'text-brand-text'}`}>{houseNumber.address}</p>
            <p className="text-xs text-brand-text-secondary">Status: {houseNumber.status.replace(/_/g, ' ')}</p>
            {houseNumber.notes && <p className="text-xs text-brand-text-secondary mt-1 italic">Note: {houseNumber.notes}</p>}
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => onLogInteraction(houseNumber)}>
          Log/Edit
        </Button>
      </div>
    </Card>
  );
};


export const CurrentMarathonPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext not found");
  const { marathons, currentMarathon, setCurrentMarathon, selectedArea, setSelectedArea, isLoading, activeGroup, startSoulWinning, endSoulWinning } = context;
  
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState<HouseNumber | null>(null);
  // const [lastHouseNumberConfirm, setLastHouseNumberConfirm] = useState(''); // This state was unused


  React.useEffect(() => {
    if (!currentMarathon) {
      const firstCurrent = marathons.find(m => m.status === MarathonStatus.Current);
      if (firstCurrent) {
        setCurrentMarathon(firstCurrent);
      } else {
         const firstUpcoming = marathons.find(m => m.status === MarathonStatus.Upcoming);
         if(firstUpcoming) setCurrentMarathon(firstUpcoming);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marathons, currentMarathon, setCurrentMarathon]);


  const handleAreaSelect = (area: Area) => {
    setSelectedArea(area);
  };

  const handleStartSoulWinning = (area: Area) => {
    if (currentMarathon && activeGroup) {
      startSoulWinning(currentMarathon.id, area.id, activeGroup.id);
      alert(`Started soul winning in ${area.name}. Navigate to: ${area.startPoint?.address || 'Start Point defined by coordinates'}.`);
    }
  };

  const handleEndSoulWinning = () => {
    const lastHouseDetails = selectedArea?.houseNumbers
      .filter(hn => hn.status !== InteractionOutcome.Pending && hn.lastInteractionTime)
      .sort((a, b) => new Date(b.lastInteractionTime!).getTime() - new Date(a.lastInteractionTime!).getTime())[0];
    
    const confirmMessage = lastHouseDetails 
      ? `Is ${lastHouseDetails.address} (Status: ${lastHouseDetails.status}) the last house you interacted with?`
      : `Are you sure you want to end soul winning for ${selectedArea?.name}?`;

    if (window.confirm(confirmMessage)) {
      endSoulWinning(lastHouseDetails?.id);
      alert(`Soul winning ended for ${selectedArea?.name}. Navigate to meeting point: ${currentMarathon?.meetingPoint?.address || 'Meeting Point defined by coordinates'}.`);
    }
  };

  const openInteractionModal = (houseNumber: HouseNumber) => {
    setSelectedHouseNumber(houseNumber);
    setInteractionModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!currentMarathon) return <p className="text-center p-8 text-brand-text-secondary">No current or upcoming marathon selected/available.</p>;

  const isGroupActiveInArea = activeGroup?.activeAreaId === selectedArea?.id;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-brand-secondary mb-2">{currentMarathon.name}</h1>
      <p className="text-brand-text-secondary flex items-center"><span className="mr-2">{ICON_CALENDAR_DAYS}</span> {currentMarathon.date} - Status: <span className={`ml-1 font-semibold ${currentMarathon.status === MarathonStatus.Current ? 'text-green-400' : 'text-yellow-400'}`}>{currentMarathon.status}</span></p>
      <GeoPointDisplay point={currentMarathon.meetingPoint} label="Marathon Meeting Point" />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Areas List */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-brand-text">Areas</h2>
          {currentMarathon.areas.length === 0 && <p className="text-brand-text-secondary">No areas defined for this marathon.</p>}
          {currentMarathon.areas.map(area => (
            <Card 
              key={area.id} 
              className={`border-2 ${selectedArea?.id === area.id ? 'border-brand-primary' : 'border-transparent'}`}
              onClick={() => handleAreaSelect(area)}
            >
              <h3 className="font-semibold text-lg text-brand-secondary">{area.name}</h3>
              <GeoPointDisplay point={area.startPoint} label="Area Start" />
              {selectedArea?.id === area.id && activeGroup && !isGroupActiveInArea && (
                 <Button size="sm" onClick={() => handleStartSoulWinning(area)} className="mt-2 w-full">
                  Start in this Area
                </Button>
              )}
              {selectedArea?.id === area.id && isGroupActiveInArea && (
                <p className="text-sm text-green-400 mt-2">You are active in this area.</p>
              )}
            </Card>
          ))}
        </div>

        {/* Selected Area Details */}
        <div className="md:col-span-2">
          {selectedArea ? (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-brand-secondary">{selectedArea.name} Details</h2>
                {isGroupActiveInArea && (
                  <Button variant="danger" size="sm" onClick={handleEndSoulWinning}>End Soul Winning in Area</Button>
                )}
              </div>
              {!isGroupActiveInArea && activeGroup && (
                 <p className="text-yellow-400 mb-4 p-3 bg-yellow-900 bg-opacity-50 rounded-md">Click "Start in this Area" on the left to begin tracking for {selectedArea.name}.</p>
              )}
              {!activeGroup && (
                <p className="text-red-400 mb-4 p-3 bg-red-900 bg-opacity-50 rounded-md">User/Group not identified. Cannot start soul winning.</p>
              )}

             {isGroupActiveInArea && selectedArea.houseNumbers.length > 0 && (
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
                  <h3 className="text-lg font-semibold text-brand-text">House Numbers / Interaction Points:</h3>
                  {selectedArea.houseNumbers.map(hn => (
                    <HouseNumberItem 
                      key={hn.id} 
                      houseNumber={hn} 
                      marathonId={currentMarathon.id} 
                      areaId={selectedArea.id} 
                      onLogInteraction={openInteractionModal} 
                    />
                  ))}
                </div>
              )}
              {selectedArea.houseNumbers.length === 0 && <p className="text-brand-text-secondary mt-4">No house numbers listed for this area.</p>}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center h-64">
              <p className="text-xl text-brand-text-secondary">Select an area to view details.</p>
            </Card>
          )}
        </div>
      </div>

      {interactionModalOpen && selectedHouseNumber && currentMarathon && selectedArea && (
        <InteractionModal
          isOpen={interactionModalOpen}
          onClose={() => setInteractionModalOpen(false)}
          houseNumber={selectedHouseNumber}
          marathonId={currentMarathon.id}
          areaId={selectedArea.id}
        />
      )}
    </div>
  );
};


export const UpcomingMarathonsPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext not found");
  const { marathons, isLoading, setCurrentMarathon } = context;
  const navigate = useNavigate(); 

  const upcomingMarathons = marathons.filter(m => m.status === MarathonStatus.Upcoming && m.adminPrepared);
  
  const handleSelectMarathon = (marathon: Marathon) => {
    setCurrentMarathon(marathon); 
    navigate('/'); 
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-brand-secondary mb-6">Upcoming Marathons (Admin Prepared)</h1>
      {upcomingMarathons.length === 0 ? (
        <p className="text-brand-text-secondary">No upcoming marathons scheduled or prepared by admin.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingMarathons.map(marathon => (
            <Card key={marathon.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-brand-secondary mb-2">{marathon.name}</h2>
                <p className="text-sm text-brand-text-secondary flex items-center mb-1"><span className="mr-2">{ICON_CALENDAR_DAYS}</span>{marathon.date}</p>
                <p className="text-sm text-brand-text-secondary mb-3">Areas: {marathon.areas.length}</p>
                <GeoPointDisplay point={marathon.meetingPoint} label="Meeting Point" />
              </div>
              <Button onClick={() => handleSelectMarathon(marathon)} className="mt-4 w-full">
                View & Prepare
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const StatisticsPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext not found");
  const { marathons, isLoading } = context;

  const statsData = useMemo<StatisticsData | null>(() => {
    if (!marathons) return null;

    const data: StatisticsData = {
      totalMarathons: marathons.length,
      totalCompletedMarathons: marathons.filter(m => m.status === MarathonStatus.Past).length,
      overallOutcomes: {},
      participantsCount: marathons.length, // Simplified: assuming one primary group/effort per marathon
      marathonSpecificStats: [],
    };

    marathons.forEach(marathon => {
      const marathonStat = {
        marathonId: marathon.id,
        marathonName: marathon.name,
        outcomes: {} as { [key in InteractionOutcome]?: number },
        housesVisited: 0,
      };
      marathon.areas.forEach(area => {
        area.houseNumbers.forEach(hn => {
          if (hn.status !== InteractionOutcome.Pending) {
            marathonStat.housesVisited++;
            marathonStat.outcomes[hn.status] = (marathonStat.outcomes[hn.status] || 0) + 1;
            data.overallOutcomes[hn.status] = (data.overallOutcomes[hn.status] || 0) + 1;
          }
        });
      });
      data.marathonSpecificStats.push(marathonStat);
    });
    return data;
  }, [marathons]);

  if (isLoading) return <LoadingSpinner />;
  if (!statsData) return <p className="text-brand-text-secondary">No statistics available.</p>;
  
  const overallChartData = Object.entries(statsData.overallOutcomes).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-brand-secondary mb-6">Statistics</h1>
      
      <Card>
        <h2 className="text-xl font-semibold text-brand-text mb-4">Overall Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-brand-secondary">{statsData.totalMarathons}</p>
            <p className="text-brand-text-secondary">Total Marathons</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-secondary">{statsData.totalCompletedMarathons}</p>
            <p className="text-brand-text-secondary">Completed Marathons</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-secondary">{statsData.participantsCount}</p>
            <p className="text-brand-text-secondary">Total Participants (Est.)</p>
          </div>
           <div>
            <p className="text-3xl font-bold text-brand-secondary">{statsData.overallOutcomes[InteractionOutcome.Saved] || 0}</p>
            <p className="text-brand-text-secondary">Total Saved</p>
          </div>
        </div>
      </Card>

      {overallChartData.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-brand-text mb-4">Overall Interaction Outcomes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overallChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} itemStyle={{ color: '#F3F4F6' }} cursor={{fill: 'rgba(245, 158, 11, 0.1)'}}/>
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="value" fill="#F59E0B" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand-text mt-8">Marathon Specific Stats</h2>
        {statsData.marathonSpecificStats.map(stat => (
          <Card key={stat.marathonId}>
            <h3 className="text-lg font-semibold text-brand-secondary mb-3">{stat.marathonName}</h3>
            <p className="text-sm text-brand-text-secondary">Houses Visited: {stat.housesVisited}</p>
            <ul className="list-disc list-inside text-sm text-brand-text-secondary pl-2 mt-1">
              {Object.entries(stat.outcomes).map(([outcome, count]) => (
                <li key={outcome}>{outcome.replace(/_/g, ' ')}: {count}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};