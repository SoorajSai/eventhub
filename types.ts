export enum EventCategory {
  Tech = 'Tech',
  Cultural = 'Cultural',
  Sports = 'Sports',
  Workshop = 'Workshop',
  Seminar = 'Seminar',
  Other = 'Other',
}

export interface Registration {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  usn: string;
  year: string;
  branch: string;
  registeredAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl: string; // URL or Base64
  posterUrl: string; // URL or Base64
  maxParticipants: number;
  category: EventCategory;
  deadline: string; // ISO Date string
  date: string; // ISO Date string
  venue: string;
  organizer: string;
  contactEmail: string;
  registrations: Registration[];
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'student';
}

export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  upcomingEvents: number;
  categoryDistribution: { name: string; value: number }[];
}