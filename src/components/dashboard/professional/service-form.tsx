'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X, Sparkles, Settings2 } from 'lucide-react';
import { useApi } from '@/lib/hooks/use-api';
import type { ServiceFormData, ServiceTemplateLocalized } from '@/lib/types/professional-dashboard';

const serviceFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  categoryId: z.string().min(1, 'Please select a category'),
  templateId: z.string().optional(),
  basePrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  priceUnit: z.enum(['hour', 'day', 'piece', 'service', 'km']),
  duration: z.string().optional(),
  serviceRadius: z.string().default('25'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  requirements: z.string().optional(),
  bufferTime: z.string().default('0'),
  maxDailyBookings: z.string().optional(),
  advanceBookingDays: z.string().default('30'),
  instantBooking: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  service?: any; // Existing service for editing
  onSuccess?: () => void;
}

const availableLanguages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'de', name: 'Deutsch' },
];

const priceUnits = [
  { value: 'hour', label: 'Per Hour' },
  { value: 'day', label: 'Per Day' },
  { value: 'piece', label: 'Per Piece' },
  { value: 'service', label: 'Per Service' },
  { value: 'km', label: 'Per Kilometer' },
];

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplateLocalized | null>(null);
  const { data: categories, loading: categoriesLoading } = useApi('/api/service-categories');
  const { data: templatesData, loading: templatesLoading } = useApi('/api/services/templates');

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      categoryId: service?.categoryId || '',
      templateId: '',
      basePrice: service?.basePrice || '',
      priceUnit: service?.priceUnit || 'hour',
      duration: service?.duration?.toString() || '',
      serviceRadius: service?.serviceRadius?.toString() || '25',
      languages: service?.languages || ['es'],
      requirements: service?.requirements || '',
      bufferTime: service?.bufferTime?.toString() || '0',
      maxDailyBookings: service?.maxDailyBookings?.toString() || '',
      advanceBookingDays: service?.advanceBookingDays?.toString() || '30',
      instantBooking: service?.instantBooking || false,
    },
  });

  const { watch, setValue } = form;
  const selectedCategoryId = watch('categoryId');
  const selectedLanguages = watch('languages');

  // Filter templates by selected category
  const templates = templatesData?.filter(
    (t: ServiceTemplateLocalized) => t.categoryId === selectedCategoryId
  );

  // Apply template values when selected
  const handleTemplateSelect = (templateId: string) => {
    const template = templates?.find((t: ServiceTemplateLocalized) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setValue('name', template.name);
      setValue('description', template.description);
      setValue('basePrice', template.defaultPrice?.toString() || '');
      setValue('priceUnit', template.defaultUnit);
      setValue('duration', template.defaultDuration?.toString() || '');
    }
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);
    
    try {
      const payload: ServiceFormData = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        templateId: values.templateId,
        basePrice: parseFloat(values.basePrice),
        priceUnit: values.priceUnit,
        duration: values.duration ? parseInt(values.duration) : undefined,
        serviceRadius: parseInt(values.serviceRadius),
        languages: values.languages,
        requirements: values.requirements,
        bufferTime: parseInt(values.bufferTime),
        maxDailyBookings: values.maxDailyBookings ? parseInt(values.maxDailyBookings) : undefined,
        advanceBookingDays: parseInt(values.advanceBookingDays),
        instantBooking: values.instantBooking,
      };

      const url = service ? `/api/services/${service.id}` : '/api/services';
      const method = service ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save service');
      }

      onSuccess?.();
      router.push('/dashboard/professional/services');
      router.refresh();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = (langCode: string) => {
    const current = selectedLanguages || [];
    if (current.includes(langCode)) {
      setValue('languages', current.filter(l => l !== langCode));
    } else {
      setValue('languages', [...current, langCode]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Template Selection (Mobile-optimized) */}
      {!service && templates?.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Start with Template
            </CardTitle>
            <CardDescription className="text-sm">
              Select a template to pre-fill your service details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((template: ServiceTemplateLocalized) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.watch('categoryId')}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="e.g., House Cleaning Service"
                className="w-full"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe your service in detail..."
              rows={4}
              className="resize-none"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Languages *</Label>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((lang) => (
                <Badge
                  key={lang.code}
                  variant={selectedLanguages?.includes(lang.code) ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => toggleLanguage(lang.code)}
                >
                  {lang.name}
                </Badge>
              ))}
            </div>
            {form.formState.errors.languages && (
              <p className="text-sm text-destructive">
                {form.formState.errors.languages.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Duration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing & Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (€) *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                {...form.register('basePrice')}
                placeholder="50.00"
              />
              {form.formState.errors.basePrice && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.basePrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceUnit">Price Unit *</Label>
              <Select
                value={form.watch('priceUnit')}
                onValueChange={(value: any) => setValue('priceUnit', value)}
              >
                <SelectTrigger id="priceUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                {...form.register('duration')}
                placeholder="120"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceRadius">Service Radius (km)</Label>
              <Input
                id="serviceRadius"
                type="number"
                {...form.register('serviceRadius')}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
              <Input
                id="bufferTime"
                type="number"
                {...form.register('bufferTime')}
                placeholder="30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxDailyBookings">Max Daily Bookings</Label>
              <Input
                id="maxDailyBookings"
                type="number"
                {...form.register('maxDailyBookings')}
                placeholder="No limit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceBookingDays">Advance Booking Days</Label>
              <Input
                id="advanceBookingDays"
                type="number"
                {...form.register('advanceBookingDays')}
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="instantBooking" className="text-base cursor-pointer">
                Instant Booking
              </Label>
              <div className="text-sm text-muted-foreground">
                Allow clients to book without your approval
              </div>
            </div>
            <Switch
              id="instantBooking"
              checked={form.watch('instantBooking')}
              onCheckedChange={(checked) => setValue('instantBooking', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              id="requirements"
              {...form.register('requirements')}
              placeholder="Any special requirements or notes for clients..."
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {service ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}