import { Event, EventCategory, Registration, DashboardStats } from '../types';
import { EmailService } from './email';

const EVENTS_KEY = 'eventhub_events';
const AUTH_KEY = 'eventhub_auth';

// Seed data to initialize the app if empty
const SEED_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI & Future Tech Summit',
    description: 'Join us for a deep dive into the future of Artificial Intelligence. Industry leaders from Google and Microsoft will be sharing their insights on Generative AI, Ethics, and the roadmap for the next decade.',
    bannerUrl: 'https://picsum.photos/1200/400?random=1',
    posterUrl: 'https://picsum.photos/400/600?random=2',
    maxParticipants: 150,
    category: EventCategory.Tech,
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    venue: 'Main Auditorium, Block A',
    organizer: 'Tech Club',
    contactEmail: 'tech@college.edu',
    registrations: [],
  },
  {
    id: '2',
    title: 'Inter-College Basketball Championship',
    description: 'The biggest sports event of the semester! Cheer for your team as they battle it out for the championship trophy.',
    bannerUrl: 'https://picsum.photos/1200/400?random=3',
    posterUrl: 'https://picsum.photos/400/600?random=4',
    maxParticipants: 500,
    category: EventCategory.Sports,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    venue: 'Sports Complex',
    organizer: 'Sports Committee',
    contactEmail: 'sports@college.edu',
    registrations: [],
  },
    {
    id: '3',
    title: 'Cultural Fest: Rhythms',
    description: 'A night of music, dance, and drama. Celebrate the diversity of our campus with performances from students and guest artists.',
    bannerUrl: 'https://picsum.photos/1200/400?random=5',
    posterUrl: 'https://picsum.photos/400/600?random=6',
    maxParticipants: 1000,
    category: EventCategory.Cultural,
    deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    date: new Date(Date.now() + 86400000 * 14).toISOString(),
    venue: 'Open Air Theatre',
    organizer: 'Student Council',
    contactEmail: 'council@college.edu',
    registrations: [],
  },
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  getEvents: async (): Promise<Event[]> => {
    await delay(300);
    const stored = localStorage.getItem(EVENTS_KEY);
    if (!stored) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(SEED_EVENTS));
      return SEED_EVENTS;
    }
    return JSON.parse(stored);
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    await delay(200);
    const events = await StorageService.getEvents();
    return events.find(e => e.id === id);
  },

  saveEvent: async (event: Event): Promise<void> => {
    await delay(400);
    const events = await StorageService.getEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.push(event);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  deleteEvent: async (id: string): Promise<void> => {
    await delay(300);
    const events = await StorageService.getEvents();
    const newEvents = events.filter(e => e.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents));
  },

  registerStudent: async (eventId: string, studentDetails: Omit<Registration, 'id' | 'registeredAt' | 'eventId'>): Promise<boolean> => {
    await delay(500);
    const events = await StorageService.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) return false;
    
    const event = events[eventIndex];
    if (event.registrations.length >= event.maxParticipants) {
      throw new Error("Event is full");
    }

    const newRegistration: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      registeredAt: new Date().toISOString(),
      ...studentDetails
    };

    event.registrations.push(newRegistration);
    events[eventIndex] = event;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    // Send email notification (Simulated)
    try {
      await EmailService.sendRegistrationSuccess(
        studentDetails.studentName,
        studentDetails.studentEmail,
        event.title,
        event.date,
        event.venue
      );
    } catch (error) {
      console.error("Failed to send email notification", error);
      // Note: In a real app, you might want to log this to an error tracking service,
      // but usually we don't rollback the registration just because the email failed.
    }

    return true;
  },

  getStats: async (): Promise<DashboardStats> => {
    const events = await StorageService.getEvents();
    const totalEvents = events.length;
    const totalParticipants = events.reduce((acc, curr) => acc + curr.registrations.length, 0);
    const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
    
    // Calculate distribution
    const distMap = new Map<string, number>();
    events.forEach(e => {
      distMap.set(e.category, (distMap.get(e.category) || 0) + 1);
    });
    
    const categoryDistribution = Array.from(distMap.entries()).map(([name, value]) => ({ name, value }));

    return {
      totalEvents,
      totalParticipants,
      upcomingEvents,
      categoryDistribution
    };
  },
  
  // Auth Simulation
  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  login: async (password: string): Promise<boolean> => {
    await delay(500);
    if (password === 'admin123') { // Simple hardcoded password
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};