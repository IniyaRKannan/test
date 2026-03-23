"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Pause, 
  Play, 
  RefreshCcw, 
  ShieldAlert, 
  Coffee,
  Sparkles,
  Volume2,
  Gamepad2,
  MessageCircle
} from "lucide-react"
import { suggestBreakActivity, type SuggestBreakActivityOutput } from "@/ai/flows/suggest-break-activity"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function FocusPage() {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes default
  const [totalTime, setTotalTime] = useState(25 * 60)
  const [showBreakDialog, setShowBreakDialog] = useState(false)
  const [suggestedBreak, setSuggestedBreak] = useState<SuggestBreakActivityOutput | null>(null)
  const [isSuggesting, setIsSuggesting] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      handleSessionEnd()
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isActive, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleToggle = () => setIsActive(!isActive)
  
  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
    setTotalTime(25 * 60)
  }

  const handleSessionEnd = async () => {
    setIsActive(false)
    toast({ title: "Session Complete!", description: "Great work! Time for a well-deserved break." })
    await fetchBreakSuggestion()
  }

  const fetchBreakSuggestion = async () => {
    setIsSuggesting(true)
    try {
      const suggestion = await suggestBreakActivity({
        preferredActivityTypes: ['music', 'chatbot', 'meditation'],
        currentMood: "slightly tired but focused",
        focusDurationMinutes: totalTime / 60
      })
      setSuggestedBreak(suggestion)
      setShowBreakDialog(true)
    } catch (e) {
      toast({ variant: "destructive", title: "Couldn't fetch suggestion" })
    } finally {
      setIsSuggesting(false)
    }
  }

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tighter text-primary flex items-center justify-center gap-3">
          <Zap className={`w-10 h-10 ${isActive ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
          Focus Mode
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Distracting apps are currently blocked. Your productivity is our priority.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative w-80 h-80 rounded-full flex flex-col items-center justify-center border-none shadow-2xl bg-white">
          <CardContent className="flex flex-col items-center">
            <span className="text-7xl font-mono font-bold tracking-widest text-primary tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <div className="mt-4 flex gap-4">
              <Button size="icon" variant="ghost" onClick={handleReset} className="rounded-full hover:bg-muted">
                <RefreshCcw className="w-6 h-6 text-muted-foreground" />
              </Button>
              <Button size="lg" onClick={handleToggle} className={`rounded-full h-16 w-16 shadow-lg ${isActive ? 'bg-secondary text-primary hover:bg-secondary/80' : 'bg-primary text-white hover:bg-primary/90'}`}>
                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Session Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20 p-4 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-primary">Status</span>
              <span className="text-sm font-semibold">{isActive ? 'Strict Focus' : 'Paused'}</span>
            </div>
          </Card>
          <Card className="bg-accent/10 border-accent/20 p-4 flex items-center gap-3">
            <Coffee className="w-5 h-5 text-accent" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-accent">Next Break</span>
              <span className="text-sm font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Recommended Break
            </DialogTitle>
            <DialogDescription>
              Based on your session intensity, here's how to recharge.
            </DialogDescription>
          </DialogHeader>
          {suggestedBreak && (
            <div className="space-y-6 py-4">
              <div className="bg-muted p-6 rounded-2xl space-y-2 text-center">
                {suggestedBreak.activityType === 'music' && <Volume2 className="w-10 h-10 mx-auto text-accent mb-2" />}
                {suggestedBreak.activityType === 'game' && <Gamepad2 className="w-10 h-10 mx-auto text-primary mb-2" />}
                {suggestedBreak.activityType === 'chatbot' && <MessageCircle className="w-10 h-10 mx-auto text-slate-500 mb-2" />}
                <h3 className="text-xl font-bold">{suggestedBreak.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestedBreak.description}</p>
                <div className="mt-4 p-3 bg-white rounded-lg text-xs italic">
                  "{suggestedBreak.content}"
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  Duration: {suggestedBreak.durationMinutes || 10} min
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="flex sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setShowBreakDialog(false)}>Ignore</Button>
            <Button className="flex-1" onClick={() => window.location.href='/wellness'}>Open Wellness Hub</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
