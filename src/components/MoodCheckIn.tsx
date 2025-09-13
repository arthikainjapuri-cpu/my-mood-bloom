import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const moods = [
  { emoji: '😄', label: 'Joyful', value: 5, color: 'wellness-joy' },
  { emoji: '😊', label: 'Happy', value: 4, color: 'wellness-energy' },
  { emoji: '😐', label: 'Neutral', value: 3, color: 'wellness-focus' },
  { emoji: '😔', label: 'Sad', value: 2, color: 'wellness-calm' },
  { emoji: '😰', label: 'Anxious', value: 1, color: 'wellness-peace' },
];

interface MoodCheckInProps {
  onMoodSubmit: (mood: { value: number; label: string; note: string; timestamp: Date }) => void;
}

export const MoodCheckIn = ({ onMoodSubmit }: MoodCheckInProps) => {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today",
      });
      return;
    }

    onMoodSubmit({
      value: selectedMood.value,
      label: selectedMood.label,
      note,
      timestamp: new Date(),
    });

    toast({
      title: "Mood recorded!",
      description: `Thanks for sharing that you're feeling ${selectedMood.label.toLowerCase()}`,
    });

    setSelectedMood(null);
    setNote('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-[var(--shadow-wellness)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          How are you feeling today?
        </CardTitle>
        <CardDescription>
          Take a moment to check in with yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedMood?.value === mood.value
                  ? 'border-primary bg-primary/10 shadow-[var(--shadow-glow)]'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.label}</div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            How was your day? (Optional)
          </label>
          <Textarea
            placeholder="Share any thoughts about your day..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium"
          disabled={!selectedMood}
        >
          Record Mood
        </Button>
      </CardContent>
    </Card>
  );
};