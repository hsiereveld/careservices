'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RequireRole } from '@/contexts/auth-context'
import { MessageSquare, Inbox, Send, Star, Archive } from 'lucide-react'

export default function ProfessionalMessagesPage() {
  return (
    <RequireRole roles={['pro']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Communicate with your clients</p>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Messages Center</CardTitle>
            <CardDescription>Stay connected with your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                The messaging system is currently under development. Soon you'll be able to communicate directly with your clients, manage inquiries, and send updates all in one place.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Inbox className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                  <h4 className="font-medium">Unified Inbox</h4>
                  <p className="text-sm text-muted-foreground mt-1">All messages in one place</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Send className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                  <h4 className="font-medium">Quick Replies</h4>
                  <p className="text-sm text-muted-foreground mt-1">Templates for common responses</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                  <h4 className="font-medium">Smart Notifications</h4>
                  <p className="text-sm text-muted-foreground mt-1">Never miss important messages</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  )
}