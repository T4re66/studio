
"use client"

import * as React from "react";
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Laptop } from "lucide-react"
import { Skeleton } from "../ui/skeleton";

export function ThemeSelector() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true);
  }, []);


  const themes = [
    { name: "Hell", value: "light", icon: Sun },
    { name: "Dunkel", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Laptop },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Erscheinungsbild</CardTitle>
        <CardDescription>
          Wähle aus, wie die Anwendung für dich aussehen soll.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? "default" : "ghost"}
                onClick={() => setTheme(t.value)}
                className="justify-start px-3"
              >
                <t.icon className="mr-2" />
                {t.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
             {themes.map((t) => (
              <Skeleton key={t.value} className="h-10 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
