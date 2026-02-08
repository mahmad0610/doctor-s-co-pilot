import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageSquare,
  Stethoscope,
  Calendar,
  Plus,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  appointmentCount?: number;
}

const menuItems = [
  { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  { id: 'doctors', label: 'Find Doctors', icon: Search },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
];

export function PatientSidebar({
  activeView,
  onViewChange,
  collapsed,
  onCollapsedChange,
  appointmentCount = 0,
}: PatientSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r bg-card transition-all duration-300 ease-in-out flex-shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo + Collapse toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Sehatly</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8 text-muted-foreground hover:text-foreground', collapsed && 'hidden')}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-4 pb-2">
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start gap-2 border-dashed',
            collapsed && 'justify-center px-0'
          )}
          onClick={() => onViewChange('chat')}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && 'New Chat'}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              collapsed && 'justify-center px-0',
              activeView === item.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'appointments' && appointmentCount > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                    {appointmentCount}
                  </Badge>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t space-y-1">
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-9 text-muted-foreground hover:text-foreground"
            onClick={() => onCollapsedChange(false)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <button
          onClick={() => navigate('/doctors/search')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all',
            collapsed && 'justify-center px-0'
          )}
        >
          <Stethoscope className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Doctor Search</span>}
        </button>
        <button
          onClick={() => navigate('/')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Back to Home</span>}
        </button>
      </div>
    </aside>
  );
}
