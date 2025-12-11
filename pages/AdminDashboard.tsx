import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { DashboardStats, Event } from '../types';
import { Plus, Edit2, Trash2, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = [
  'var(--chart-1)', 
  'var(--chart-2)', 
  'var(--chart-3)', 
  'var(--chart-4)', 
  'var(--chart-5)'
];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await StorageService.getStats();
    const e = await StorageService.getEvents();
    setStats(s);
    setEvents(e);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      await StorageService.deleteEvent(id);
      loadData();
    }
  };

  if (!stats) return <div className="p-8 text-center text-foreground bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading Dashboard...</div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-foreground font-serif">Admin Dashboard</h1>
        <Link 
          to="/admin/events/new"
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-custom-md font-bold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-custom-sm border border-border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Events</p>
                    <p className="text-3xl font-black text-foreground mt-2">{stats.totalEvents}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
                    <Calendar className="h-6 w-6 text-primary" />
                </div>
            </div>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-custom-sm border border-border">
             <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Registrations</p>
                    <p className="text-3xl font-black text-foreground mt-2">{stats.totalParticipants}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-full border border-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                </div>
            </div>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-custom-sm border border-border">
             <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Upcoming Events</p>
                    <p className="text-3xl font-black text-foreground mt-2">{stats.upcomingEvents}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-full border border-orange-100">
                    <Calendar className="h-6 w-6 text-orange-600" />
                </div>
            </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-custom-sm border border-border h-80">
          <h3 className="text-lg font-bold text-foreground mb-4 font-serif">Event Categories</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-custom-sm border border-border h-80">
           <h3 className="text-lg font-bold text-foreground mb-4 font-serif">Registration Overview</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={events.slice(0, 5).map(e => ({ name: e.title.substring(0, 15)+'...', count: e.registrations.length }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: 'var(--muted-foreground)'}} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{fill: 'var(--muted-foreground)'}} />
                <Tooltip 
                   cursor={{fill: 'var(--muted)'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-card shadow-custom-md rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-lg font-bold text-foreground font-serif">Manage Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Registrations</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-foreground">{event.title}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">{event.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                    {event.registrations.length} / {event.maxParticipants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${new Date(event.deadline) > new Date() ? 'bg-green-100 text-green-800 border-green-200' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                      {new Date(event.deadline) > new Date() ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                      className="text-primary hover:text-primary/70 p-2 rounded-full hover:bg-primary/10 transition-all mr-2"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {/* Fixed Delete Button */}
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="text-destructive hover:text-destructive-foreground p-2 rounded-full hover:bg-destructive transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};