import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Event, EventCategory } from '../types';
import { EventCard } from '../components/EventCard';
import { Search, Filter, Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await StorageService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-12 bg-background">
      {/* Hero Section */}
      <div className="bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground tracking-tight mb-6 font-serif">
            Discover Campus Events
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-10 font-medium">
            The easiest way to find, register, and participate in college activities.
          </p>
          
          {/* Search Bar in Hero */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 border-2 border-transparent rounded-full leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary shadow-custom-xl transition-all duration-300"
              placeholder="Search for events, workshops, sports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-foreground font-serif">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Upcoming Events'}
          </h2>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-5 w-5 text-muted-foreground mr-2" />
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${selectedCategory === 'All' ? 'bg-primary text-primary-foreground border-primary shadow-custom-sm' : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border-border'}`}
            >
              All
            </button>
            {Object.values(EventCategory).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${selectedCategory === category ? 'bg-primary text-primary-foreground border-primary shadow-custom-sm' : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border-border'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed border-border shadow-custom-sm">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground">No events found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};