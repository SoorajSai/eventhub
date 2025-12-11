import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isClosed = new Date(event.deadline) < new Date();
  
  return (
    <div className="bg-card rounded-xl shadow-custom-md overflow-hidden hover:shadow-custom-xl transition-all duration-300 flex flex-col h-full border border-border group">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.bannerUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-bold text-primary-foreground uppercase tracking-wider bg-primary/90 backdrop-blur-md rounded-full shadow-custom-sm">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-xl font-bold text-foreground line-clamp-2 font-serif group-hover:text-primary transition-colors">{event.title}</h3>
        </div>
        
        <div className="space-y-2 mt-2 mb-4 text-sm text-muted-foreground flex-grow font-medium">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{format(new Date(event.date), 'MMMM d, yyyy • h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{event.registrations.length} / {event.maxParticipants} Registered</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <span className={`text-sm font-semibold ${isClosed ? 'text-destructive' : 'text-green-600'}`}>
            {isClosed ? 'Registration Closed' : 'Registration Open'}
          </span>
          <Link 
            to={`/events/${event.id}`}
            className="text-primary hover:text-primary/80 font-bold text-sm flex items-center group/link transition-colors"
          >
            View Details
            <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};