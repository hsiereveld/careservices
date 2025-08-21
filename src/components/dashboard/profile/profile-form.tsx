'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Upload,
  Shield,
  Globe
} from 'lucide-react'

interface ProfileFormProps {
  role: 'client' | 'pro' | 'franchise' | 'admin'
}

export function ProfileForm({ role }: ProfileFormProps) {
  const { user, profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: user?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    postalCode: profile?.postalCode || '',
    province: profile?.province || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleSpecificFields = () => {
    switch (role) {
      case 'pro':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg h-24 resize-none"
                placeholder="Tell clients about your experience and expertise..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Professional Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="https://your-website.com"
              />
            </div>
          </>
        )
      case 'franchise':
        return (
          <div className="space-y-2">
            <Label htmlFor="bio">Franchise Description</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              className="w-full p-3 border rounded-lg h-24 resize-none"
              placeholder="Describe your franchise operation and service area..."
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed here. Contact support if needed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {getRoleSpecificFields()}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Account status and security information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">{user?.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Verification</Label>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm">{user?.isVerified ? 'Verified' : 'Pending'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </Label>
              <p className="text-sm text-gray-600">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </Label>
              <p className="text-sm text-gray-600">{user?.preferredLanguage || 'English'}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="mr-3">
              Change Password
            </Button>
            <Button variant="outline">
              Download My Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}