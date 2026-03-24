"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  MessageCircle, 
  Music, 
  Gamepad2, 
  Send, 
  Heart, 
  Volume2, 
  Play,
  Pause,
  SkipBack,
  SkipForward,
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
  Wind,
  Search,
  ListMusic,
  ExternalLink,
  Timer,
  Video,
  Grid3X3
} from "lucide-react"
import { mentalWellnessChat } from "@/ai/flows/mental-wellness-chatbot-interaction"

type Message = {
  role: 'user' | 'ai'
  content: string
}

type Track = {
  id: string
  title: string
  artist: string
  duration: string
  genre: string
  coverUrl: string
}

const TRACKS: Track[] = [
  { id: '1', title: "Midnight Study", artist: "Lofi Girl", duration: "3:45", genre: "Lofi", coverUrl: "https://picsum.photos/seed/music1/200/200" },
  { id: '2', title: "Rainy Library", artist: "Nature Sounds", duration: "10:00", genre: "Ambient", coverUrl: "https://picsum.photos/seed/music2/200/200" },
  { id: '3', title: "Deep Focus Piano", artist: "Classical Mind", duration: "5:20", genre: "Classical", coverUrl: "https://picsum.photos/seed/music3/200/200" },
  { id: '4', title: "Synthwave Productivity", artist: "Retro Runner", duration: "4:15", genre: "Electronic", coverUrl: "https://picsum.photos/seed/music4/200/200" },
  { id: '5', title: "Forest Morning", artist: "Green Noise", duration: "15:00", genre: "Nature", coverUrl: "https://picsum.photos/seed/music5/200/200" },
]

const ICONS = [Zap, Heart, Sparkles, Music, Gamepad2, Coffee, ShieldCheck, Clock];

interface MemoryCard {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Exercise {
  id: string;
  title: string;
  duration: string;
  desc: string;
  imageId: string;
  videoUrl: string;
}

const PHYSICAL_STRETCHES: Exercise[] = [
  { id: "1", title: "Neck Rolls", duration: "30 Sec", desc: "Slowly rotate your head to release cervical tension.", imageId: "neck-rolls", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-mat-42353-large.mp4" },
  { id: "2", title: "Shoulder Shrugs", duration: "30 Sec", desc: "Lift shoulders to ears and drop them suddenly.", imageId: "shoulder-shrugs", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-mat-42353-large.mp4" },
  { id: "3", title: "Standing Reach", duration: "30 Sec", desc: "Stand up and reach for the ceiling as high as possible.", imageId: "standing-reach", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-mat-42353-large.mp4" },
  { id: "4", title: "Wrist Flexing", duration: "30 Sec", desc: "Prevent carpal tunnel by stretching wrists forward and back.", imageId: "wrist-flexing", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretches-on-a-mat-42353-large.mp4" }
];

const EYE_CARE_ROUTINES: Exercise[] = [
  { id: "5", title: "20-20-20 Rule", duration: "30 Sec", desc: "Look at something 20 feet away for at least 20 seconds.", imageId: "eyes-20", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-bench-and-looking-at-her-phone-41584-large.mp4" },
  { id: "6", title: "Palming", duration: "30 Sec", desc: "Rub hands together and place warm palms over closed eyes.", imageId: "palming", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-bench-and-looking-at-her-phone-41584-large.mp4" },
  { id: "7", title: "Figure Eight", duration: "30 Sec", desc: "Trace an imaginary figure eight on the floor with your eyes.", imageId: "figure-eight", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-bench-and-looking-at-her-phone-41584-large.mp4" },
  { id: "8", title: "Distance Blinking", duration: "30 Sec", desc: "Blink rapidly then look at a far object to lubricate eyes.", imageId: "blinking", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-bench-and-looking-at-her-phone-41584-large.mp4" }
];

export default function WellnessHub() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi there! I'm Aura, your AI companion. How are you feeling during your study break today?" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Audio State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)

  // Spotify State
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false)
  const [spotifyPlaylistId] = useState("37i9dQZF1DX8Ueb9C7V6rN")

  // Memory Game State
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Sudoku State
  const [isSudokuOpen, setIsSudokuOpen] = useState(false);
  const [sudokuBoard, setSudokuBoard] = useState<(number | null)[][]>([]);
  const [initialSudoku, setInitialSudoku] = useState<boolean[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [sudokuWon, setSudokuWon] = useState(false);

  // Exercise Timer State
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => (prev >= 100 ? 0 : prev + 0.5))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    if (isTimerRunning && exerciseTimeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setExerciseTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (exerciseTimeLeft === 0) {
      setIsTimerRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [isTimerRunning, exerciseTimeLeft]);

  const startExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setExerciseTimeLeft(30);
    setIsTimerRunning(true);
  };

  const closeExercise = () => {
    setActiveExercise(null);
    setIsTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const initMemoryGame = useCallback(() => {
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

  const handleMemoryCardClick = (index: number) => {
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

  const initSudoku = useCallback(() => {
    const puzzle = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ];
    setSudokuBoard(puzzle);
    setInitialSudoku(puzzle.map(row => row.map(cell => cell !== null)));
    setSelectedCell(null);
    setSudokuWon(false);
  }, []);

  const handleSudokuCellClick = (row: number, col: number) => {
    if (!initialSudoku[row][col]) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }
  };

  const handleSudokuInput = (num: number) => {
    if (!selectedCell) return;
    const newBoard = [...sudokuBoard.map(row => [...row])];
    newBoard[selectedCell.row][selectedCell.col] = num;
    setSudokuBoard(newBoard);
    
    // Check if won (simplified)
    const isFull = newBoard.every(row => row.every(cell => cell !== null));
    if (isFull) setSudokuWon(true);
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

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setPlaybackProgress(0)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
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
                          m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white text-foreground rounded-tl-none border'
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
                    <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share your thoughts..." className="flex-1 rounded-full bg-slate-50 border-none shadow-inner px-6 h-12 focus-visible:ring-primary" />
                    <Button type="submit" size="icon" className="rounded-full shadow-lg h-12 w-12 bg-primary">
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Wind className="w-5 h-5 text-accent" /> Breathing</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Try the 4-7-8 technique to reduce stress immediately.</p>
                  <Button variant="outline" className="w-full mt-4 border-accent/30 text-accent hover:bg-accent/10">Start Timer</Button>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader><CardTitle className="text-lg">Daily Affirmation</CardTitle></CardHeader>
                <CardContent><p className="text-sm italic text-primary font-medium">"My focus is a muscle, and today I am giving it the rest it needs to grow stronger."</p></CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2"><Dumbbell className="w-6 h-6 text-primary" /> Physical Stretches</CardTitle>
                <CardDescription>Combat sedentary fatigue with quick movements.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {PHYSICAL_STRETCHES.map((ex) => (
                  <div key={ex.id} className="flex flex-col gap-4 p-4 rounded-xl hover:bg-slate-50 border transition-all">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary"><Activity className="w-5 h-5" /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-sm">{ex.title}</h4><Badge variant="secondary" className="text-[10px]">{ex.duration}</Badge></div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{ex.desc}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="default" className="w-full h-9 rounded-lg" onClick={() => startExercise(ex)}><Video className="w-4 h-4 mr-2" /> Watch & Start 30s</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-accent/5 border-b">
                <CardTitle className="flex items-center gap-2"><Eye className="w-6 h-6 text-accent" /> Eye Care Routines</CardTitle>
                <CardDescription>Prevent digital eye strain during study.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {EYE_CARE_ROUTINES.map((ex) => (
                  <div key={ex.id} className="flex flex-col gap-4 p-4 rounded-xl hover:bg-slate-50 border transition-all">
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/10 p-2 rounded-lg text-accent"><Eye className="w-5 h-5" /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-sm">{ex.title}</h4><Badge variant="secondary" className="text-[10px]">{ex.duration}</Badge></div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{ex.desc}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" className="w-full h-9 rounded-lg border border-accent/20" onClick={() => startExercise(ex)}><Video className="w-4 h-4 mr-2" /> Watch & Start 30s</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leisure" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-xl border-none overflow-hidden">
                <CardHeader className="border-b bg-card">
                  <div className="flex items-center gap-2"><ListMusic className="w-5 h-5 text-primary" /><CardTitle className="text-xl">Music Library</CardTitle></div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4 space-y-1">
                      {TRACKS.map((track) => (
                        <div key={track.id} onClick={() => handlePlayTrack(track)} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-primary/5 group ${currentTrack?.id === track.id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}>
                          <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10 rounded-lg shadow-sm"><AvatarImage src={track.coverUrl} /><AvatarFallback><Music className="w-4 h-4" /></AvatarFallback></Avatar>
                            <div><p className="text-sm font-bold leading-none">{track.title}</p><p className="text-xs text-muted-foreground mt-1">{track.artist} • {track.genre}</p></div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-xs font-medium text-muted-foreground tabular-nums">{track.duration}</span>
                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-primary/10 text-primary"><Play className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-none overflow-hidden bg-zinc-950 text-white">
                <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between bg-zinc-900/50">
                  <div className="flex items-center gap-3"><div className="bg-[#1DB954] p-1.5 rounded-full"><Music className="w-5 h-5 text-black" /></div><CardTitle className="text-lg">Spotify for Study</CardTitle></div>
                  {!isSpotifyConnected ? <Button onClick={() => setIsSpotifyConnected(true)} className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full px-6">Connect Spotify</Button> : <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/50">Connected</Badge>}
                </CardHeader>
                <CardContent className="p-6">
                  {isSpotifyConnected && <div className="rounded-xl overflow-hidden bg-black aspect-video relative"><iframe src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator&theme=0`} width="100%" height="100%" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="absolute inset-0 border-none"></iframe></div>}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="shadow-lg border-none overflow-hidden bg-primary text-white">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Gamepad2 className="w-5 h-5" /> Mind Reset Games</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/80">Take a quick mental break with our selection of stress-relieving games.</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="secondary" className="w-full shadow-lg h-12 font-bold" onClick={() => { initMemoryGame(); setIsGameOpen(true); }}><Zap className="w-4 h-4 mr-2" /> Play Memory Reset</Button>
                    <Button variant="secondary" className="w-full shadow-lg h-12 font-bold bg-accent text-white hover:bg-accent/90" onClick={() => { initSudoku(); setIsSudokuOpen(true); }}><Grid3X3 className="w-4 h-4 mr-2" /> Play Sudoku</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Exercise Timer Dialog */}
      <Dialog open={!!activeExercise} onOpenChange={(open) => !open && closeExercise()}>
        <DialogContent className="sm:max-w-md rounded-3xl overflow-hidden border-none shadow-2xl p-0">
          {activeExercise && (
            <div className="flex flex-col">
              <div className="relative h-64 w-full bg-slate-900">
                <video src={activeExercise.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                   <h2 className="text-2xl font-bold text-white">{activeExercise.title}</h2>
                   <p className="text-white/80 text-sm mt-1">{activeExercise.desc}</p>
                </div>
              </div>
              <div className="p-8 space-y-8 flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90"><circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" /><circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (30 - exerciseTimeLeft)) / 30} className="text-primary transition-all duration-1000" strokeLinecap="round" /></svg>
                   <span className="absolute text-5xl font-mono font-bold text-primary">{exerciseTimeLeft}s</span>
                </div>
                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => { setExerciseTimeLeft(30); setIsTimerRunning(true); }}><RefreshCcw className="w-4 h-4 mr-2" /> Reset</Button>
                  <Button className="flex-1 rounded-xl h-12" onClick={() => setIsTimerRunning(!isTimerRunning)}>{isTimerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}{isTimerRunning ? 'Pause' : 'Resume'}</Button>
                </div>
                {exerciseTimeLeft === 0 && <div className="text-center space-y-2 animate-in fade-in zoom-in duration-300"><Trophy className="w-10 h-10 text-green-500 mx-auto" /><p className="font-bold text-green-600">Great job! Exercise complete.</p></div>}
              </div>
              <DialogFooter className="p-4 bg-slate-50 border-t flex sm:justify-center"><Button variant="ghost" className="w-full rounded-xl" onClick={closeExercise}>Close Session</Button></DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Memory Match Dialog */}
      <Dialog open={isGameOpen} onOpenChange={setIsGameOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary"><Gamepad2 className="w-6 h-6" /> Memory Reset</DialogTitle><DialogDescription className="text-base">Match the pairs to clear your mind. {moves} moves so far.</DialogDescription></DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-6">
            {cards.map((card, idx) => {
              const Icon = ICONS[card.iconIndex];
              return (<div key={card.id} onClick={() => handleMemoryCardClick(idx)} className={`aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform flex items-center justify-center shadow-sm ${card.isFlipped || card.isMatched ? 'bg-primary text-white scale-100 rotate-0' : 'bg-slate-100 text-transparent -rotate-180 hover:bg-slate-200'}`}>{(card.isFlipped || card.isMatched) && <Icon className="w-8 h-8" />}</div>)
            })}
          </div>
          {isWon && <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-300"><Trophy className="w-12 h-12 text-green-500 mx-auto" /><h3 className="text-2xl font-bold text-green-700">Mind Cleared!</h3><p className="text-sm text-green-600 font-medium">Excellent work!</p><Button onClick={initMemoryGame} variant="outline" className="w-full bg-white border-green-200 text-green-700 hover:bg-green-100 h-12"><RefreshCcw className="w-4 h-4 mr-2" /> Play Again</Button></div>}
        </DialogContent>
      </Dialog>

      {/* Sudoku Dialog */}
      <Dialog open={isSudokuOpen} onOpenChange={setIsSudokuOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary"><Grid3X3 className="w-6 h-6" /> Sudoku Break</DialogTitle><DialogDescription>A classic puzzle to sharpen your focus.</DialogDescription></DialogHeader>
          <div className="grid grid-cols-9 gap-1 py-4 bg-slate-200 p-2 rounded-xl">
            {sudokuBoard.map((row, rIdx) => row.map((cell, cIdx) => (
              <div 
                key={`${rIdx}-${cIdx}`} 
                onClick={() => handleSudokuCellClick(rIdx, cIdx)}
                className={`aspect-square flex items-center justify-center text-sm font-bold cursor-pointer rounded-sm transition-colors ${
                  selectedCell?.row === rIdx && selectedCell?.col === cIdx ? 'bg-primary text-white' : 
                  initialSudoku[rIdx][cIdx] ? 'bg-slate-50 text-slate-800' : 'bg-white text-primary'
                } ${ (cIdx + 1) % 3 === 0 && cIdx < 8 ? 'mr-1' : '' } ${ (rIdx + 1) % 3 === 0 && rIdx < 8 ? 'mb-1' : '' }`}
              >
                {cell}
              </div>
            )))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <Button key={num} variant="outline" className="h-10 font-bold" onClick={() => handleSudokuInput(num)} disabled={!selectedCell}>{num}</Button>
            ))}
            <Button variant="ghost" onClick={() => selectedCell && handleSudokuInput(0)} className="col-span-1 h-10"><RefreshCcw className="w-4 h-4" /></Button>
          </div>
          {sudokuWon && <div className="mt-4 bg-green-50 p-4 rounded-xl text-center"><Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" /><p className="font-bold text-green-700">Puzzle Solved!</p></div>}
          <DialogFooter><Button variant="outline" onClick={initSudoku} className="w-full mt-4"><RefreshCcw className="w-4 h-4 mr-2" /> New Game</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
