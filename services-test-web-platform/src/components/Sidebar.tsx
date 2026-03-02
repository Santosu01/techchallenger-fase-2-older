import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Key,
  Flag,
  Target,
  PlayCircle,
  BarChart3,
  ToggleLeft,
  X,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'Authentication', path: '/auth', icon: Key },
    { title: 'Feature Flags', path: '/flags', icon: Flag },
    { title: 'Targeting Rules', path: '/targeting', icon: Target },
    { title: 'Evaluation API', path: '/evaluation', icon: PlayCircle },
    { title: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-64 glass border-r border-glass-border flex flex-col p-6 z-50 transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <ToggleLeft className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Toggle<span className="gradient-text">Master</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                  isActive
                    ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                )
              }
            >
              <item.icon
                className={cn('w-5 h-5 transition-transform duration-300', 'group-hover:scale-110')}
              />
              <span className="font-medium text-sm">{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 glass rounded-2xl border border-glass-border">
          <div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-1">
            Status do Sistema
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium">Todos os serviços OK</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
