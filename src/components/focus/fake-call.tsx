'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { FakeCallScreen } from "./fake-call-screen"
import { useToast } from "@/hooks/use-toast"
import { PhoneForwarded } from "lucide-react"

const timerOptions = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
]

export function FakeCall() {
  const [callerName, setCallerName] = useState('Mama')
  const [callerNumber, setCallerNumber] = useState('+41 79 123 45 67')
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null)
  const [isCalling, setIsCalling] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(c => (c !== null ? c - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      setIsCalling(true);
      setCountdown(null);
      setSelectedTimer(null);
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [countdown]);
  

  const handleTimerClick = (seconds: number) => {
    setSelectedTimer(seconds);
    setCountdown(seconds);
    toast({
      title: 'Fake-Anruf geplant',
      description: `Der Anruf von ${callerName} startet in ${seconds} Sekunden.`,
    });
  }
  
  const cancelTimer = () => {
    setCountdown(null);
    setSelectedTimer(null);
    toast({
      title: 'Anruf abgebrochen',
      description: 'Der geplante Fake-Anruf wurde gestoppt.',
    });
  }

  const startCallImmediately = () => {
    setIsCalling(true);
  }

  if (isCalling) {
    return <FakeCallScreen callerName={callerName} callerNumber={callerNumber} onHangUp={() => setIsCalling(false)} />
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Fake-Anruf</CardTitle>
        <CardDescription>Simuliere einen Anruf, um diskret aus einer Situation auszusteigen.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="callerName">Anrufername</Label>
              <Input 
                id="callerName" 
                value={callerName} 
                onChange={(e) => setCallerName(e.target.value)} 
                placeholder="z.B. Mama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callerNumber">Telefonnummer (optional)</Label>
              <Input 
                id="callerNumber" 
                value={callerNumber} 
                onChange={(e) => setCallerNumber(e.target.value)} 
                placeholder="+41 79 123 45 67"
              />
            </div>
        </div>
        <div className="space-y-2">
            <Label>Timer</Label>
            <p className="text-sm text-muted-foreground">Wähle, wann der Anruf starten soll.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timerOptions.map(timer => (
                <Button 
                  key={timer.value} 
                  variant={selectedTimer === timer.value ? 'default' : 'outline'}
                  onClick={() => handleTimerClick(timer.value)}
                  disabled={countdown !== null}
                >
                  {timer.label}
                </Button>
              ))}
            </div>
        </div>

        {countdown !== null && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="font-mono text-2xl mb-2">{countdown}s</p>
            <Button variant="ghost" size="sm" onClick={cancelTimer}>Abbrechen</Button>
          </div>
        )}
      </CardContent>
       <CardFooter>
            <Button className="w-full" onClick={startCallImmediately} disabled={countdown !== null}>
                <PhoneForwarded className="mr-2 h-4 w-4" />
                Sofort anrufen
            </Button>
        </CardFooter>
    </Card>
  )
}
