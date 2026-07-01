import { Search, Bell, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/app/hooks';
import { openCreateDialog } from '@/features/events/eventSlice';

export function TopNav() {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, John! Here's what's happening with your events.</p>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="relative w-64 md:w-80 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events, speakers..."
            className="w-full bg-slate-50 dark:bg-slate-900 shadow-none appearance-none pl-9 pr-10 rounded-lg border-slate-200 dark:border-slate-800 focus-visible:ring-primary/30"
          />
          <div className="absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
            <span className="text-xs">/</span>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
        </Button>

        <Button onClick={() => dispatch(openCreateDialog())} className="rounded-lg shadow-sm font-semibold tracking-wide">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
    </header>
  );
}
