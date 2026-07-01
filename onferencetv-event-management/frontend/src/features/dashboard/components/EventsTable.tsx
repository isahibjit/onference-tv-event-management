import { useState, useMemo, useEffect } from 'react';
import { useGetEventsQuery, useGenerateContentMutation } from '@/app/apiSlice';
import { format } from 'date-fns';
import { 
  Search, Eye, Edit, Trash2, MoreVertical, 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { openEditDialog, openDeleteDialog, openViewDialog, openCreateDialog } from '@/features/events/eventSlice';

export function EventsTable() {
  const { data, isLoading } = useGetEventsQuery();
  const [generateContent] = useGenerateContentMutation();
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const events = data?.data || [];

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(e => 
        e.eventName.toLowerCase().includes(lowerSearch) || 
        e.speakerName.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by Status (Upcoming vs Completed - derived from date)
    if (statusFilter !== 'All') {
      const now = new Date();
      result = result.filter(e => {
        const isUpcoming = new Date(e.eventDate) >= now;
        if (statusFilter === 'Upcoming') return isUpcoming;
        if (statusFilter === 'Completed') return !isUpcoming;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.eventDate).getTime();
      const dateB = new Date(b.eventDate).getTime();
      return sortOrder === 'Newest' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [events, debouncedSearch, statusFilter, sortOrder]);

  // Pagination
  const totalItems = filteredAndSortedEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (date: string | Date) => {
    const isUpcoming = new Date(date) >= new Date();
    if (isUpcoming) {
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 shadow-none border-0 font-medium">Upcoming</Badge>;
    }
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none border-0 font-medium">Completed</Badge>;
  };

  const handleGenerateAI = async (id: string) => {
    try {
      await generateContent(id).unwrap();
      toast.success("AI Content Generated Successfully!");
    } catch (error) {
      toast.error("Failed to generate AI content.");
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm flex flex-col h-full">
      <div className="p-5 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-bold">All Events</h2>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by event name or speaker..." 
              className="pl-9 h-9 text-sm rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[110px] h-9 text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Sort: Newest</SelectItem>
              <SelectItem value="Oldest">Sort: Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
                <TableRow key={event.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white shadow-inner">
                        <span className="font-bold text-lg">{event.eventName.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm truncate">{event.eventName}</span>
                        <span className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> Tech Park, San Francisco
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(event.eventDate), 'dd MMM yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground ml-5">{format(new Date(event.eventDate), 'EEE')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${event.speakerName}`} />
                        <AvatarFallback>{event.speakerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{event.speakerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{event.speakerDesignation.split(',')[0]}</span>
                      {event.speakerDesignation.split(',')[1] && (
                        <span className="text-xs text-muted-foreground">{event.speakerDesignation.split(',')[1]}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(event.eventDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => dispatch(openViewDialog(event.id))}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600" onClick={() => dispatch(openEditDialog(event.id))}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => dispatch(openDeleteDialog(event.id))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleGenerateAI(event.id)} className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4 text-purple-500" /> Generate AI Content
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium text-foreground">No events found</p>
                    <p className="text-sm mt-1 mb-4">Try adjusting your filters or create a new event.</p>
                    <Button onClick={() => dispatch(openCreateDialog())}>Create Event</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
        <div>
          Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} events
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === i + 1 ? 'bg-primary' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
