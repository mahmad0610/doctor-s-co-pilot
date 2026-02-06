import { ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import {
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  Clock,
  Settings,
  Bell,
  LogOut,
  Activity,
  Home,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { title: 'Patients', url: '/patients', icon: Users, badge: 24 },
  { title: 'Scheduling', url: '/scheduling', icon: Calendar },
  { title: 'Messages', url: '/messages', icon: MessageSquare, badge: 5 },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Alerts', url: '/alerts', icon: AlertTriangle, badge: 3 },
  { title: 'Audit Log', url: '/audit', icon: Clock },
  { title: 'Settings', url: '/settings', icon: Settings },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'text-center' : ''}>
            {collapsed ? (
              <Activity className="h-5 w-5 text-primary" />
            ) : (
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Sehatly</span>
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent transition-colors"
                      activeClassName="bg-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
            <div className="flex h-16 items-center gap-4 px-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              
              <div className="flex-1" />

              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        D
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-sm">
                      <span className="font-medium">Demo Doctor</span>
                      <span className="text-xs text-muted-foreground">Clinician</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/')} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Exit Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-card px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>© 2024 Sehatly</span>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">System Status:</span>
                <span className="flex items-center gap-1 text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Operational
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
