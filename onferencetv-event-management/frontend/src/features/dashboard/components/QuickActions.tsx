import { Plus, Sparkles, FileText, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch } from '@/app/hooks';
import { openCreateDialog } from '@/features/events/eventSlice';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create Event',
      icon: Plus,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
      onClick: () => dispatch(openCreateDialog())
    },
    {
      label: 'AI Content',
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
      onClick: () => navigate('/ai-content')
    },
    {
      label: 'Export PDF',
      icon: FileText,
      color: 'text-slate-500',
      bgColor: 'bg-slate-50 dark:bg-slate-500/10',
      onClick: () => navigate('/pdf-exports')
    },
    {
      label: 'Reports',
      icon: BarChart3,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      onClick: () => navigate('/reports')
    }
  ];

  return (
    <div>
      <h3 className="text-base font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, i) => (
          <Card 
            key={i} 
            className="shadow-sm hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-primary/50 group"
            onClick={action.onClick}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
              <div className={`p-2.5 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="text-[10px] font-semibold tracking-tight">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
