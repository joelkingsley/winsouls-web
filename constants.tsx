import React from 'react';
import { Marathon, MarathonStatus, InteractionOutcome, BiblicalPathContent, Group } from './types';

export const DEFAULT_GROUP_ID = "group-default";

export const MOCK_GROUP: Group = {
  id: DEFAULT_GROUP_ID,
  name: "Default Group Alpha",
};

export const MOCK_MARATHONS: Marathon[] = [
  {
    id: 'marathon-1',
    name: 'Spring Outreach 2024',
    date: '2024-05-15',
    status: MarathonStatus.Current,
    adminPrepared: true,
    areas: [
      {
        id: 'area-1a',
        name: 'Downtown District',
        startPoint: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
        houseNumbers: [
          { id: 'hn-1', address: '101 Main St', status: InteractionOutcome.Pending },
          { id: 'hn-2', address: '102 Main St', status: InteractionOutcome.Pending },
          { id: 'hn-3', address: '103 Main St', status: InteractionOutcome.RungBell, notes: 'Rang bell, no answer at 2 PM', lastInteractionTime: new Date().toISOString() },
        ],
      },
      {
        id: 'area-1b',
        name: 'Suburban Heights',
        startPoint: { lat: 40.7500, lng: -73.9800, address: "456 Oak Ave, Suburbs" },
        houseNumbers: [
          { id: 'hn-4', address: '201 Oak Ave', status: InteractionOutcome.Pending },
          { id: 'hn-5', address: '202 Oak Ave', status: InteractionOutcome.NoInterest, notes: 'Politely declined literature.' },
        ],
      },
    ],
    meetingPoint: { lat: 40.7300, lng: -73.9900, address: "Central Park South Entrance" },
  },
  {
    id: 'marathon-2',
    name: 'Summer Evangelism Drive',
    date: '2024-07-20',
    status: MarathonStatus.Upcoming,
    adminPrepared: true,
    areas: [
      {
        id: 'area-2a',
        name: 'Riverside Community',
        houseNumbers: [
          { id: 'hn-6', address: '301 River Rd', status: InteractionOutcome.Pending },
          { id: 'hn-7', address: '302 River Rd', status: InteractionOutcome.Pending },
        ],
      },
    ],
  },
   {
    id: 'marathon-3',
    name: 'Winter Hope Campaign',
    date: '2023-12-10',
    status: MarathonStatus.Past,
    adminPrepared: true,
    areas: [
      {
        id: 'area-3a',
        name: 'Old Town',
        houseNumbers: [
          { id: 'hn-8', address: '701 Historic Ln', status: InteractionOutcome.Saved, contactName: "John Doe", contactPhone: "555-1234" },
          { id: 'hn-9', address: '702 Historic Ln', status: InteractionOutcome.FollowUp, notes: "Requested a Bible study" },
        ],
      },
    ],
  },
];

export const BIBLICAL_PATH_DATA: BiblicalPathContent = {
  language: "English",
  title: "The Path to Heaven",
  content: [
    "Admit you are a sinner. (Romans 3:23 - For all have sinned and fall short of the glory of God.)",
    "Believe that Jesus Christ died for your sins. (Romans 5:8 - But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us.)",
    "Confess your faith in Jesus Christ as Savior and Lord. (Romans 10:9-10 - If you declare with your mouth, “Jesus is Lord,” and believe in your heart that God raised him from the dead, you will be saved.)",
    "This is a simplified representation. Please consult your spiritual leaders for a deeper understanding."
  ],
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.biblegateway.com/passage/?search=Romans+10%3A9-10&version=NIV" // Example QR
};

export const ICON_CHEVRON_DOWN = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const ICON_MAP_PIN = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18c1.846 0 3.543-.635 4.897-1.688A5.5 5.5 0 0 0 10 3.5a5.5 5.5 0 0 0-4.897 12.812A11.517 11.517 0 0 1 10 18Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
  </svg>
);

export const ICON_CHECK_CIRCLE = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

export const ICON_X_CIRCLE = (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
);


export const ICON_ARROW_PATH = (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
);

export const ICON_CALENDAR_DAYS = (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
</svg>
);

export const ICON_CHART_BAR = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const ICON_BOOK_OPEN = (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
</svg>
);

export const ICON_QR_CODE = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 014.5 3.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75V4.5zm0 9.75A.75.75 0 014.5 13.5h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75V14.25zm9.75-9.75A.75.75 0 0114.25 3.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75V4.5zm5.25 3.75a.75.75 0 01.75-.75H21a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V8.25zm-.75 5.25a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75V13.5zm0 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75V16.5zm-3-3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V13.5zm-3.75 3a.75.75 0 01.75-.75H12a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V16.5zm0-3a.75.75 0 01.75-.75H12a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V13.5zm-3.75 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V16.5zm-3-3.75a.75.75 0 01.75-.75H5.25a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75v-.75z" />
  </svg>
);