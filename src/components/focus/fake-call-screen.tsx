'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff } from "lucide-react"
import { useEffect, useState } from "react"

interface FakeCallScreenProps {
  callerName: string
  onHangUp: () => void
}

export function FakeCallScreen({ callerName, onHangUp }: FakeCallScreenProps) {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    const ringtone = new Audio('/sounds/ringtone.mp3');
    ringtone.loop = true;
    ringtone.play().catch(() => {}); // Autoplay might be blocked

    const timer = setInterval(() => {
        const date = new Date();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        setTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => {
        ringtone.pause();
        clearInterval(timer);
    };
  }, []);


  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm text-white flex flex-col items-center justify-between p-8">
      <div className="text-center mt-16">
        <p className="text-xl text-gray-300">{time}</p>
      </div>

      <div className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4">
          <AvatarFallback className="text-4xl bg-gray-600">
            {callerName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-light">{callerName}</h1>
        <p className="text-lg text-gray-400 mt-1">iPhone</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2">
                <Button size="icon" className="rounded-full bg-red-500 hover:bg-red-600 h-16 w-16" onClick={onHangUp}>
                    <PhoneOff className="h-8 w-8" />
                </Button>
                <span className="text-sm">Ablehnen</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Button size="icon" className="rounded-full bg-green-500 hover:bg-green-600 h-16 w-16" onClick={onHangUp}>
                    <Phone className="h-8 w-8" />
                </Button>
                <span className="text-sm">Annehmen</span>
            </div>
        </div>
      </div>
    </div>
  )
}
