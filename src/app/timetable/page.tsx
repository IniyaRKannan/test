
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  Clock, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  Settings2,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { generateInitialTimetable, type GenerateInitialTimetableOutput } from "@/ai/flows/generate-initial-timetable"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from '@/components/ui/scroll-area'

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function TimetablePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [timetable, setTimetable] = useState<GenerateInitialTimetableOutput | null>(null)
  const [step, setStep] = useState<'view' | 'form'>('view')
  const [formTab, setFormTab] = useState('courses')

  // Comprehensive form state
  const [courses, setCourses] = useState<any[]>([
    { name: "Calculus I", workload: 5, lectures: [{ day: "Monday", start: "09:00 AM", end: "10:00 AM" }] }
  ])
  const [commitments, setCommitments] = useState<any[]>([
    { description: "Gym", day: "Tuesday", start: "05:00 PM", end: "06:30 PM" }
  ])
  const [preferences, setPreferences] = useState({
    focusTime: 50,
    breakTime: 10,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "08:00 AM",
    endTime: "09:00 PM",
    notes: ""
  })

  const addCourse = () => setCourses([...courses, { name: "", workload: 3, lectures: [] }])
  const removeCourse = (idx: number) => setCourses(courses.filter((_, i) => i !== idx))
  
  const addLecture = (cIdx: number) => {
    const newCourses = [...courses]
    newCourses[cIdx].lectures.push({ day: "Monday", start: "09:00 AM", end: "10:00 AM" })
    setCourses(newCourses)
  }
  const removeLecture = (cIdx: number, lIdx: number) => {
    const newCourses = [...courses]
    newCourses[cIdx].lectures = newCourses[cIdx].lectures.filter((_: any, i: number) => i !== lIdx)
    setCourses(newCourses)
  }

  const addCommitment = () => setCommitments([...commitments, { description: "", day: "Monday", start: "09:00 AM", end: "10:00 AM" }])
  const removeCommitment = (idx: number) => setCommitments(commitments.filter((_, i) => i !== idx))

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await generateInitialTimetable({
        courses: courses.map(c => ({
          name: c.name,
          workloadHoursPerWeek: c.workload,
          lectureSchedule: c.lectures.map((l: any) => ({
            dayOfWeek: l.day,
            startTime: l.start,
            endTime: l.end
          }))
        })),
        studyPreferences: {
          focusedStudyPeriodMinutes: preferences.focusTime,
          breakDurationMinutes: preferences.breakTime,
          daysAvailableForStudy: preferences.availableDays,
          earliestStudyTime: preferences.startTime,
          latestStudyTime: preferences.endTime
        },
        personalCommitments: commitments.map(c => ({
          description: c.description,
          dayOfWeek: c.day,
          startTime: c.start,
          endTime: c.end
        })),
        additionalNotes: preferences.notes
      })
      setTimetable(result)
      setStep('view')
      toast({ title: "Timetable Optimized!", description: "Your AI-powered schedule is ready." })
    } catch (error) {
      toast({ variant: "destructive", title: "Generation failed", description: "Please check your inputs and try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Schedule Designer</h1>
          <p className="text-muted-foreground text-lg">Personalize your academic journey with AI optimization.</p>
        </div>
        <div className="flex gap-3">
          {step === 'view' ? (
            <Button onClick={() => setStep('form')} className="bg-primary hover:bg-primary/90 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-accent" />
              Design New Schedule
            </Button>
          ) : (
            <Button onClick={() => setStep('view')} variant="ghost" className="text-muted-foreground">
              Back to View
            </Button>
          )}
        </div>
      </div>

      {step === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Input Details
              </CardTitle>
              <CardDescription>Tell us about your courses, fixed events, and study style.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b h-12 px-6">
                  <TabsTrigger value="courses" className="data-[state=active]:bg-primary/5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4">
                    <BookOpen className="w-4 h-4 mr-2" /> Courses
                  </TabsTrigger>
                  <TabsTrigger value="commitments" className="data-[state=active]:bg-primary/5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4">
                    <User className="w-4 h-4 mr-2" /> Commitments
                  </TabsTrigger>
                  <TabsTrigger value="habits" className="data-[state=active]:bg-primary/5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4">
                    <Sparkles className="w-4 h-4 mr-2" /> Habits & Goals
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="courses" className="mt-0 space-y-6">
                    {courses.map((course, cIdx) => (
                      <Card key={cIdx} className="border-2 border-slate-100 bg-white shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 flex items-center justify-between border-b">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <Badge className="bg-primary">{cIdx + 1}</Badge>
                            {course.name || "Untitled Course"}
                          </h4>
                          <Button variant="ghost" size="icon" onClick={() => removeCourse(cIdx)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Course Title</Label>
                              <Input 
                                placeholder="e.g. Intro to Philosophy" 
                                value={course.name} 
                                onChange={(e) => {
                                  const n = [...courses]; n[cIdx].name = e.target.value; setCourses(n)
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Study Workload (Hrs/Week)</Label>
                              <Input 
                                type="number" 
                                value={course.workload} 
                                onChange={(e) => {
                                  const n = [...courses]; n[cIdx].workload = parseInt(e.target.value); setCourses(n)
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fixed Lectures</Label>
                            {course.lectures.map((lec: any, lIdx: number) => (
                              <div key={lIdx} className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex-1 space-y-1">
                                  <Label className="text-[10px]">Day</Label>
                                  <Select value={lec.day} onValueChange={(v) => {
                                    const n = [...courses]; n[cIdx].lectures[lIdx].day = v; setCourses(n)
                                  }}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                                <div className="flex-1 space-y-1">
                                  <Label className="text-[10px]">Start</Label>
                                  <Input className="h-9" value={lec.start} onChange={(e) => {
                                    const n = [...courses]; n[cIdx].lectures[lIdx].start = e.target.value; setCourses(n)
                                  }} />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <Label className="text-[10px]">End</Label>
                                  <Input className="h-9" value={lec.end} onChange={(e) => {
                                    const n = [...courses]; n[cIdx].lectures[lIdx].end = e.target.value; setCourses(n)
                                  }} />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeLecture(cIdx, lIdx)}>
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => addLecture(cIdx)} className="w-full text-xs dashed">
                              <Plus className="w-3 h-3 mr-1" /> Add Lecture Time
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button variant="outline" onClick={addCourse} className="w-full border-dashed py-6 border-2">
                      <Plus className="w-4 h-4 mr-2" /> Add Another Course
                    </Button>
                    <div className="flex justify-end pt-4">
                       <Button onClick={() => setFormTab('commitments')} variant="secondary">
                         Next: Commitments <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="commitments" className="mt-0 space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">Add non-academic recurring events like work, sports, or club meetings.</p>
                    {commitments.map((com, idx) => (
                      <Card key={idx} className="p-4 flex gap-4 items-end bg-white border-2 border-slate-50 shadow-sm">
                        <div className="flex-1 space-y-2">
                          <Label>Event Description</Label>
                          <Input value={com.description} placeholder="e.g. Part-time Job" onChange={(e) => {
                            const n = [...commitments]; n[idx].description = e.target.value; setCommitments(n)
                          }} />
                        </div>
                        <div className="w-32 space-y-2">
                          <Label>Day</Label>
                          <Select value={com.day} onValueChange={(v) => {
                            const n = [...commitments]; n[idx].day = v; setCommitments(n)
                          }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="w-24 space-y-2">
                          <Label>Start</Label>
                          <Input value={com.start} onChange={(e) => {
                            const n = [...commitments]; n[idx].start = e.target.value; setCommitments(n)
                          }} />
                        </div>
                        <div className="w-24 space-y-2">
                          <Label>End</Label>
                          <Input value={com.end} onChange={(e) => {
                            const n = [...commitments]; n[idx].end = e.target.value; setCommitments(n)
                          }} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeCommitment(idx)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </Card>
                    ))}
                    <Button variant="outline" onClick={addCommitment} className="w-full border-dashed py-4">
                      <Plus className="w-4 h-4 mr-2" /> Add Personal Commitment
                    </Button>
                    <div className="flex justify-between pt-4">
                       <Button onClick={() => setFormTab('courses')} variant="ghost">Back</Button>
                       <Button onClick={() => setFormTab('habits')} variant="secondary">
                         Next: Study Habits <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="habits" className="mt-0 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" /> Focus Period (Mins)
                          </Label>
                          <Input type="number" value={preferences.focusTime} onChange={(e) => setPreferences({...preferences, focusTime: parseInt(e.target.value)})} />
                          <p className="text-[10px] text-muted-foreground">AI will split study sessions into blocks this long.</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" /> Break Duration (Mins)
                          </Label>
                          <Input type="number" value={preferences.breakTime} onChange={(e) => setPreferences({...preferences, breakTime: parseInt(e.target.value)})} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Earliest Start Time</Label>
                          <Input value={preferences.startTime} placeholder="08:00 AM" onChange={(e) => setPreferences({...preferences, startTime: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Latest End Time</Label>
                          <Input value={preferences.endTime} placeholder="09:00 PM" onChange={(e) => setPreferences({...preferences, endTime: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Preferences</Label>
                      <textarea 
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="e.g. I prefer studying in large chunks on weekends, and I like my Monday mornings free for deep work."
                        value={preferences.notes}
                        onChange={(e) => setPreferences({...preferences, notes: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                       <Button onClick={() => setFormTab('commitments')} variant="ghost">Back</Button>
                       <Button 
                        disabled={loading} 
                        onClick={handleGenerate} 
                        className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg"
                       >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2 text-accent" />}
                         Generate Optimal Schedule
                       </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="h-fit sticky top-6 bg-primary text-white border-none shadow-2xl overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles className="w-24 h-24" />
             </div>
             <CardHeader>
               <CardTitle>Design Summary</CardTitle>
               <CardDescription className="text-white/80">Confirm your data before generation.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-white/60 uppercase text-[10px] font-bold">Planned Courses</Label>
                 <div className="flex flex-wrap gap-2">
                   {courses.filter(c => c.name).map((c, i) => (
                     <Badge key={i} variant="secondary" className="bg-white/20 text-white border-none">{c.name}</Badge>
                   ))}
                   {courses.filter(c => !c.name).length > 0 && <span className="text-xs italic">Unfinished courses...</span>}
                 </div>
               </div>
               <div className="space-y-2">
                 <Label className="text-white/60 uppercase text-[10px] font-bold">Personal Events</Label>
                 <div className="text-sm font-medium">
                   {commitments.filter(c => c.description).length} recurring commitments added.
                 </div>
               </div>
               <div className="bg-white/10 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Study Goal:</span>
                    <span className="font-bold">{courses.reduce((acc, c) => acc + (c.workload || 0), 0)} Hrs/Week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Session Style:</span>
                    <span className="font-bold">{preferences.focusTime}/{preferences.breakTime}</span>
                  </div>
               </div>
             </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {(timetable?.weeklyTimetable || defaultTimetable).map((day, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-primary p-3 rounded-lg text-white text-center font-bold sticky top-0 shadow-lg z-10">
                {day.day}
              </div>
              <div className="space-y-2">
                {day.events.map((event, eIdx) => (
                  <Card key={eIdx} className={`p-3 shadow-sm border-none transition-transform hover:scale-[1.02] cursor-default ${
                    event.type === 'break' ? 'bg-accent/10 border-l-4 border-l-accent' : 
                    event.type === 'study' ? 'bg-primary/5 border-l-4 border-l-primary' : 
                    event.type === 'personal' ? 'bg-slate-100 border-l-4 border-l-slate-400' :
                    'bg-white border-l-4 border-l-slate-200'
                  }`}>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" /> {event.time}
                    </div>
                    <div className="text-sm font-semibold leading-tight">
                      {event.description}
                    </div>
                    {event.courseName && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-[9px] h-4 py-0 px-1 border-primary/30 text-primary">
                          {event.courseName}
                        </Badge>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {timetable?.summary && (
        <Card className="bg-accent/5 border-accent/20 border-dashed border-2">
          <CardContent className="p-6 flex gap-4 items-start">
            <div className="bg-accent/10 p-2 rounded-full">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-accent">AI Insights</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {timetable.summary}
              </p>
            </div>
          </CardContent>
        </Card>
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
