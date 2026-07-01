import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Events', path: '/events', icon: CalendarDays },
  { name: 'AI Content', path: '/ai-content', icon: Sparkles },
  { name: 'PDF Exports', path: '/pdf-exports', icon: FileText },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-slate-50/50 dark:bg-zinc-950 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
          <CalendarDays className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl tracking-tight">Ofference Events</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive 
                  ? 'bg-primary/10 text-primary relative' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 mb-4 hover:bg-muted rounded-lg transition-colors cursor-pointer">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
          <Sparkles className="h-6 w-6 mb-3 text-white/90" />
          <h4 className="font-semibold mb-1">Upgrade your events</h4>
          <p className="text-xs text-white/80 mb-4">Generate AI content and export beautiful PDFs.</p>
          <Button variant="secondary" className="w-full h-8 text-xs font-semibold rounded-md shadow-sm">
            Explore Features <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
