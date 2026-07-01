import { Link } from 'react-router-dom';
import { CalendarPlus, Sparkles, Edit, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  {
    id: 1,
    action: 'Event "Advances in Fetal Medicine" was created',
    user: 'John Doe',
    time: '2 hours ago',
    icon: CalendarPlus,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
  },
  {
    id: 2,
    action: 'AI content generated for "AI in Healthcare Summit"',
    user: 'John Doe',
    time: '5 hours ago',
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10'
  },
  {
    id: 3,
    action: 'Event "Neuroscience Update 2026" was updated',
    user: 'John Doe',
    time: '1 day ago',
    icon: Edit,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10'
  },
  {
    id: 4,
    action: 'PDF exported for "Future of Cardiology"',
    user: 'John Doe',
    time: '2 days ago',
    icon: FileText,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10'
  }
];

export function RecentActivity() {
  return (
    <Card className="shadow-sm mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
        <Link to="/reports" className="text-xs font-semibold text-primary hover:underline">
          View all Activity
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, i) => (
            <div key={activity.id} className="flex items-start gap-4 relative group">
              {/* Timeline connecting line */}
              {i !== activities.length - 1 && (
                <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-slate-200 dark:bg-slate-800" />
              )}
              
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              
              <div className="flex flex-col flex-1 min-w-0 pb-1">
                <p className="text-sm font-medium leading-tight text-foreground/90 group-hover:text-foreground transition-colors">
                  {activity.action}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span>{activity.time}</span>
                  <span>by</span>
                  <span className="font-medium text-foreground/70">{activity.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
