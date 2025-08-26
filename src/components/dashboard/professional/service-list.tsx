'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash,
  Clock,
  MapPin,
  Euro,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Zap,
  Shield,
} from 'lucide-react';
import { useApi } from '@/lib/hooks/use-api';
import type { ServiceWithDetails } from '@/lib/types/professional-dashboard';

interface ServiceListProps {
  professionalId: string;
}

export function ServiceList({ professionalId }: ServiceListProps) {
  const router = useRouter();
  const [deletingService, setDeletingService] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  const { 
    data: services, 
    loading, 
    error, 
    refetch 
  } = useApi(`/api/services?proId=${professionalId}`);

  const handleStatusToggle = async (serviceId: string, currentStatus: boolean) => {
    setUpdatingStatus(serviceId);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Error updating service status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refetch();
        setDeletingService(null);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const formatPrice = (price: string, unit: string) => {
    const unitLabels: Record<string, string> = {
      hour: '/hr',
      day: '/day',
      piece: '/piece',
      service: '/service',
      km: '/km',
    };
    return `€${price}${unitLabels[unit] || ''}`;
  };

  const getLanguageFlags = (languages: string[]) => {
    const flags: Record<string, string> = {
      es: '🇪🇸',
      en: '🇬🇧',
      nl: '🇳🇱',
      de: '🇩🇪',
    };
    return languages.map(lang => flags[lang] || lang).join(' ');
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted" />
            <CardContent className="h-32 bg-muted mt-4" />
            <CardFooter className="h-16 bg-muted mt-4" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Failed to load services</p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const serviceList = services?.services || [];

  if (serviceList.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="text-center py-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Services Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start offering services to connect with clients
          </p>
          <Button onClick={() => router.push('/dashboard/professional/services/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Service
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {serviceList.map((service: ServiceWithDetails) => (
          <Card 
            key={service.id} 
            className={`relative overflow-hidden transition-all ${
              !service.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Status Badge */}
            {!service.isActive && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary">Inactive</Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {service.category?.name}
                    </Badge>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/professional/services/${service.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeletingService(service.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>

              {/* Service Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Euro className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">
                    {formatPrice(service.basePrice, service.priceUnit)}
                  </span>
                </div>
                
                {service.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{service.duration} min</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{service.serviceRadius} km</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-lg leading-none">
                    {getLanguageFlags(service.languages)}
                  </span>
                </div>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-1.5">
                {service.instantBooking && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="mr-1 h-3 w-3" />
                    Instant Booking
                  </Badge>
                )}
                {service.bufferTime > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="mr-1 h-3 w-3" />
                    {service.bufferTime}m buffer
                  </Badge>
                )}
                {service.maxDailyBookings && (
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Max {service.maxDailyBookings}/day
                  </Badge>
                )}
              </div>

              {/* Statistics (if available) */}
              {service.statistics && (
                <div className="pt-2 border-t space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bookings</span>
                    <span className="font-medium">{service.statistics.totalBookings}</span>
                  </div>
                  {service.statistics.averageRating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {service.statistics.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={service.isActive}
                    onCheckedChange={() => handleStatusToggle(service.id, service.isActive)}
                    disabled={updatingStatus === service.id}
                    aria-label="Toggle service status"
                  />
                  <label className="text-sm font-medium">
                    {service.isActive ? 'Active' : 'Inactive'}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/dashboard/professional/services/${service.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add New Service Card */}
      <Card className="border-dashed bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => router.push('/dashboard/professional/services/new')}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Add New Service</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Expand your offerings
          </p>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingService} onOpenChange={() => setDeletingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
              Active bookings will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingService && handleDelete(deletingService)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}