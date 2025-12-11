import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { Event } from '../types';
import { Calendar, MapPin, User, Clock, Share2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    usn: '',
    year: '',
    branch: ''
  });

  useEffect(() => {
    if (id) {
      loadEvent(id);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    const data = await StorageService.getEventById(eventId);
    if (!data) {
      navigate('/');
      return;
    }
    setEvent(data);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setRegistering(true);
    setErrorMsg('');

    try {
      await StorageService.registerStudent(event.id, formData);
      setSuccessMsg(`Registration Successful! A confirmation email has been sent to ${formData.studentEmail}.`);
      setShowModal(false);
      loadEvent(event.id); // Refresh to update count
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading || !event) return <div className="p-8 text-center text-foreground bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>;

  const isClosed = new Date(event.deadline) < new Date();
  const isFull = event.registrations.length >= event.maxParticipants;

  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Banner */}
      <div className="w-full h-64 md:h-96 relative shadow-custom-lg">
        <img 
          src={event.bannerUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-4 uppercase tracking-wider shadow-custom-sm">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 font-serif drop-shadow-sm">{event.title}</h1>
            <div className="flex flex-wrap items-center text-foreground/80 gap-4 md:gap-8 font-medium">
              <div className="flex items-center bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span>{format(new Date(event.date), 'h:mm a')}</span>
              </div>
              <div className="flex items-center bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="prose max-w-none text-muted-foreground">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-serif">About Event</h3>
            <p className="whitespace-pre-line leading-relaxed text-lg">{event.description}</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-custom-sm">
             <h3 className="text-xl font-bold text-foreground mb-4 font-serif">Organizer</h3>
             <div className="flex items-center">
                <div className="bg-secondary p-3 rounded-full border border-border">
                    <User className="h-6 w-6 text-foreground" />
                </div>
                <div className="ml-4">
                    <p className="text-lg font-bold text-foreground">{event.organizer}</p>
                    <p className="text-muted-foreground">{event.contactEmail}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-xl shadow-custom-lg border border-border sticky top-24">
            
            {/* Poster Image */}
            <div className="mb-6 rounded-lg overflow-hidden border border-border shadow-custom-sm bg-muted/30">
               <img src={event.posterUrl} alt="Event Poster" className="w-full h-auto object-contain" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-6 font-serif">Event Details</h3>
            
            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Registration Deadline</span>
                  <span className="font-bold text-destructive">{format(new Date(event.deadline), 'MMM d, yyyy')}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Participants</span>
                  <span className="font-bold text-foreground">{event.registrations.length} / {event.maxParticipants}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Entry Fee</span>
                  <span className="font-bold text-green-600">Free</span>
               </div>
            </div>

            {successMsg ? (
               <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-start mb-4 shadow-custom-sm">
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="font-medium">{successMsg}</p>
               </div>
            ) : (
                <>
                    {isClosed ? (
                    <button disabled className="w-full py-3 px-4 bg-muted text-muted-foreground font-bold rounded-lg cursor-not-allowed border border-border">
                        Registration Closed
                    </button>
                    ) : isFull ? (
                    <button disabled className="w-full py-3 px-4 bg-yellow-100 text-yellow-800 font-bold rounded-lg cursor-not-allowed border border-yellow-200">
                        Event Full
                    </button>
                    ) : (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-custom-md hover:shadow-custom-lg transition-all transform hover:scale-[1.02]"
                    >
                        Register Now
                    </button>
                    )}
                </>
            )}

            <button 
              onClick={handleShare}
              className="w-full mt-4 py-3 px-4 bg-card border border-border text-foreground font-bold rounded-lg hover:bg-secondary transition-colors flex items-center justify-center shadow-custom-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Event
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-custom-2xl max-w-md w-full p-8 border border-border animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground font-serif">Event Registration</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
            </div>
            
            {errorMsg && (
              <div className="mb-4 bg-destructive/10 text-destructive p-3 rounded-lg text-sm flex items-center border border-destructive/20">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={formData.studentName}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">USN</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all uppercase"
                  value={formData.usn}
                  onChange={e => setFormData({...formData, usn: e.target.value})}
                  placeholder="e.g. 4SH23AD025"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Year</label>
                    <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                    placeholder="e.g. 2nd Year"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Branch</label>
                    <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all uppercase"
                    value={formData.branch}
                    onChange={e => setFormData({...formData, branch: e.target.value})}
                    placeholder="e.g. CSE"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1">College Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={formData.studentEmail}
                  onChange={e => setFormData({...formData, studentEmail: e.target.value})}
                  placeholder="e.g. student@college.edu"
                />
              </div>
              
              <button
                type="submit"
                disabled={registering}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-custom-md disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {registering ? 'Registering...' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};