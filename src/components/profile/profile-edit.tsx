'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe,
  Upload,
  Loader2
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface ProfileEditProps {
  onSave?: () => void
  onCancel?: () => void
}

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  postalCode: string
  province: string
  country: string
  bio: string
  website: string
  socialLinks: Record<string, string>
}

export function ProfileEdit({ onSave, onCancel }: ProfileEditProps) {
  const { user, profile, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
    address: profile?.address || '',
    city: profile?.city || '',
    postalCode: profile?.postalCode || '',
    province: profile?.province || '',
    country: profile?.country || 'Netherlands',
    bio: profile?.bio || '',
    website: profile?.website || '',
    socialLinks: profile?.socialLinks || {},
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        address: profile.address || '',
        city: profile.city || '',
        postalCode: profile.postalCode || '',
        province: profile.province || '',
        country: profile.country || 'Netherlands',
        bio: profile.bio || '',
        website: profile.website || '',
        socialLinks: profile.socialLinks || {},
      })
    }
  }, [profile, user])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.postalCode && !/^\d{4}\s?[A-Z]{2}$/i.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid Dutch postal code (e.g., 1234 AB)'
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        province: formData.province,
        country: formData.country,
        bio: formData.bio,
        website: formData.website,
        socialLinks: formData.socialLinks,
      })
      
      onSave?.()
    } catch (error) {
      console.error('Failed to update profile:', error)
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addSocialLink = () => {
    const platform = prompt('Enter social media platform (e.g., LinkedIn, Twitter):')
    const url = prompt('Enter the URL:')
    
    if (platform && url) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform.toLowerCase()]: url
        }
      }))
    }
  }

  const removeSocialLink = (platform: string) => {
    setFormData(prev => {
      const newSocialLinks = { ...prev.socialLinks }
      delete newSocialLinks[platform]
      return { ...prev, socialLinks: newSocialLinks }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Avatar Upload Placeholder */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {formData.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <Button type="button" variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+31 6 12345678"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="1234 AB"
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-600 mt-1">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Amsterdam"
              />
            </div>

            <div>
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="Noord-Holland"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Online Presence */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Online Presence</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.example.com"
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="text-sm text-red-600 mt-1">{errors.website}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Social Links</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                Add Social Link
              </Button>
            </div>
            
            {Object.entries(formData.socialLinks).map(([platform, url]) => (
              <div key={platform} className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 capitalize min-w-0 w-20">
                  {platform}:
                </span>
                <Input
                  value={url}
                  onChange={(e) => handleInputChange('socialLinks', JSON.stringify({
                    ...formData.socialLinks,
                    [platform]: e.target.value
                  }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialLink(platform)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </form>
  )
}