import { useState } from 'react';
import { MoodCheckIn } from './MoodCheckIn';
import { MoodTrends } from './MoodTrends';
import { WellnessRecommendations } from './WellnessRecommendations';
import { SentimentAnalysis } from './SentimentAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MoodEntry {
  value: number;
  label: string;
  note: string;
  timestamp: Date;
}

export const WellnessDashboard = () => {
  const [moodData, setMoodData] = useState<MoodEntry[]>([
    // Sample data to demonstrate the functionality
    {
      value: 4,
      label: 'Happy',
      note: 'Had a great day at work! Feeling productive and accomplished.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    },
    {
      value: 3,
      label: 'Neutral',
      note: 'Normal day, nothing special but nothing bad either.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      value: 2,
      label: 'Sad',
      note: 'Feeling a bit overwhelmed with work and personal tasks.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ]);

  const handleMoodSubmit = (newMood: MoodEntry) => {
    setMoodData(prev => [newMood, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wellness-peace/5 to-wellness-calm/5">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mental Wellness Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your emotional journey, gain insights, and discover personalized wellness recommendations
          </p>
        </header>

        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:mx-auto">
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Wellness</TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
            
            {moodData.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">Recent Check-ins</h3>
                <div className="space-y-3">
                  {moodData.slice(0, 3).map((entry, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg border shadow-sm">
                      <div className="text-2xl">
                        {entry.value === 5 ? '😄' : entry.value === 4 ? '😊' : entry.value === 3 ? '😐' : entry.value === 2 ? '😔' : '😰'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{entry.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends">
            <MoodTrends moodData={moodData} />
          </TabsContent>

          <TabsContent value="insights">
            <SentimentAnalysis moodData={moodData} />
          </TabsContent>

          <TabsContent value="recommendations">
            <WellnessRecommendations moodData={moodData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};