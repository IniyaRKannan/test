"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  ShieldCheck, 
  Instagram, 
  Twitter, 
  Youtube, 
  Clock,
  Lock,
  Smartphone,
  Info
} from "lucide-react"

export default function BlockingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          Focus Protection
        </h1>
        <p className="text-muted-foreground">Manage social media limits and strict blocking rules during focus sessions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Focus Lock</CardTitle>
              <CardDescription>Automatically block all listed apps when Focus Mode is active.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <span className="font-medium">Strict Mode</span>
              </div>
              <Switch defaultChecked />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Alerts</CardTitle>
              <CardDescription>Receive notifications when approaching your daily limits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Soft Warnings at 80%</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Hard Blocking at 100%</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Daily Usage Limits</CardTitle>
            <CardDescription>Adjust limits for each platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <span className="font-semibold">Instagram</span>
                </div>
                <span className="text-sm font-bold text-primary">45 Minutes</span>
              </div>
              <Slider defaultValue={[45]} max={180} step={5} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-sky-500" />
                  <span className="font-semibold">X (Twitter)</span>
                </div>
                <span className="text-sm font-bold text-primary">30 Minutes</span>
              </div>
              <Slider defaultValue={[30]} max={180} step={5} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">YouTube</span>
                </div>
                <span className="text-sm font-bold text-primary">60 Minutes</span>
              </div>
              <Slider defaultValue={[60]} max={180} step={5} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full mt-1">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-primary">How Blocking Works</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Aura Academic uses a local VPN-based service (simulated here) to intercept distraction requests. 
              During Focus Mode, these apps will be completely inaccessible to help you maintain your deep work flow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
