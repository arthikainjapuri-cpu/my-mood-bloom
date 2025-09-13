import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MoodEntry {
  value: number;
  label: string;
  note: string;
  timestamp: Date;
}

interface SentimentAnalysisProps {
  moodData: MoodEntry[];
}

// Simple sentiment analysis simulation
const analyzeSentiment = (text: string) => {
  const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'excited', 'joy', 'peaceful', 'calm', 'better', 'awesome', 'beautiful', 'grateful'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'upset', 'disappointed', 'tired', 'exhausted', 'overwhelmed'];
  const neutralWords = ['okay', 'fine', 'alright', 'normal', 'usual', 'average', 'work', 'day', 'time', 'thing'];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  words.forEach(word => {
    if (positiveWords.some(pos => word.includes(pos))) positiveCount++;
    else if (negativeWords.some(neg => word.includes(neg))) negativeCount++;
    else if (neutralWords.some(neu => word.includes(neu))) neutralCount++;
  });

  const total = positiveCount + negativeCount + neutralCount;
  if (total === 0) return { positive: 33, negative: 33, neutral: 34 };

  return {
    positive: Math.round((positiveCount / total) * 100),
    negative: Math.round((negativeCount / total) * 100),
    neutral: Math.round((neutralCount / total) * 100)
  };
};

export const SentimentAnalysis = ({ moodData }: SentimentAnalysisProps) => {
  const entriesWithNotes = moodData.filter(entry => entry.note.trim().length > 0);
  
  const overallSentiment = entriesWithNotes.length > 0 
    ? entriesWithNotes.reduce((acc, entry) => {
        const sentiment = analyzeSentiment(entry.note);
        return {
          positive: acc.positive + sentiment.positive,
          negative: acc.negative + sentiment.negative,
          neutral: acc.neutral + sentiment.neutral
        };
      }, { positive: 0, negative: 0, neutral: 0 })
    : { positive: 0, negative: 0, neutral: 0 };

  if (entriesWithNotes.length > 0) {
    overallSentiment.positive = Math.round(overallSentiment.positive / entriesWithNotes.length);
    overallSentiment.negative = Math.round(overallSentiment.negative / entriesWithNotes.length);
    overallSentiment.neutral = Math.round(overallSentiment.neutral / entriesWithNotes.length);
  }

  const recentEntries = entriesWithNotes.slice(-3);

  const getDominantSentiment = () => {
    const { positive, negative, neutral } = overallSentiment;
    if (positive > negative && positive > neutral) return 'positive';
    if (negative > positive && negative > neutral) return 'negative';
    return 'neutral';
  };

  const sentimentInsights = {
    positive: {
      message: "Your journal entries reflect a positive outlook! 🌟",
      color: "text-wellness-joy",
      bgColor: "bg-wellness-joy/10"
    },
    negative: {
      message: "Your writings show you're working through challenges 💙",
      color: "text-wellness-calm",
      bgColor: "bg-wellness-calm/10"
    },
    neutral: {
      message: "Your entries show a balanced perspective 😌",
      color: "text-wellness-focus",
      bgColor: "bg-wellness-focus/10"
    }
  };

  const dominantSentiment = getDominantSentiment();
  const insight = sentimentInsights[dominantSentiment];

  return (
    <Card className="w-full shadow-[var(--shadow-wellness)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Sentiment Analysis
        </CardTitle>
        <CardDescription>
          Understanding the emotions in your journal entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {entriesWithNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Start adding notes to your mood check-ins to see sentiment analysis
            </p>
          </div>
        ) : (
          <>
            <div className={`p-4 rounded-lg ${insight.bgColor}`}>
              <p className={`font-medium ${insight.color}`}>
                {insight.message}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {entriesWithNotes.length} journal entries
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Positive</span>
                  <span className="text-sm text-muted-foreground">{overallSentiment.positive}%</span>
                </div>
                <Progress value={overallSentiment.positive} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Neutral</span>
                  <span className="text-sm text-muted-foreground">{overallSentiment.neutral}%</span>
                </div>
                <Progress value={overallSentiment.neutral} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Negative</span>
                  <span className="text-sm text-muted-foreground">{overallSentiment.negative}%</span>
                </div>
                <Progress value={overallSentiment.negative} className="h-2" />
              </div>
            </div>

            {recentEntries.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Recent Entries</h4>
                {recentEntries.map((entry, index) => {
                  const sentiment = analyzeSentiment(entry.note);
                  const dominant = sentiment.positive > sentiment.negative 
                    ? (sentiment.positive > sentiment.neutral ? 'positive' : 'neutral')
                    : (sentiment.negative > sentiment.neutral ? 'negative' : 'neutral');
                  
                  return (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                        <Badge variant={dominant === 'positive' ? 'default' : dominant === 'negative' ? 'destructive' : 'secondary'}>
                          {dominant}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2">{entry.note}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};