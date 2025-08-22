'use client'

import { useState } from 'react'
import { ProfileDisplay } from '@/components/profile/profile-display'
import { ProfileEdit } from '@/components/profile/profile-edit'
import { AccountSettings } from '@/components/profile/account-settings'
import { PasswordChange } from '@/components/profile/password-change'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { User, Settings, Lock, Shield } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profiel</h1>
        <p className="text-gray-600">Beheer je persoonlijke informatie en accountinstellingen</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profiel</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Instellingen</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Beveiliging</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {isEditing ? (
            <ProfileEdit onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <ProfileDisplay onEdit={handleEdit} />
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Instellingen</h2>
              <p className="text-gray-600">Beheer je notificaties, privacy en voorkeuren</p>
            </div>
            <AccountSettings />
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Beveiliging</h2>
            <p className="text-gray-600">Houd je account veilig met een sterk wachtwoord</p>
          </div>
          <PasswordChange />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Privacy Instellingen</h2>
              <p className="text-gray-600">Beheer je privacy instellingen en gegevensverwerking</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Jouw Privacy is Belangrijk</h3>
                    <p className="text-sm text-blue-800">
                      We nemen je privacy serieus en geven je volledige controle over je gegevens. 
                      Bekijk ons <a href="/privacy-policy" className="underline">privacybeleid</a> voor meer informatie.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Gegevens Exporteren</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download een kopie van al je gegevens in een leesbaar formaat.
                  </p>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Gegevens Exporteren →
                  </button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Verwijderen</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Permanent je account en alle bijbehorende gegevens verwijderen.
                  </p>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Account Verwijderen →
                  </button>
                </Card>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Toestemmingen</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analytics Cookies</p>
                      <p className="text-xs text-gray-600">Help ons de service te verbeteren</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Marketing Communicatie</p>
                      <p className="text-xs text-gray-600">Ontvang nieuwsbrieven en aanbiedingen</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}