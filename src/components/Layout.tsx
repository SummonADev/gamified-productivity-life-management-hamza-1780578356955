import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scroll, RefreshCw, FolderKanban, Globe, ShoppingBag, User, Trophy, BarChart3 } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/quests', label: 'Quests', icon: Scroll },
  { to: '/habits', label: 'Habits', icon: RefreshCw },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/world', label: 'World', icon: Globe },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/character', label: 'Character', icon: User },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <nav className="bg-cloud p-3 flex md:flex-col gap-1 md:w-52 md:min-h-screen overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-mist">
        <div className="hidden md:block text-center py-4 mb-2">
          <span className="text-2xl">🏡</span>
          <h1 className="text-lg font-bold text-cocoa">Cozy Quest</h1>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-sage text-cocoa'
                  : 'text-bark hover:bg-mist'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
