import { useState } from 'react';
import { Sparkles, Copy, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useGetEventsQuery } from '@/app/apiSlice';
import { 
  useGetAiHistoryQuery, 
  useSaveAiHistoryMutation, 
  useDeleteAiHistoryMutation,
  useGenerateWithGeminiMutation
} from './aiApi';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function AiContentPage() {
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery();
  const events = eventsData?.data || [];
  
  const { data: history = [], isLoading: historyLoading } = useGetAiHistoryQuery();
  const [saveHistory] = useSaveAiHistoryMutation();
  const [deleteHistory] = useDeleteAiHistoryMutation();
  const [generateWithGemini, { isLoading: isGenerating }] = useGenerateWithGeminiMutation();

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [promptType, setPromptType] = useState('description');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [creativity] = useState('0.7');
  
  const [currentGeneration, setCurrentGeneration] = useState('');
  const [activeTab, setActiveTab] = useState('generate');

  const handleGenerate = async () => {
    if (!selectedEventId) {
      toast.error('Please select an event first');
      return;
    }

    const event = events.find(e => e.id === selectedEventId);
    if (!event) return;

    try {
      const result = await generateWithGemini({
        eventId: event.id,
        eventName: event.eventName,
        speakerName: event.speakerName,
        speakerDesignation: event.speakerDesignation,
        promptType: promptType as any,
        creativity,
        tone,
        length
      }).unwrap();

      setCurrentGeneration(result);
      
      // Auto-save to history
      await saveHistory({
        eventId: event.id,
        eventName: event.eventName,
        promptType: promptType === 'description' ? 'Event Description' : 'Speaker Introduction',
        generatedContent: result
      }).unwrap();

      toast.success('Content generated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to generate content');
    }
  };

  const handleCopy = () => {
    if (!currentGeneration) return;
    navigator.clipboard.writeText(currentGeneration);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-indigo-500" />
          AI Content Studio
        </h1>
        <p className="text-muted-foreground">Generate professional event descriptions and speaker intros powered by Google Gemini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Generation Controls</CardTitle>
              <CardDescription>Configure parameters for the AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Target Event</Label>
                {eventsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event..." />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((e: any) => (
                        <SelectItem key={e.id} value={e.id}>{e.eventName}</SelectItem>
                      ))}
                      {events.length === 0 && (
                        <SelectItem value="none" disabled>No events found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={promptType} onValueChange={setPromptType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="description">Event Description</SelectItem>
                    <SelectItem value="speakerIntro">Speaker Introduction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Exciting">Exciting</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Short">Short</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md transition-all hover:shadow-lg"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedEventId}
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900">
            <CardContent className="p-4 text-sm text-indigo-800 dark:text-indigo-300">
              <p className="flex gap-2">
                <Sparkles className="h-5 w-5 shrink-0" />
                Tip: Adjusting the global AI Temperature in Settings will directly affect how creative (or factual) these generations are.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output & History */}
        <div className="lg:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 w-[400px] mb-4">
              <TabsTrigger value="generate">Current Generation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="flex-1 mt-0">
              <Card className="shadow-sm h-full flex flex-col min-h-[600px]">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <CardTitle className="text-lg">Output Editor</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!currentGeneration}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                  {currentGeneration ? (
                    <Textarea 
                      className="w-full h-full min-h-[500px] p-6 resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
                      value={currentGeneration}
                      onChange={(e) => setCurrentGeneration(e.target.value)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                        <Sparkles className="h-8 w-8 opacity-20" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-1">Ready to Generate</h3>
                      <p className="max-w-sm">Select an event and click generate to create high-quality content instantly.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <Card className="shadow-sm min-h-[600px]">
                <CardHeader>
                  <CardTitle>Generation History</CardTitle>
                  <CardDescription>Review and recover past AI content generations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {historyLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))}
                      </div>
                    ) : history.length > 0 ? (
                      <div className="space-y-4">
                        {history.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:border-indigo-200 transition-colors bg-card">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-sm">{item.eventName}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                    {item.promptType}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2"
                                  onClick={() => {
                                    setCurrentGeneration(item.generatedContent);
                                    setActiveTab('generate');
                                  }}
                                >
                                  Load
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                  onClick={() => deleteHistory(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-3 bg-muted/30 p-3 rounded-md">
                              {item.generatedContent}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                        <Clock className="h-12 w-12 mb-4 opacity-20" />
                        <p>No history found.</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}
