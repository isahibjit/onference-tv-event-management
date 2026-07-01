import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const data = [
  { name: 'Jan', events: 0 },
  { name: 'Feb', events: 4 },
  { name: 'Mar', events: 3 },
  { name: 'Apr', events: 5 },
  { name: 'May', events: 6 },
  { name: 'Jun', events: 4 },
  { name: 'Jul', events: 6 },
  { name: 'Aug', events: 8 },
  { name: 'Sep', events: 5 },
  { name: 'Oct', events: 4 },
  { name: 'Nov', events: 4 },
  { name: 'Dec', events: 6 },
];

export function MonthlyStatistics() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold">Events by Month</CardTitle>
        <Select defaultValue="this-year">
          <SelectTrigger className="w-[110px] h-8 text-xs border-slate-200">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#888888' }}
                dy={10}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#888888' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="events" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 4, 4]} 
                barSize={12}
                opacity={0.3}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
