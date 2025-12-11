import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { LogOut, LayoutDashboard, Home, PlusCircle, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = StorageService.isAuthenticated();

  const handleLogout = () => {
    StorageService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <nav className="bg-card shadow-custom-sm sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src="/logo.png" className="w-10 h-10" alt="" />
                <span className="text-xl font-bold text-foreground tracking-tight font-serif">EventHub</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </div>
              </Link>

              {!isAdmin ? (
                <Link 
                  to="/admin/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  Admin Login
                </Link>
              ) : (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname.includes('/admin/dashboard') 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                    }`}
                  >
                     <div className="flex items-center space-x-1">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                   <Link 
                    to="/admin/events/new" 
                    className={`hidden sm:flex px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname.includes('/admin/events/new') 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                    }`}
                  >
                     <div className="flex items-center space-x-1">
                      <PlusCircle className="h-4 w-4" />
                      <span>New Event</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive flex items-center space-x-2 transition-colors shadow-custom-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-card border-t border-border mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2025 Mini Project EventHub. Sooraj Bangera(4SH23AD025),SDIT.</p>
        </div>
      </footer>
    </div>
  );
};