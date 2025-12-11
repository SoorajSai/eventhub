import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/gemini';
import { CloudinaryService } from '../services/cloudinary';
import { Event, EventCategory } from '../types';
import { Sparkles, Save, X, Loader2, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

export const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    category: EventCategory.Other,
    venue: '',
    organizer: '',
    contactEmail: '',
    maxParticipants: 100,
    bannerUrl: '',
    posterUrl: ''
  });

  // Date strings for inputs
  const [dates, setDates] = useState({
    date: '',
    deadline: ''
  });

  useEffect(() => {
    if (isEditMode) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    const event = await StorageService.getEventById(id);
    if (event) {
      setFormData(event);
      setDates({
        date: new Date(event.date).toISOString().slice(0, 16),
        deadline: new Date(event.deadline).toISOString().slice(0, 16)
      });
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.organizer) {
      alert("Please enter a Title and Organizer first.");
      return;
    }
    setGeneratingAI(true);
    const desc = await GeminiService.generateEventDescription(
      formData.title!,
      formData.category || 'Event',
      formData.organizer!
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setGeneratingAI(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'poster') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = type === 'banner' ? setUploadingBanner : setUploadingPoster;
    
    setUploading(true);
    try {
      const url = await CloudinaryService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        [type === 'banner' ? 'bannerUrl' : 'posterUrl']: url
      }));
    } catch (error) {
      alert('Failed to upload image. Please check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (type: 'banner' | 'poster') => {
    setFormData(prev => ({
      ...prev,
      [type === 'banner' ? 'bannerUrl' : 'posterUrl']: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventPayload: Event = {
        ...formData as Event,
        id: isEditMode ? id! : Math.random().toString(36).substr(2, 9),
        date: new Date(dates.date).toISOString(),
        deadline: new Date(dates.deadline).toISOString(),
        registrations: isEditMode && formData.registrations ? formData.registrations : []
      };

      // Set default images if empty (only if user didn't upload anything)
      if (!eventPayload.bannerUrl) eventPayload.bannerUrl = `https://picsum.photos/1200/400?random=${Math.random()}`;
      if (!eventPayload.posterUrl) eventPayload.posterUrl = `https://picsum.photos/400/600?random=${Math.random()}`;

      await StorageService.saveEvent(eventPayload);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Failed to save event", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-background min-h-screen">
      <div className="bg-card rounded-xl shadow-custom-lg border border-border overflow-hidden">
        <div className="px-8 py-6 border-b border-border bg-muted/20 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground font-serif">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-foreground mb-1">Event Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Category</label>
              <select
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as EventCategory})}
              >
                {Object.values(EventCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Organizer Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                value={formData.organizer}
                onChange={e => setFormData({...formData, organizer: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-foreground">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={generatingAI}
                  className="flex items-center text-xs text-primary hover:text-primary/80 font-bold bg-primary/10 px-3 py-1 rounded-full transition-colors border border-primary/20"
                >
                  {generatingAI ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  Generate with AI
                </button>
              </div>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your event..."
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-foreground mb-1">Event Date & Time</label>
               <input
                 type="datetime-local"
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                 value={dates.date}
                 onChange={e => setDates({...dates, date: e.target.value})}
               />
            </div>

            <div>
               <label className="block text-sm font-bold text-foreground mb-1">Registration Deadline</label>
               <input
                 type="datetime-local"
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                 value={dates.deadline}
                 onChange={e => setDates({...dates, deadline: e.target.value})}
               />
            </div>

            <div>
               <label className="block text-sm font-bold text-foreground mb-1">Venue</label>
               <input
                 type="text"
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                 value={formData.venue}
                 onChange={e => setFormData({...formData, venue: e.target.value})}
               />
            </div>
             <div>
               <label className="block text-sm font-bold text-foreground mb-1">Max Participants</label>
               <input
                 type="number"
                 required
                 min="1"
                 className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                 value={formData.maxParticipants}
                 onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
               />
            </div>

             <div className="col-span-2">
               <label className="block text-sm font-bold text-foreground mb-1">Contact Email</label>
               <input
                 type="email"
                 required
                 className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-custom-xs"
                 value={formData.contactEmail}
                 onChange={e => setFormData({...formData, contactEmail: e.target.value})}
               />
            </div>
            
             {/* Banner Image Upload */}
             <div className="col-span-2 md:col-span-1">
               <label className="block text-sm font-bold text-foreground mb-2">Banner Image</label>
               {formData.bannerUrl ? (
                 <div className="relative group rounded-lg overflow-hidden border border-border shadow-custom-sm">
                   <img src={formData.bannerUrl} alt="Banner Preview" className="w-full h-40 object-cover" />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button" 
                        onClick={() => removeImage('banner')}
                        className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-custom-md"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                   </div>
                 </div>
               ) : (
                 <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer relative bg-input">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'banner')}
                      disabled={uploadingBanner}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploadingBanner ? (
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground font-medium">Click to upload Banner</span>
                      </>
                    )}
                 </div>
               )}
            </div>

            {/* Poster Image Upload */}
            <div className="col-span-2 md:col-span-1">
               <label className="block text-sm font-bold text-foreground mb-2">Poster Image</label>
               {formData.posterUrl ? (
                 <div className="relative group rounded-lg overflow-hidden border border-border shadow-custom-sm">
                   <img src={formData.posterUrl} alt="Poster Preview" className="w-full h-40 object-cover" />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button" 
                        onClick={() => removeImage('poster')}
                        className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-custom-md"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                   </div>
                 </div>
               ) : (
                 <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer relative bg-input">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'poster')}
                      disabled={uploadingPoster}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploadingPoster ? (
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground font-medium">Click to upload Poster</span>
                      </>
                    )}
                 </div>
               )}
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end space-x-4">
             <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingBanner || uploadingPoster}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-bold flex items-center disabled:opacity-70 transition-all shadow-custom-md"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};