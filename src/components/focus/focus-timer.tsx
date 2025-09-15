'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RefreshCw, Coffee, BrainCircuit } from "lucide-react"

const presets = {
  pomodoro: { time: 25 * 60, label: "Fokus", icon: BrainCircuit },
  shortBreak: { time: 5 * 60, label: "Pause", icon: Coffee },
  longBreak: { time: 15 * 60, label: "Lange Pause", icon: Coffee },
};

export function FocusTimer() {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [time, setTime] = useState(presets[mode].time);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setIsActive(false);
      // Optional: Auto-start break
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTime(presets[mode].time);
  }, [mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  const progress = (presets[mode].time - time) / presets[mode].time * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleModeChange = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Fokus-Timer</CardTitle>
        <CardDescription>Nutze die Pomodoro-Technik, um produktiv zu bleiben.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
            {Object.entries(presets).map(([key, value]) => (
                <Button key={key} variant={mode === key ? "secondary" : "ghost"} size="sm" onClick={() => handleModeChange(key as 'pomodoro' | 'shortBreak' | 'longBreak')}>
                  <value.icon className="mr-2 h-4 w-4" />
                  {value.label}
                </Button>
            ))}
        </div>
        <div className="relative h-48 w-48">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="stroke-current text-muted"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
            />
            <circle
              className="stroke-current text-primary transition-all duration-1000 ease-linear"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              strokeDasharray="282.6"
              strokeDashoffset={282.6 - (progress / 100) * 282.6}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-mono tabular-nums">
              {formatTime(time)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button size="icon" className="h-14 w-14 rounded-full" onClick={toggleTimer}>
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full" onClick={resetTimer}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
