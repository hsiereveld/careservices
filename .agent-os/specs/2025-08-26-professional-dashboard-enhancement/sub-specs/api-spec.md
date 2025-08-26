# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-08-26-professional-dashboard-enhancement/spec.md

## Endpoints

### Service Management

#### GET /api/services/templates
**Purpose:** Retrieve available service templates by category
**Parameters:** 
- category_id (optional): Filter by specific category
- language: Language code for translations (default: 'es')
**Response:** Array of service templates with localized names and descriptions
**Errors:** 400 (Invalid category), 401 (Unauthorized)

#### POST /api/services
**Purpose:** Create a new service listing for professional
**Parameters:**
- template_id (optional): ID of template to use
- name: Service name
- description: Service description  
- price: Decimal price
- unit: hour|day|piece|service|km
- category_id: Service category
- languages: Array of language codes
- service_radius: Coverage radius in km
**Response:** Created service object with ID
**Errors:** 400 (Validation error), 401 (Unauthorized), 403 (Pro role required)

#### PUT /api/services/{id}
**Purpose:** Update existing service listing
**Parameters:** Same as POST, all optional
**Response:** Updated service object
**Errors:** 400 (Validation error), 401 (Unauthorized), 404 (Service not found), 403 (Not owner)

#### DELETE /api/services/{id}
**Purpose:** Soft delete service (set inactive)
**Parameters:** None
**Response:** Success message
**Errors:** 401 (Unauthorized), 404 (Service not found), 403 (Not owner), 409 (Has active bookings)

### Availability Management

#### GET /api/professional/availability
**Purpose:** Get professional's availability for date range
**Parameters:**
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD
**Response:** Array of availability objects with time slots
**Errors:** 400 (Invalid dates), 401 (Unauthorized)

#### POST /api/professional/availability
**Purpose:** Set availability for specific dates
**Parameters:**
- date: YYYY-MM-DD or array of dates
- time_slots: Array of {start, end, status}
- recurring_pattern (optional): Recurrence rules
**Response:** Created availability records
**Errors:** 400 (Validation error), 401 (Unauthorized), 409 (Conflict with existing bookings)

#### DELETE /api/professional/availability/{date}
**Purpose:** Remove availability for specific date
**Parameters:** None
**Response:** Success message
**Errors:** 401 (Unauthorized), 404 (Not found), 409 (Has bookings)

### Booking Management

#### GET /api/professional/bookings
**Purpose:** Get professional's bookings with filters
**Parameters:**
- status: pending|confirmed|completed|cancelled
- date_from: Filter start date
- date_to: Filter end date
- limit: Results per page (default: 20)
- offset: Pagination offset
**Response:** Paginated booking list with client details
**Errors:** 401 (Unauthorized), 403 (Pro role required)

#### PATCH /api/bookings/{id}/accept
**Purpose:** Accept a booking request
**Parameters:**
- message (optional): Acceptance message to client
**Response:** Updated booking with confirmed status
**Errors:** 401 (Unauthorized), 404 (Not found), 403 (Not assigned pro), 409 (Already processed)

#### PATCH /api/bookings/{id}/decline
**Purpose:** Decline a booking request
**Parameters:**
- reason: Decline reason
- alternative_times (optional): Array of alternative time slots
- message (optional): Custom message to client
**Response:** Updated booking with declined status
**Errors:** 401 (Unauthorized), 404 (Not found), 403 (Not assigned pro), 409 (Already processed)

### Messaging System

#### GET /api/bookings/{id}/messages
**Purpose:** Get all messages for a booking
**Parameters:**
- limit: Messages per page (default: 50)
- before: Message ID for pagination
**Response:** Array of messages with sender details
**Errors:** 401 (Unauthorized), 404 (Booking not found), 403 (Not participant)

#### POST /api/bookings/{id}/messages
**Purpose:** Send a message in booking conversation
**Parameters:**
- content: Message text (max 5000 chars)
**Response:** Created message object
**Errors:** 400 (Validation error), 401 (Unauthorized), 404 (Booking not found), 403 (Not participant)

#### PATCH /api/messages/read
**Purpose:** Mark messages as read
**Parameters:**
- message_ids: Array of message IDs
**Response:** Count of updated messages
**Errors:** 401 (Unauthorized), 403 (Not recipient)

### Earnings Dashboard

#### GET /api/professional/earnings
**Purpose:** Get earnings summary and history
**Parameters:**
- period: day|week|month|year|custom
- start_date (for custom): YYYY-MM-DD
- end_date (for custom): YYYY-MM-DD
**Response:** 
```json
{
  "total_gross": 1500.00,
  "platform_fee": 75.00,
  "franchise_fee": 225.00,
  "net_earnings": 1200.00,
  "pending": 300.00,
  "completed": 900.00,
  "by_service": [...],
  "by_date": [...]
}
```
**Errors:** 401 (Unauthorized), 403 (Pro role required)

#### GET /api/professional/stats
**Purpose:** Get dashboard statistics
**Parameters:** None
**Response:** 
```json
{
  "total_bookings": 45,
  "completed_bookings": 38,
  "average_rating": 4.8,
  "response_time": 2.5,
  "acceptance_rate": 0.85,
  "unread_messages": 3,
  "pending_requests": 2
}
```
**Errors:** 401 (Unauthorized), 403 (Pro role required)

## WebSocket Events

### Connection
**Event:** connect
**Auth:** Bearer token in handshake
**Rooms:** Join `professional:{userId}` and active booking rooms

### Message Events
**Event:** message:new
**Payload:** Message object with booking context
**Direction:** Server → Client (both participants)

**Event:** message:read
**Payload:** {message_ids: [...], reader_id: "..."}
**Direction:** Client → Server → Other participant

**Event:** typing:start
**Payload:** {booking_id: "...", user_id: "..."}
**Direction:** Client → Server → Other participant

**Event:** typing:stop
**Payload:** {booking_id: "...", user_id: "..."}
**Direction:** Client → Server → Other participant

### Booking Events
**Event:** booking:new
**Payload:** Booking request object
**Direction:** Server → Professional

**Event:** booking:updated
**Payload:** Updated booking object
**Direction:** Server → Both participants

## Rate Limiting

- Service operations: 30 requests per minute
- Availability updates: 60 requests per hour
- Message sending: 100 messages per hour per booking
- Earnings queries: 120 requests per hour

## Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "field": "field_name (for validation errors)",
    "details": {}
  }
}
```