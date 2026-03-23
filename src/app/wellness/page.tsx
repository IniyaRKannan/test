
"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Music, 
  Gamepad2, 
  Send, 
  Heart, 
  Volume2, 
  Play,
  Zap,
  Sparkles,
  Coffee,
  ShieldCheck,
  Clock,
  RefreshCcw,
  Trophy,
  Dumbbell,
  Eye,
  Activity,
  Wind
} from "lucide-react"
import { mentalWellnessChat } from "@/ai/flows/mental-wellness-chatbot-interaction"

type Message = {
  role: 'user' | 'ai'
  content: string
}

// Memory Game Logic & Components
const ICONS = [Zap, Heart, Sparkles, Music, Gamepad2, Coffee, ShieldCheck, Clock];

interface MemoryCard {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function WellnessHub() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi there! I'm Aura, your AI companion. How are you feeling during your study break today?" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Game State
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const initGame = useCallback(() => {
    const cardPairs = [...ICONS.keys(), ...ICONS.keys()];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((iconIndex, id) => ({
        id,
        iconIndex,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].iconIndex === cards[second].iconIndex) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          if (matchedCards.every(c => c.isMatched)) setIsWon(true);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

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
      setMessages(prev => [...prev, { role: 'ai', content: "I'm here to listen. Take a deep breath." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <Heart className="w-10 h-10 text-accent fill-accent" />
          Wellness Hub
        </h1>
        <p className="text-muted-foreground text-lg">Recharge your mind and body with AI-guided wellness routines.</p>
      </header>

      <Tabs defaultValue="companion" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-card shadow-sm border rounded-xl p-1">
          <TabsTrigger value="companion" className="rounded-lg gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
            <MessageCircle className="w-5 h-5" /> Mental Companion
          </TabsTrigger>
          <TabsTrigger value="exercises" className="rounded-lg gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
            <Activity className="w-5 h-5" /> Body & Eyes
          </TabsTrigger>
          <TabsTrigger value="leisure" className="rounded-lg gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
            <Gamepad2 className="w-5 h-5" /> Leisure & Audio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companion" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 h-[600px] flex flex-col shadow-xl border-none overflow-hidden">
              <CardHeader className="border-b bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-accent">
                    <AvatarImage src="https://picsum.photos/seed/aura-v2/100/100" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">Aura AI</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Your Empathetic Listener
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-slate-50/50">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                          m.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-white text-foreground rounded-tl-none border'
                        }`}>
                          <p className="text-sm leading-relaxed">{m.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border p-4 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-white shadow-lg">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Share your thoughts..." 
                      className="flex-1 rounded-full bg-slate-50 border-none shadow-inner px-6 h-12 focus-visible:ring-primary"
                    />
                    <Button type="submit" size="icon" className="rounded-full shadow-lg h-12 w-12 bg-primary">
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wind className="w-5 h-5 text-accent" /> Breathing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Try the 4-7-8 technique to reduce stress immediately.</p>
                  <Button variant="outline" className="w-full border-accent/30 text-accent hover:bg-accent/10">Start Timer</Button>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Affirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic text-primary font-medium">"My focus is a muscle, and today I am giving it the rest it needs to grow stronger."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-primary" /> Physical Stretches
                </CardTitle>
                <CardDescription>Combat sedentary fatigue with quick movements.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { title: "Neck Rolls", duration: "1 Min", desc: "Slowly rotate your head to release cervical tension." },
                  { title: "Shoulder Shrugs", duration: "30 Sec", desc: "Lift shoulders to ears and drop them suddenly." },
                  { title: "Standing Reach", duration: "2 Min", desc: "Stand up and reach for the ceiling as high as possible." },
                  { title: "Wrist Flexing", duration: "1 Min", desc: "Prevent carpal tunnel by stretching wrists forward and back." }
                ].map((ex, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border transition-all">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm">{ex.title}</h4>
                        <Badge variant="secondary" className="text-[10px]">{ex.duration}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ex.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader className="bg-accent/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-6 h-6 text-accent" /> Eye Care Routines
                </CardTitle>
                <CardDescription>Prevent digital eye strain (DES) during long study sessions.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { title: "20-20-20 Rule", duration: "20 Sec", desc: "Look at something 20 feet away for 20 seconds." },
                  { title: "Palming", duration: "2 Min", desc: "Rub hands together and place warm palms over closed eyes." },
                  { title: "Figure Eight", duration: "1 Min", desc: "Trace an imaginary figure eight on the floor with your eyes." },
                  { title: "Distance Blinking", duration: "1 Min", desc: "Blink rapidly then look at a far object to lubricate eyes." }
                ].map((ex, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border transition-all">
                    <div className="bg-accent/10 p-2 rounded-lg text-accent">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm">{ex.title}</h4>
                        <Badge variant="secondary" className="text-[10px]">{ex.duration}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ex.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leisure" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-md border-none overflow-hidden group">
              <div className="h-40 bg-accent/20 flex items-center justify-center transition-colors group-hover:bg-accent/30">
                <Music className="w-16 h-16 text-accent" />
              </div>
              <CardHeader>
                <CardTitle>Focus Playlists</CardTitle>
                <CardDescription>Ambient sounds for deep work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Study Lofi Beats", "Forest Ambience", "Piano Relaxation"].map((track, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-sm font-semibold">{track}</span>
                    </div>
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-md border-none overflow-hidden group">
              <div className="h-40 bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                <Gamepad2 className="w-16 h-16 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Brain Games</CardTitle>
                <CardDescription>Mini-tasks to reset cognitive load.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground leading-relaxed">Memory matching helps switch your brain from "study mode" to "play mode" for a faster reset.</p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg py-6"
                  onClick={() => { initGame(); setIsGameOpen(true); }}
                >
                  Play Memory Reset
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none bg-slate-900 text-white p-6 flex flex-col justify-center items-center text-center space-y-4">
              <Sparkles className="w-12 h-12 text-accent" />
              <h3 className="text-xl font-bold">More Coming Soon</h3>
              <p className="text-xs text-slate-400">We're building more AI-powered wellness tools including posture analysis and personalized meditation.</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Memory Match Dialog */}
      <Dialog open={isGameOpen} onOpenChange={setIsGameOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Gamepad2 className="w-6 h-6" /> Memory Reset
            </DialogTitle>
            <DialogDescription className="text-base">
              Match the pairs to clear your mind. {moves} moves so far.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-4 py-6">
            {cards.map((card, idx) => {
              const Icon = ICONS[card.iconIndex];
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`
                    aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform
                    flex items-center justify-center shadow-sm
                    ${card.isFlipped || card.isMatched 
                      ? 'bg-primary text-white scale-100 rotate-0' 
                      : 'bg-slate-100 text-transparent -rotate-180 hover:bg-slate-200'}
                  `}
                >
                  {(card.isFlipped || card.isMatched) && <Icon className="w-8 h-8" />}
                </div>
              )
            })}
          </div>

          {isWon && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <Trophy className="w-12 h-12 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold text-green-700">Mind Cleared!</h3>
              <p className="text-sm text-green-600 font-medium">Excellent work! You finished in {moves} moves. You're ready to re-focus.</p>
              <Button onClick={initGame} variant="outline" className="w-full bg-white border-green-200 text-green-700 hover:bg-green-100 h-12">
                <RefreshCcw className="w-4 h-4 mr-2" /> Play Again
              </Button>
            </div>
          )}

          {!isWon && (
            <div className="flex justify-between items-center pt-4">
               <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                 <Clock className="w-4 h-4" /> Focus on the icons...
               </span>
               <Button variant="ghost" size="sm" onClick={initGame} className="text-muted-foreground hover:text-primary">
                 <RefreshCcw className="w-4 h-4 mr-2" /> Reset Game
               </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
