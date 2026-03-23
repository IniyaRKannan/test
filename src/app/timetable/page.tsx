"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  Clock, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { generateInitialTimetable, type GenerateInitialTimetableOutput } from "@/ai/flows/generate-initial-timetable"
import { useToast } from "@/hooks/use-toast"

export default function TimetablePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [timetable, setTimetable] = useState<GenerateInitialTimetableOutput | null>(null)
  const [step, setStep] = useState<'view' | 'form'>('view')

  // Simple local state for form demo
  const [courses, setCourses] = useState([
    { name: "Calculus I", workload: 5 },
    { name: "Intro to Psychology", workload: 3 }
  ])

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await generateInitialTimetable({
        courses: courses.map(c => ({
          name: c.name,
          workloadHoursPerWeek: c.workload,
          lectureSchedule: [
            { dayOfWeek: "Monday", startTime: "10:00 AM", endTime: "11:00 AM" },
            { dayOfWeek: "Wednesday", startTime: "10:00 AM", endTime: "11:00 AM" }
          ]
        })),
        studyPreferences: {
          focusedStudyPeriodMinutes: 50,
          breakDurationMinutes: 10,
          daysAvailableForStudy: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          earliestStudyTime: "08:00 AM",
          latestStudyTime: "09:00 PM"
        },
        personalCommitments: [
          { description: "Gym", dayOfWeek: "Monday", startTime: "06:00 PM", endTime: "07:30 PM" }
        ],
        additionalNotes: "I prefer working in the mornings."
      })
      setTimetable(result)
      setStep('view')
      toast({ title: "Timetable Generated", description: "AI has optimized your week for productivity." })
    } catch (error) {
      toast({ variant: "destructive", title: "Generation failed", description: "Please try again later." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Your Timetable</h1>
          <p className="text-muted-foreground">AI-optimized schedule for balanced study and wellness.</p>
        </div>
        <div className="flex gap-2">
          {step === 'view' ? (
            <Button onClick={() => setStep('form')} variant="outline" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Re-generate with AI
            </Button>
          ) : (
            <Button onClick={() => setStep('view')} variant="ghost">Cancel</Button>
          )}
        </div>
      </div>

      {step === 'form' ? (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Schedule Configuration</CardTitle>
            <CardDescription>Tell the AI about your workload and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Your Courses</h3>
              {courses.map((course, idx) => (
                <div key={idx} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Course Name</Label>
                    <Input value={course.name} onChange={(e) => {
                      const newCourses = [...courses]
                      newCourses[idx].name = e.target.value
                      setCourses(newCourses)
                    }} />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Hours/Week</Label>
                    <Input type="number" value={course.workload} onChange={(e) => {
                      const newCourses = [...courses]
                      newCourses[idx].workload = parseInt(e.target.value)
                      setCourses(newCourses)
                    }} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setCourses(courses.filter((_, i) => i !== idx))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setCourses([...courses, { name: "", workload: 1 }])} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            </div>

            <Button disabled={loading} onClick={handleGenerate} className="w-full py-6 text-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2 text-accent" />}
              Optimize My Schedule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {(timetable?.weeklyTimetable || defaultTimetable).map((day, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-primary p-3 rounded-lg text-white text-center font-bold sticky top-0 shadow-sm">
                {day.day}
              </div>
              <div className="space-y-2">
                {day.events.map((event, eIdx) => (
                  <Card key={eIdx} className={`p-2 shadow-sm border-none ${
                    event.type === 'break' ? 'bg-accent/10 border-l-4 border-l-accent' : 
                    event.type === 'study' ? 'bg-primary/5 border-l-4 border-l-primary' : 
                    'bg-white'
                  }`}>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {event.time}
                    </div>
                    <div className="text-sm font-semibold mt-1 leading-tight line-clamp-2">
                      {event.description}
                    </div>
                    {event.courseName && (
                      <div className="text-[10px] mt-1 italic text-muted-foreground truncate">
                        {event.courseName}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const defaultTimetable = [
  { day: "Monday", events: [
    { time: "09:00 AM - 10:00 AM", description: "Focused Study", type: "study", courseName: "Calculus I" },
    { time: "10:00 AM - 10:15 AM", description: "Mental Break", type: "break" },
    { time: "10:15 AM - 12:00 PM", description: "Physics Lab", type: "academic" }
  ]},
  { day: "Tuesday", events: [
    { time: "08:30 AM - 10:00 AM", description: "Lecture: Psychology", type: "academic" },
    { time: "11:00 AM - 12:00 PM", description: "Exam Prep", type: "study", courseName: "Psychology" }
  ]},
  { day: "Wednesday", events: [
    { time: "09:00 AM - 10:00 AM", description: "Focused Study", type: "study", courseName: "Calculus I" },
    { time: "10:00 AM - 10:15 AM", description: "Mental Break", type: "break" }
  ]},
  { day: "Thursday", events: [
    { time: "10:00 AM - 12:00 PM", description: "Group Project", type: "study" }
  ]},
  { day: "Friday", events: [
    { time: "11:00 AM - 12:00 PM", description: "Lecture: Math", type: "academic" }
  ]},
  { day: "Saturday", events: [
    { time: "10:00 AM - 12:00 PM", description: "Weekly Review", type: "study" }
  ]},
  { day: "Sunday", events: [
    { time: "02:00 PM - 03:00 PM", description: "Prep for Week", type: "study" }
  ]}
] as any[]
