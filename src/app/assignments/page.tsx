"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  Calendar, 
  Flag, 
  Search, 
  SortAsc,
  Filter,
  CheckCircle2,
  Clock
} from "lucide-react"

type Assignment = {
  id: string
  title: string
  course: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', title: "Calculus Problem Set #4", course: "Calculus I", dueDate: "2023-10-26", priority: 'high', completed: false },
    { id: '2', title: "Physics Lab Report", course: "Physics 101", dueDate: "2023-10-28", priority: 'medium', completed: false },
    { id: '3', title: "Weekly Psychology Quiz", course: "Intro to Psych", dueDate: "2023-11-01", priority: 'low', completed: true },
    { id: '4', title: "Midterm Essay Draft", course: "English Comp", dueDate: "2023-10-27", priority: 'high', completed: false },
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const sortedAssignments = [...assignments].sort((a, b) => {
    // Priority weight
    const pMap = { high: 0, medium: 1, low: 2 }
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (pMap[a.priority] !== pMap[b.priority]) return pMap[a.priority] - pMap[b.priority]
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  const filteredAssignments = sortedAssignments.filter(a => {
    if (filter === 'pending') return !a.completed
    if (filter === 'completed') return a.completed
    return true
  })

  const toggleComplete = (id: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, completed: !a.completed } : a))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Assignments</h1>
          <p className="text-muted-foreground">Stay ahead of deadlines with intelligent priority sorting.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Assignment
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-card p-2 rounded-xl border border-border shadow-sm">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9 bg-transparent border-none focus-visible:ring-0" />
        </div>
        <div className="h-6 w-px bg-border hidden md:block" />
        <div className="flex items-center gap-1">
          <Button 
            variant={filter === 'all' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'completed' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((task) => (
          <Card key={task.id} className={`group transition-all hover:shadow-md border-l-4 ${
            task.completed ? 'opacity-60 border-l-slate-200' :
            task.priority === 'high' ? 'border-l-destructive shadow-sm' :
            task.priority === 'medium' ? 'border-l-accent' : 'border-l-slate-200'
          }`}>
            <CardContent className="p-4 flex items-center gap-4">
              <Checkbox 
                checked={task.completed} 
                onCheckedChange={() => toggleComplete(task.id)} 
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  {!task.completed && task.priority === 'high' && (
                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider">
                      Priority
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {task.course}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${
                    !task.completed && new Date(task.dueDate) < new Date() ? 'text-destructive font-bold' : 'text-muted-foreground'
                  }`}>
                    <Calendar className="w-3 h-3" /> Due {task.dueDate}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No assignments found. You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
