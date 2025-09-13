import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MoodEntry {
  value: number;
  label: string;
  note: string;
  timestamp: Date;
}

interface WellnessRecommendationsProps {
  moodData: MoodEntry[];
}

const recommendations = {
  low: [
    {
      title: "Mindful Breathing",
      description: "Try a 5-minute breathing exercise to center yourself",
      category: "Relaxation",
      icon: "🧘‍♀️",
      time: "5 min"
    },
    {
      title: "Gentle Walk",
      description: "A short walk outside can boost your mood naturally",
      category: "Exercise",
      icon: "🚶‍♀️",
      time: "10-15 min"
    },
    {
      title: "Gratitude Practice",
      description: "Write down 3 things you're grateful for today",
      category: "Mindfulness",
      icon: "📝",
      time: "5 min"
    },
    {
      title: "Call a Friend",
      description: "Connect with someone who makes you feel supported",
      category: "Social",
      icon: "📞",
      time: "15-30 min"
    }
  ],
  medium: [
    {
      title: "Meditation Session",
      description: "Try a guided meditation to find inner peace",
      category: "Mindfulness",
      icon: "🧘",
      time: "10-20 min"
    },
    {
      title: "Creative Expression",
      description: "Draw, write, or engage in any creative activity",
      category: "Creativity",
      icon: "🎨",
      time: "20-30 min"
    },
    {
      title: "Nature Time",
      description: "Spend time outdoors in a natural setting",
      category: "Nature",
      icon: "🌳",
      time: "30+ min"
    },
    {
      title: "Yoga Flow",
      description: "Gentle yoga to connect mind and body",
      category: "Exercise",
      icon: "🤸‍♀️",
      time: "15-30 min"
    }
  ],
  high: [
    {
      title: "Share Your Joy",
      description: "Spread positivity by helping or encouraging others",
      category: "Social",
      icon: "💖",
      time: "Variable"
    },
    {
      title: "Energy Workout",
      description: "Channel your positive energy into exercise",
      category: "Exercise",
      icon: "💪",
      time: "30-45 min"
    },
    {
      title: "Plan Something Fun",
      description: "Organize an activity you're excited about",
      category: "Planning",
      icon: "📅",
      time: "15-20 min"
    },
    {
      title: "Practice Mindfulness",
      description: "Savor this positive moment with awareness",
      category: "Mindfulness",
      icon: "✨",
      time: "10 min"
    }
  ]
};

export const WellnessRecommendations = ({ moodData }: WellnessRecommendationsProps) => {
  const getRecommendationLevel = () => {
    if (moodData.length === 0) return 'medium';
    
    const recentMoods = moodData.slice(-3);
    const averageRecent = recentMoods.reduce((sum, mood) => sum + mood.value, 0) / recentMoods.length;
    
    if (averageRecent <= 2.5) return 'low';
    if (averageRecent >= 4) return 'high';
    return 'medium';
  };

  const level = getRecommendationLevel();
  const currentRecommendations = recommendations[level];

  const levelConfig = {
    low: {
      title: "Gentle Care",
      description: "Take it easy with these nurturing activities",
      gradient: "from-wellness-calm to-wellness-peace"
    },
    medium: {
      title: "Balanced Wellness",
      description: "Maintain your emotional equilibrium",
      gradient: "from-wellness-focus to-wellness-calm"
    },
    high: {
      title: "Positive Energy",
      description: "Channel your good vibes into meaningful activities",
      gradient: "from-wellness-joy to-wellness-energy"
    }
  };

  const config = levelConfig[level];

  return (
    <Card className="w-full shadow-[var(--shadow-wellness)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💡 Personalized Recommendations
        </CardTitle>
        <CardDescription>
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg bg-gradient-to-r ${config.gradient} bg-opacity-10`}>
          <h3 className="font-semibold text-lg mb-1">{config.title}</h3>
          <p className="text-sm text-muted-foreground">
            Based on your recent mood patterns
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {currentRecommendations.map((rec, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rec.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {rec.category}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Try Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};