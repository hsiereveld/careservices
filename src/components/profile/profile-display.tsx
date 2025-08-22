'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

interface ProfileDisplayProps {
  onEdit?: () => void
  showEditButton?: boolean
}

export function ProfileDisplay({ onEdit, showEditButton = true }: ProfileDisplayProps) {
  const { user, profile } = useAuth()
  const [imageError, setImageError] = useState(false)

  const getStatusBadge = () => {
    if (!user) return null

    if (user.isVerified) {
      return (
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )
    }

    if (user.isActive) {
      return (
        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending Verification
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'client':
        return 'Client'
      case 'pro':
        return 'Professional'
      case 'franchise':
        return 'Franchise Owner'
      case 'admin':
        return 'Administrator'
      default:
        return 'User'
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                {!imageError ? (
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                    alt={user?.name || 'User'}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white font-bold text-2xl rounded-full">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Avatar>
              
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.firstName && profile?.lastName 
                    ? `${profile.firstName} ${profile.lastName}`
                    : user?.name || 'Unknown User'
                  }
                </h1>
                {getStatusBadge()}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  {getRoleDisplayName(user?.role || '')}
                </span>
                
                {user?.email && (
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {user.email}
                  </span>
                )}
                
                {user?.phone && (
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {user.phone}
                  </span>
                )}
              </div>

              {profile?.bio && (
                <p className="mt-3 text-gray-700">{profile.bio}</p>
              )}
            </div>
          </div>

          {showEditButton && onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Details Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            {profile?.dateOfBirth && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                  <p className="text-sm text-gray-600">{formatDate(profile.dateOfBirth)}</p>
                </div>
              </div>
            )}

            {(profile?.address || profile?.city || profile?.postalCode) && (
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <div className="text-sm text-gray-600">
                    {profile?.address && <p>{profile.address}</p>}
                    {(profile?.postalCode || profile?.city) && (
                      <p>
                        {profile?.postalCode} {profile?.city}
                      </p>
                    )}
                    {profile?.province && <p>{profile.province}</p>}
                    {profile?.country && <p>{profile.country}</p>}
                  </div>
                </div>
              </div>
            )}

            {user?.preferredLanguage && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Preferred Language</p>
                  <p className="text-sm text-gray-600 capitalize">{user.preferredLanguage}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Account Status</p>
                <p className="text-sm text-gray-600">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              {getStatusBadge()}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Member Since</p>
              <p className="text-sm text-gray-600">
                {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Last Updated</p>
              <p className="text-sm text-gray-600">
                {user?.updatedAt ? formatDate(user.updatedAt) : 'Never'}
              </p>
            </div>

            {profile?.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <a 
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {profile.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Social Links */}
      {profile?.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(profile.socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{platform}</p>
                  <p className="text-sm text-gray-600 truncate">{url as string}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}