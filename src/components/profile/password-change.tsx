'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Key,
  Loader2
} from 'lucide-react'
import { useState } from 'react'

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export function PasswordChange() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('Use at least 8 characters')
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include lowercase letters')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include uppercase letters')
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('Include numbers')
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include special characters')
    }

    let color = 'red'
    if (score >= 4) color = 'green'
    else if (score >= 3) color = 'yellow'
    else if (score >= 2) color = 'orange'

    return { score, feedback, color }
  }

  const passwordStrength = evaluatePasswordStrength(formData.newPassword)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long'
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword = 'Password is too weak. Please follow the requirements.'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
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
    setSuccess(false)
    
    try {
      // Here you would call your password change API
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setErrors({})
      } else {
        const error = await response.json()
        setErrors({ general: error.message || 'Failed to change password' })
      }
    } catch (error) {
      console.error('Password change error:', error)
      setErrors({ general: 'Failed to change password. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }))
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const getStrengthBarColor = (score: number) => {
    if (score >= 4) return 'bg-green-500'
    if (score >= 3) return 'bg-yellow-500'
    if (score >= 2) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <Card className="p-6 max-w-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Lock className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-sm text-green-800">
            Password changed successfully! You will need to sign in again with your new password.
          </p>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative mt-1">
            <Input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={errors.currentPassword ? 'border-red-500 pr-10' : 'pr-10'}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative mt-1">
            <Input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Strength:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getStrengthBarColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${passwordStrength.color === 'green' ? 'text-green-600' : passwordStrength.color === 'yellow' ? 'text-yellow-600' : passwordStrength.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
                  {passwordStrength.score >= 4 ? 'Strong' : passwordStrength.score >= 3 ? 'Good' : passwordStrength.score >= 2 ? 'Fair' : 'Weak'}
                </span>
              </div>
              
              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-1">Requirements:</p>
                  <ul className="space-y-0.5">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex">
            <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Security Notice</p>
              <p className="text-sm text-blue-700">
                After changing your password, you will be signed out of all devices and need to sign in again.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              })
              setErrors({})
            }}
          >
            Reset
          </Button>
          
          <Button
            type="submit"
            disabled={loading || passwordStrength.score < 3}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Key className="w-4 h-4 mr-2" />
            )}
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  )
}