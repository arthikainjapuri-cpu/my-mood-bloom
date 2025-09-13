import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MoodEntry {
  value: number;
  label: string;
  note: string;
  timestamp: Date;
}

interface MoodTrendsProps {
  moodData: MoodEntry[];
}

export const MoodTrends = ({ moodData }: MoodTrendsProps) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = {
    labels: last7Days.map(date => 
      date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Mood Score',
        data: last7Days.map(date => {
          const dayMoods = moodData.filter(mood => 
            mood.timestamp.toDateString() === date.toDateString()
          );
          return dayMoods.length > 0 
            ? dayMoods.reduce((sum, mood) => sum + mood.value, 0) / dayMoods.length 
            : null;
        }),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--background))',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const moodLabels = {
              5: 'Joyful',
              4: 'Happy', 
              3: 'Neutral',
              2: 'Sad',
              1: 'Anxious'
            };
            return `Mood: ${moodLabels[Math.round(value) as keyof typeof moodLabels] || 'Unknown'}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            const labels = ['', 'Anxious', 'Sad', 'Neutral', 'Happy', 'Joyful'];
            return labels[value];
          },
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      x: {
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  const averageMood = moodData.length > 0 
    ? moodData.reduce((sum, mood) => sum + mood.value, 0) / moodData.length 
    : 0;

  const getMoodInsight = (avg: number) => {
    if (avg >= 4.5) return { text: "You've been feeling great lately! 🌟", color: "text-wellness-joy" };
    if (avg >= 3.5) return { text: "Your mood has been positive overall 😊", color: "text-wellness-energy" };
    if (avg >= 2.5) return { text: "You've had some ups and downs 😐", color: "text-wellness-focus" };
    if (avg >= 1.5) return { text: "It's been a challenging time 😔", color: "text-wellness-calm" };
    return { text: "Take extra care of yourself 💙", color: "text-wellness-peace" };
  };

  const insight = getMoodInsight(averageMood);

  return (
    <Card className="w-full shadow-[var(--shadow-wellness)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Mood Trends
        </CardTitle>
        <CardDescription>
          Your emotional journey over the past 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Average Mood</p>
            <p className="text-2xl font-bold">{averageMood.toFixed(1)}/5</p>
          </div>
          <div className="text-right">
            <p className={`font-medium ${insight.color}`}>{insight.text}</p>
            <p className="text-sm text-muted-foreground">
              {moodData.length} check-ins recorded
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};