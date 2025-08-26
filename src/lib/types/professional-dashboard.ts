import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { 
  professionalAvailability, 
  messages, 
  serviceTemplates,
  service,
  booking
} from '../schema';

// Professional Availability Types
export type ProfessionalAvailability = InferSelectModel<typeof professionalAvailability>;
export type NewProfessionalAvailability = InferInsertModel<typeof professionalAvailability>;

export type TimeSlot = {
  start: string; // HH:MM format
  end: string; // HH:MM format  
  status: 'available' | 'blocked';
};

export type RecurringPattern = {
  type: 'weekly' | 'daily';
  days: number[]; // 0-6 for Sunday-Saturday
  until: string; // YYYY-MM-DD format
} | null;

// Messages Types
export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    name: string;
    image: string | null;
    role: 'client' | 'pro' | 'franchise' | 'admin';
  };
}

export interface MessageThread {
  bookingId: string;
  messages: MessageWithSender[];
  unreadCount: number;
  lastMessage?: MessageWithSender;
  participants: {
    client: {
      id: string;
      name: string;
      image: string | null;
    };
    professional: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}

// Service Templates Types
export type ServiceTemplate = InferSelectModel<typeof serviceTemplates>;
export type NewServiceTemplate = InferInsertModel<typeof serviceTemplates>;

export interface ServiceTemplateLocalized extends Omit<ServiceTemplate, 'nameKey' | 'descriptionKey'> {
  name: string; // Translated name
  description: string; // Translated description
}

// Enhanced Service Types
export type Service = InferSelectModel<typeof service>;
export type NewService = InferInsertModel<typeof service>;

export interface ServiceWithDetails extends Service {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  template?: ServiceTemplateLocalized | null;
  statistics?: {
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    totalRevenue: number;
  };
}

// Enhanced Booking Types
export type Booking = InferSelectModel<typeof booking>;
export type NewBooking = InferInsertModel<typeof booking>;

export type AlternativeTime = {
  start: string; // ISO datetime string
  end: string; // ISO datetime string
};

export interface BookingRequest extends Booking {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    preferredLanguage: string;
    profile?: {
      firstName: string | null;
      lastName: string | null;
      address: string | null;
    };
  };
  service: {
    id: string;
    name: string;
    description: string;
    basePrice: string;
    priceUnit: string;
    duration: number | null;
  };
  hasUnreadMessages: boolean;
}

// Dashboard Statistics Types
export interface ProfessionalStats {
  totalBookings: number;
  completedBookings: number;
  pendingRequests: number;
  todayBookings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  averageRating: number;
  responseTime: number; // in hours
  acceptanceRate: number; // percentage
  unreadMessages: number;
}

export interface EarningsData {
  totalGross: number;
  platformFee: number; // 5%
  franchiseFee: number; // 15%
  netEarnings: number;
  pending: number;
  completed: number;
  byService: Array<{
    serviceId: string;
    serviceName: string;
    count: number;
    total: number;
  }>;
  byDate: Array<{
    date: string;
    amount: number;
  }>;
}

// Calendar Types
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number;
  timeSlots: TimeSlot[];
  bookings: Array<{
    id: string;
    start: string;
    end: string;
    clientName: string;
    serviceName: string;
    status: string;
  }>;
  isToday: boolean;
  isPast: boolean;
}

export interface AvailabilitySettings {
  defaultStartTime: string; // HH:MM
  defaultEndTime: string; // HH:MM
  defaultBufferTime: number; // minutes
  workingDays: number[]; // 0-6 for Sunday-Saturday
  timezone: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    field?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// WebSocket Event Types
export interface MessageEvent {
  type: 'message:new' | 'message:read';
  bookingId: string;
  message?: Message;
  messageIds?: string[];
}

export interface BookingEvent {
  type: 'booking:new' | 'booking:updated' | 'booking:cancelled';
  booking: BookingRequest;
}

export interface TypingEvent {
  type: 'typing:start' | 'typing:stop';
  bookingId: string;
  userId: string;
}

// Form Types
export interface ServiceFormData {
  name: string;
  description: string;
  categoryId: string;
  templateId?: string;
  basePrice: number;
  priceUnit: 'hour' | 'day' | 'piece' | 'service' | 'km';
  duration?: number;
  serviceRadius: number;
  languages: string[];
  requirements?: string;
  bufferTime: number;
  maxDailyBookings?: number;
  advanceBookingDays: number;
  instantBooking: boolean;
}

export interface AvailabilityFormData {
  date: string;
  timeSlots: TimeSlot[];
  recurringPattern?: RecurringPattern;
}

export interface BookingResponseFormData {
  accept: boolean;
  declineReason?: string;
  alternativeTimes?: AlternativeTime[];
  message?: string;
}