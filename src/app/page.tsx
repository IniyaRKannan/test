
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ArrowRight,
  Instagram,
  Twitter,
  Heart,
  CheckCircle2,
  TrendingUp
} from "lucide-react"
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    { label: "Focus Minutes", value: "120", icon: Zap, color: "text-primary" },
    { label: "Tasks Done", value: "12/15", icon: CheckCircle2, color: "text-green-500" },
    { label: "Wellness Level", value: "High", icon: Heart, color: "text-accent" },
    { label: "Study Streak", value: "5 Days", icon: TrendingUp, color: "text-orange-500" },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome back, Jane</h1>
        <p className="text-muted-foreground">Wednesday, October 25th — You're doing great today.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Today's Schedule</CardTitle>
              <CardDescription>3 events remaining</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/timetable" className="text-primary hover:text-primary/80">
                View Calendar <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { time: "09:00 AM", title: "Calculus I Lecture", type: "Academic", sub: "Room 402" },
              { time: "11:30 AM", title: "Physics Study Group", type: "Study", sub: "Main Library" },
              { time: "02:00 PM", title: "Data Structures", type: "Academic", sub: "Online" }
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-16 text-xs font-semibold text-muted-foreground">{event.time}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.sub}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                  {event.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Priority tasks */}
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { title: "Calculus HW #4", due: "Tonight" },
                { title: "Physics Lab Report", due: "Tomorrow" }
              ].map((task, i) => (
                <div key={i} className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium">{task.title}</span>
                  <Badge variant="outline" className="border-white/20 text-white text-[10px]">{task.due}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full bg-white text-primary hover:bg-white/90 border-none font-bold shadow-sm" asChild>
              <Link href="/assignments">Open Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-none shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">Ready for deep work? Start a 25m session.</p>
            <Button size="sm" className="w-full" asChild>
              <Link href="/focus">Start Session</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" /> Wellness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">Feeling stressed? Take a guided break.</p>
            <Button size="sm" variant="secondary" className="w-full" asChild>
              <Link href="/wellness">Recharge</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" /> Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex justify-between text-[10px] mb-1 font-bold uppercase text-muted-foreground">
               <span>Social Usage</span>
               <span>75%</span>
             </div>
             <Progress value={75} className="h-1.5" />
             <Button size="sm" variant="ghost" className="w-full text-xs" asChild>
               <Link href="/blocking">Settings</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
