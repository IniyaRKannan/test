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
  Youtube,
  Heart
} from "lucide-react"
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Good Morning, Jane</h1>
        <p className="text-muted-foreground text-lg">You have 3 assignments due this week and 2 classes today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Schedule Card */}
        <Card className="col-span-1 md:col-span-2 shadow-sm border-none bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Overview</CardTitle>
              <CardDescription>Wednesday, Oct 25</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/timetable" className="flex items-center gap-1">
                Full View <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "09:00 AM", title: "Calculus I Lecture", type: "academic", location: "Room 402" },
              { time: "11:30 AM", title: "Physics Study Group", type: "study", location: "Library" },
              { time: "02:00 PM", title: "Data Structures", type: "academic", location: "Online" }
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="w-20 text-sm font-medium text-muted-foreground">{event.time}</div>
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-foreground">{event.title}</span>
                  <span className="text-xs text-muted-foreground">{event.location}</span>
                </div>
                <Badge variant={event.type === 'academic' ? 'default' : 'secondary'}>
                  {event.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Priority Assignments */}
        <Card className="shadow-sm border-none bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              High Priority
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">Deadlines approaching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Calculus Homework", due: "Today, 11:59 PM", color: "text-accent" },
              { title: "Physics Lab Report", due: "Tomorrow", color: "text-white" }
            ].map((task, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl space-y-2">
                <div className="font-bold">{task.title}</div>
                <div className={`text-xs ${task.color} font-medium`}>Due {task.due}</div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white" asChild>
              <Link href="/assignments">Manage Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Social Media Usage */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Social Media Limit</CardTitle>
            <CardDescription>Daily usage monitor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> Instagram</span>
                <span className="font-medium text-muted-foreground">35m / 45m</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2"><Twitter className="w-4 h-4 text-blue-400" /> X (Twitter)</span>
                <span className="font-medium text-muted-foreground">12m / 30m</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Wellness Quick Access */}
        <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Feeling Stressed?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Take a quick 5-minute breather with our AI wellness guide.</p>
            <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold" asChild>
              <Link href="/wellness">Quick Break</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Focus Mode Quick Start */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Focus Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Block distractions and get things done. Suggested session: 50m.</p>
            <Button variant="default" className="w-full" asChild>
              <Link href="/focus">Start Session</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
