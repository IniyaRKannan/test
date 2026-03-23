'use server';
/**
 * @fileOverview A Genkit flow for generating an initial daily and weekly timetable for a student.
 *
 * - generateInitialTimetable - A function that generates a personalized timetable.
 * - GenerateInitialTimetableInput - The input type for the generateInitialTimetable function.
 * - GenerateInitialTimetableOutput - The return type for the generateInitialTimetable function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CourseSchema = z.object({
  name: z.string().describe('Name of the course (e.g., "Calculus I", "Physics 101").'),
  workloadHoursPerWeek: z.number().min(1).describe('Estimated hours needed per week for this course, excluding lecture time.'),
  lectureSchedule: z.array(z.object({
    dayOfWeek: z.string().describe('e.g., "Monday", "Tuesday"'),
    startTime: z.string().describe('HH:MM AM/PM format, e.g., "9:00 AM"'),
    endTime: z.string().describe('HH:MM AM/PM format, e.g., "9:50 AM"'),
  })).optional().describe('Fixed lecture times for the course.'),
  deadlines: z.array(z.object({
    description: z.string().describe('Description of the deadline, e.g., "Midterm Exam", "Assignment 1"'),
    date: z.string().describe('YYYY-MM-DD format, e.g., "2024-03-15"'),
    time: z.string().optional().describe('HH:MM AM/PM format, e.g., "5:00 PM"')
  })).optional().describe('Important assignment or exam deadlines.'),
});

const StudyPreferencesSchema = z.object({
  preferredStudyTimes: z.array(z.string().describe('Preferred periods for studying, e.g., "Morning", "Afternoon", "Evening".')).optional(),
  focusedStudyPeriodMinutes: z.number().min(30).describe('Preferred duration for a single focused study period before a break, in minutes (e.g., 50 for a 50/10 work/break cycle).'),
  breakDurationMinutes: z.number().min(5).describe('Duration of each short break in minutes, e.g., 10, 15.'),
  daysAvailableForStudy: z.array(z.string().describe('Days of the week the student is available for study, e.g., "Monday", "Tuesday", "Saturday".')),
  earliestStudyTime: z.string().describe('The earliest time the student is willing to start studying, HH:MM AM/PM format, e.g., "8:00 AM"'),
  latestStudyTime: z.string().describe('The latest time the student is willing to study until, HH:MM AM/PM format, e.g., "10:00 PM"'),
});

const PersonalCommitmentSchema = z.object({
  description: z.string().describe('Description of the commitment, e.g., "Work", "Gym", "Club Meeting".'),
  dayOfWeek: z.string().describe('Day of the week, e.g., "Wednesday"'),
  startTime: z.string().describe('HH:MM AM/PM format, e.g., "6:00 PM"'),
  endTime: z.string().describe('HH:MM AM/PM format, e.g., "7:00 PM"'),
});

const GenerateInitialTimetableInputSchema = z.object({
  courses: z.array(CourseSchema).describe('List of courses the student is taking, including workload and fixed schedules.'),
  studyPreferences: StudyPreferencesSchema.describe('Student\'s preferred study habits and availability.'),
  personalCommitments: z.array(PersonalCommitmentSchema).describe('Non-academic appointments and fixed commitments.'),
  additionalNotes: z.string().optional().describe('Any other specific requests or preferences for the timetable, e.g., "I prefer longer study sessions on weekends."'),
});
export type GenerateInitialTimetableInput = z.infer<typeof GenerateInitialTimetableInputSchema>;

const TimetableEventSchema = z.object({
  time: z.string().describe('Time slot, e.g., "9:00 AM - 10:00 AM"'),
  description: z.string().describe('Description of the event, e.g., "Calculus I Lecture", "Study Physics", "Lunch", "Mental Health Break".'),
  type: z.enum(['academic', 'study', 'personal', 'break']).describe('Category of the event.'),
  courseName: z.string().optional().describe('Relevant course name if the event is academic or study-related.'),
});

const DailyTimetableSchema = z.object({
  day: z.string().describe('Day of the week, e.g., "Monday"'),
  events: z.array(TimetableEventSchema).describe('List of events scheduled for this day.'),
});

const GenerateInitialTimetableOutputSchema = z.object({
  weeklyTimetable: z.array(DailyTimetableSchema).describe('A structured weekly timetable.'),
  summary: z.string().optional().describe('A brief summary or explanation of the generated timetable.'),
});
export type GenerateInitialTimetableOutput = z.infer<typeof GenerateInitialTimetableOutputSchema>;

export async function generateInitialTimetable(
  input: GenerateInitialTimetableInput
): Promise<GenerateInitialTimetableOutput> {
  return generateInitialTimetableFlow(input);
}

const generateInitialTimetablePrompt = ai.definePrompt({
  name: 'generateInitialTimetablePrompt',
  input: { schema: GenerateInitialTimetableInputSchema },
  output: { schema: GenerateInitialTimetableOutputSchema },
  prompt: `You are an AI assistant specialized in creating highly personalized and balanced academic timetables for students. Your goal is to generate a detailed daily and weekly schedule that incorporates the student's course load, study habits, and personal commitments, while also ensuring adequate breaks for mental well-being.

Consider the following information provided by the student:

Courses: {{{JSON.stringify courses}}}
Study Preferences: {{{JSON.stringify studyPreferences}}}
Personal Commitments: {{{JSON.stringify personalCommitments}}}
Additional Notes: {{{additionalNotes}}}

Instructions for generating the timetable:
1.  **Prioritize Fixed Commitments**: First, block out all \`lectureSchedule\` from courses and \`personalCommitments\`. These are non-negotiable.
2.  **Allocate Study Time**: Distribute the \`workloadHoursPerWeek\` for each course across the \`daysAvailableForStudy\`, respecting \`preferredStudyTimes\`, \`earliestStudyTime\`, and \`latestStudyTime\`.
3.  **Implement Study Habits**: Break down study sessions into \`focusedStudyPeriodMinutes\` followed by \`breakDurationMinutes\`. Ensure these breaks are explicitly included in the schedule as "Mental Health Break" or "Short Break".
4.  **Balance and Well-being**: Aim for a balanced schedule that avoids burnout. Do not overschedule any day. Ensure there's free time.
5.  **Structure**: The output must be a JSON object with a 'weeklyTimetable' array containing 'DailyTimetableSchema' objects, and an optional 'summary'.
6.  **Detailed Events**: Each event in the schedule should clearly state its 'time', 'description', 'type', and optionally 'courseName'.
7.  **Time Format**: All times should be in HH:MM AM/PM format for display. Time slots should represent the start and end time of an event.
8.  **Cover a Full Week**: Generate a schedule for all seven days of the week, even if some days are mostly free.
9.  **Mental Health Breaks**: Ensure explicit "Mental Health Break" events are integrated, especially during longer study periods.
10. **Deadlines**: While not directly scheduled, keep deadlines in mind when allocating study time for relevant courses, perhaps by allocating more study time for courses with upcoming deadlines.

Example of desired output event structure:
{
  "day": "Monday",
  "events": [
    { "time": "9:00 AM - 9:50 AM", "description": "Calculus I Lecture", "type": "academic", "courseName": "Calculus I" },
    { "time": "10:00 AM - 11:00 AM", "description": "Study Physics 101: Chapter 3", "type": "study", "courseName": "Physics 101" },
    { "time": "11:00 AM - 11:15 AM", "description": "Mental Health Break", "type": "break" },
    { "time": "12:00 PM - 1:00 PM", "description": "Lunch", "type": "personal" }
  ]
}
`
});

const generateInitialTimetableFlow = ai.defineFlow(
  {
    name: 'generateInitialTimetableFlow',
    inputSchema: GenerateInitialTimetableInputSchema,
    outputSchema: GenerateInitialTimetableOutputSchema,
  },
  async (input) => {
    const { output } = await generateInitialTimetablePrompt(input);
    return output!;
  }
);
