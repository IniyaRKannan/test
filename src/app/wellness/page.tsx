"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  Music, 
  Gamepad2, 
  Send, 
  Sparkles,
  Loader2,
  Heart,
  Volume2,
  Play
} from "lucide-react"
import { mentalWellnessChat } from "@/ai/flows/mental-wellness-chatbot-interaction"

type Message = {
  role: 'user' | 'ai'
  content: string
}

export default function WellnessHub() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi there! I'm Aura, your AI companion. How are you feeling during your study break today?" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function handleSend() {
    if (!input.trim()) return
    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput("")
    setIsTyping(true)

    try {
      const response = await mentalWellnessChat({ message: userMsg })
      setMessages(prev => [...prev, { role: 'ai', content: response.response }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having a little trouble connecting right now, but I'm still here for you. Just take a deep breath." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            Wellness Hub
          </h1>
          <p className="text-muted-foreground">Your space to recharge, relax, and talk it out.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col shadow-lg border-none">
            <CardHeader className="border-b bg-primary/5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-accent">
                  <AvatarImage src="https://picsum.photos/seed/aura/100/100" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Chat with Aura</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online Companion
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-slate-100 text-foreground rounded-tl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-white">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                  <Input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 rounded-full bg-slate-50 border-none shadow-inner px-6 focus-visible:ring-primary"
                  />
                  <Button type="submit" size="icon" className="rounded-full shadow-lg h-12 w-12 bg-primary">
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md border-none overflow-hidden group">
            <div className="h-32 bg-accent/20 flex items-center justify-center transition-colors group-hover:bg-accent/30">
              <Music className="w-12 h-12 text-accent" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Focus Playlists</CardTitle>
              <CardDescription>Curated Lofi and Ambient tracks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Study Lofi Beats",
                "Forest Ambience",
                "Piano Relaxation"
              ].map((track, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                      <Volume2 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{track}</span>
                  </div>
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">Browse All Music</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md border-none overflow-hidden group">
            <div className="h-32 bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
              <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Quick Games</CardTitle>
              <CardDescription>Mini-tasks to reset your mind.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground italic">"Memory matching helps reduce cognitive load after long study sessions."</p>
              <Button className="w-full bg-primary hover:bg-primary/90">Play Memory Reset</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
