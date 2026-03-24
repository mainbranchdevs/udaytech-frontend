# Udaya Tech E-Commerce Platform Documentation

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Authentication Flow](#authentication-flow)
5. [Referral System](#referral-system)
6. [Technical Flowcharts](#technical-flowcharts)
7. [API Endpoints](#api-endpoints)
8. [Missing Features & Recommendations](#missing-features--recommendations)

---

## Executive Summary

Udaya Tech is a **mobile-first e-commerce platform** designed for selling and installing technology products like GPS units and surveillance cameras. The platform operates with multiple user roles (Admin, Dealer, Worker, Customer) and includes a referral tracking system.

### Technology Stack
| Component | Technology |
|-----------|------------|
| **Frontend** | React + Vite + TypeScript + TailwindCSS |
| **Backend** | Hono.js (Cloudflare Workers) |
| **Database** | PostgreSQL with Prisma ORM |
| **Email Service** | Resend API |
| **Authentication** | Email OTP + JWT Tokens |
| **Hosting** | Netlify (Frontend) + Cloudflare Workers (Backend) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UDAYA TECH ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐     HTTPS/API      ┌─────────────────────────────────┐
│                     │◄──────────────────►│                                 │
│   MOBILE FRONTEND   │                    │    CLOUDFLARE WORKERS BACKEND   │
│   (React + Vite)    │                    │         (Hono.js)               │
│                     │                    │                                 │
│  • Login Page       │                    │  ┌─────────────────────────┐   │
│  • Registration     │                    │  │   API Routes            │   │
│  • Dealer Dashboard │                    │  │   /api/v1/auth/*        │   │
│  • Request Creation │                    │  │   /api/v1/person/*      │   │
│  • Referral Links   │                    │  └─────────────────────────┘   │
│                     │                    │              │                  │
└─────────────────────┘                    │              ▼                  │
         │                                 │  ┌─────────────────────────┐   │
         │                                 │  │   Middleware            │   │
         │                                 │  │   • CORS                │   │
         │                                 │  │   • JWT Auth            │   │
         │                                 │  └─────────────────────────┘   │
         │                                 │              │                  │
         ▼                                 │              ▼                  │
┌─────────────────────┐                    │  ┌─────────────────────────┐   │
│   NETLIFY HOSTING   │                    │  │   Services              │   │
│   udayatech.app     │                    │  │   • Auth Service        │   │
└─────────────────────┘                    │  │   • Person Service      │   │
                                           │  └─────────────────────────┘   │
                                           │              │                  │
                                           └──────────────┼──────────────────┘
                                                          │
                                                          ▼
                                           ┌─────────────────────────────────┐
                                           │        POSTGRESQL DATABASE      │
                                           │         (via Prisma ORM)        │
                                           │                                 │
                                           │  Tables:                        │
                                           │  • Person (users)               │
                                           │  • PersonType (roles)           │
                                           │  • OTP (verification)           │
                                           └─────────────────────────────────┘
                                                          │
                                                          ▼
                                           ┌─────────────────────────────────┐
                                           │         RESEND EMAIL API        │
                                           │        (OTP Delivery)           │
                                           └─────────────────────────────────┘
```

---

## User Roles & Permissions

### Role Hierarchy

```
                    ┌───────────────┐
                    │     ADMIN     │  (PersonType ID: 1)
                    │  Full Access  │
                    └───────┬───────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │    DEALER     │ │  SALES GUY*   │ │   MANAGER*    │
    │ (ID: 2)       │ │ (Planned)     │ │  (Planned)    │
    │ Refers others │ │ Intermediary  │ │ Oversight     │
    └───────┬───────┘ └───────────────┘ └───────────────┘
            │
            ▼
    ┌───────────────┐         ┌───────────────┐
    │    WORKER     │◄───────►│   CUSTOMER    │
    │ (ID: 3)       │         │   (ID: 4)     │
    │ Installation  │         │ End User      │
    └───────────────┘         └───────────────┘

    * = Not yet implemented in codebase
```

### Role Details

| Role | ID | Description | Current Capabilities |
|------|-----|-------------|---------------------|
| **Admin** | 1 | Platform administrator | Full system access (dashboard in development) |
| **Dealer** | 2 | Sales partner | Onboard customers, generate referrals, create service requests |
| **Worker** | 3 | Field technician | Perform installations (dashboard in development) |
| **Customer** | 4 | End user | Browse & purchase products (shopping features in development) |
| **New** | 5 | Unregistered | Temporary state during registration |

---

## Authentication Flow

### Complete Login/Registration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────────┘

    USER                    FRONTEND                   BACKEND                DATABASE
      │                        │                          │                       │
      │   1. Enter Email       │                          │                       │
      ├───────────────────────►│                          │                       │
      │                        │  2. POST /auth/send-otp  │                       │
      │                        ├─────────────────────────►│                       │
      │                        │                          │  3. Generate 6-digit  │
      │                        │                          │     OTP + Hash it     │
      │                        │                          │  4. Upsert OTP record │
      │                        │                          ├──────────────────────►│
      │                        │                          │                       │
      │                        │                          │  5. Send OTP via      │
      │                        │                          │     Resend Email API  │
      │                        │                          ├──────────────────────►│ EMAIL
      │                        │◄─────────────────────────┤                       │
      │   6. Show OTP Input    │                          │                       │
      │◄───────────────────────┤                          │                       │
      │                        │                          │                       │
      │   7. Enter OTP         │                          │                       │
      ├───────────────────────►│                          │                       │
      │                        │ 8. POST /auth/verify-otp │                       │
      │                        ├─────────────────────────►│                       │
      │                        │                          │  9. Verify OTP hash   │
      │                        │                          ├──────────────────────►│
      │                        │                          │◄──────────────────────┤
      │                        │                          │                       │
      │                        │                          │  10. Check if Person  │
      │                        │                          │      exists by email  │
      │                        │                          ├──────────────────────►│
      │                        │                          │◄──────────────────────┤
      │                        │                          │                       │
      │                        │                          │  11. Generate JWT     │
      │                        │                          │      with user data   │
      │                        │◄─────────────────────────┤      or "NEW" type    │
      │                        │                          │                       │
      │                        │  12. Decode JWT to get   │                       │
      │                        │      PersonType ID       │                       │
      │                        │                          │                       │
      │                        │  13. Route based on ID:  │                       │
      │                        │      ID=5 → /register    │                       │
      │                        │      ID=1 → /admin       │                       │
      │                        │      ID=2 → /dealer      │                       │
      │                        │      ID=3 → /worker      │                       │
      │                        │      ID=4 → /customer    │                       │
      │◄───────────────────────┤                          │                       │
      │  14. Redirect to       │                          │                       │
      │      appropriate page  │                          │                       │
      │                        │                          │                       │
```

### Registration Flow (New Users)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        REGISTRATION FLOW (NEW USERS)                        │
└─────────────────────────────────────────────────────────────────────────────┘

    NEW USER                FRONTEND                   BACKEND                DATABASE
      │                        │                          │                       │
      │  1. Clicks referral    │                          │                       │
      │     link with params:  │                          │                       │
      │     ?requestType=XX    │                          │                       │
      │     &referralCode=YY   │                          │                       │
      ├───────────────────────►│                          │                       │
      │                        │                          │                       │
      │                        │  2. Store referralCode   │                       │
      │                        │     & requestType in     │                       │
      │                        │     sessionStorage       │                       │
      │                        │                          │                       │
      │  3. Complete OTP flow  │                          │                       │
      │     (see above)        │                          │                       │
      │                        │                          │                       │
      │  4. Redirected to      │                          │                       │
      │     /register page     │                          │                       │
      │◄───────────────────────┤                          │                       │
      │                        │                          │                       │
      │  5. Fill form:         │                          │                       │
      │     Step 1:            │                          │                       │
      │     - First Name       │                          │                       │
      │     - Last Name        │                          │                       │
      │     - Date of Birth    │                          │                       │
      │     - Gender           │                          │                       │
      │                        │                          │                       │
      │     Step 2:            │                          │                       │
      │     - Phone Number     │                          │                       │
      │     - Address          │                          │                       │
      │     - Referral Code    │                          │                       │
      ├───────────────────────►│                          │                       │
      │                        │                          │                       │
      │                        │ 6. POST /person/create   │                       │
      │                        │    with JWT (auth)       │                       │
      │                        ├─────────────────────────►│                       │
      │                        │                          │                       │
      │                        │                          │  7. Validate JWT      │
      │                        │                          │     via middleware    │
      │                        │                          │                       │
      │                        │                          │  8. Determine role    │
      │                        │                          │     from requestType  │
      │                        │                          │     (dealer/customer) │
      │                        │                          │                       │
      │                        │                          │  9. Look up referrer  │
      │                        │                          │     by referralCode   │
      │                        │                          ├──────────────────────►│
      │                        │                          │◄──────────────────────┤
      │                        │                          │                       │
      │                        │                          │ 10. Generate unique   │
      │                        │                          │     referral code     │
      │                        │                          │     for new user      │
      │                        │                          │                       │
      │                        │                          │ 11. Create Person     │
      │                        │                          │     with referrer ID  │
      │                        │                          ├──────────────────────►│
      │                        │                          │◄──────────────────────┤
      │                        │                          │                       │
      │                        │◄─────────────────────────┤                       │
      │  12. Redirect to       │                          │                       │
      │      /thank-you page   │                          │                       │
      │◄───────────────────────┤                          │                       │
      │                        │                          │                       │
      │  13. See own referral  │                          │                       │
      │      links to share    │                          │                       │
      │                        │                          │                       │
```

---

## Referral System

### How Referrals Work

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REFERRAL SYSTEM FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

  EXISTING USER (Dealer)                              NEW USER
        │                                                │
        │  1. Goes to /thank-you page                    │
        │     after registration                         │
        │                                                │
        │  2. Copies referral link:                      │
        │     https://udayatech.netlify.app/register     │
        │     ?requestType=ZGVhbGVy (base64: "dealer")   │
        │     &referralCode=ABC123                       │
        │                                                │
        │  3. Shares link via WhatsApp/SMS/etc           │
        ├───────────────────────────────────────────────►│
        │                                                │
        │                                                │  4. Clicks link
        │                                                │
        │                                                │  5. Frontend extracts:
        │                                                │     - requestType → determines
        │                                                │       if user becomes dealer
        │                                                │       or customer
        │                                                │     - referralCode → links
        │                                                │       back to referrer
        │                                                │
        │                                                │  6. Completes registration
        │                                                │
        │                                                │  7. New Person record created:
        │                                                │     - referrerId = ABC123's owner ID
        │                                                │     - personTypeId = based on requestType
        │                                                │     - referralCode = NEW_CODE (auto-generated)
        │                                                │
        │◄───────────────────────────────────────────────┤
        │  8. Referral tracked in database               │
        │     (Person.referrerId relationship)           │
        │                                                │

┌─────────────────────────────────────────────────────────────────────────────┐
│                         REFERRAL CODE EXAMPLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dealer Referral Link:                                                      │
│  https://udayatech.netlify.app/register?requestType=ZGVhbGVy&referralCode=  │
│  XYZ789                                                                     │
│                                                                             │
│  Customer Referral Link:                                                    │
│  https://udayatech.netlify.app/register?requestType=Y3VzdG9tZXI=&referralCode=│
│  XYZ789                                                                     │
│                                                                             │
│  Where:                                                                     │
│    ZGVhbGVy = Base64("dealer")                                              │
│    Y3VzdG9tZXI= = Base64("customer")                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│       Person           │         │      PersonType        │
├────────────────────────┤         ├────────────────────────┤
│ id (UUID)         PK   │    ┌───►│ id (INT)          PK   │
│ phoneN (unique)        │    │    │ name (PersonRole)      │
│ personTypeId      FK ──┼────┘    │ description            │
│ name                   │         │ createdAt              │
│ email (unique)         │         └────────────────────────┘
│ address                │
│ dob                    │
│ sex                    │         ┌────────────────────────┐
│ aadhar (optional)      │         │         OTP            │
│ profilePic (optional)  │         ├────────────────────────┤
│ status (enum)          │         │ id (UUID)         PK   │
│ statusReason           │         │ email (unique)         │
│ referralCode           │         │ otp (hashed)           │
│ referrerId        FK ──┼────┐    │ expiresAt              │
│ createdAt              │    │    │ createdAt              │
│ updatedAt              │    │    └────────────────────────┘
└────────────────────────┘    │
         ▲                    │
         │                    │
         └────────────────────┘
           Self-referential
           (Person can refer
            other Persons)
```

---

## API Endpoints

### Currently Implemented

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/health` | No | Health check endpoint |
| POST | `/api/v1/auth/send-otp` | No | Send OTP to email |
| POST | `/api/v1/auth/verify-otp` | No | Verify OTP and get JWT |
| POST | `/api/v1/person/create-person` | Yes (JWT) | Create new person record |

### Request/Response Examples

**Send OTP:**
```json
// POST /api/v1/auth/send-otp
// Request:
{ "email": "user@example.com" }

// Response:
true
```

**Verify OTP:**
```json
// POST /api/v1/auth/verify-otp
// Request:
{
  "email": "user@example.com",
  "otp": "123456",
  "requestType": "dealer"  // optional, for new users
}

// Response (existing user):
{
  "message": "OTP verified successfully",
  "token": "eyJhbG..."  // JWT containing user data
}

// Response (new user):
{
  "message": "OTP verified successfully",
  "token": "eyJhbG..."  // JWT with personType.id = 5 (NEW)
}
```

**Create Person:**
```json
// POST /api/v1/person/create-person
// Headers: Authorization: Bearer <token>
// Request:
{
  "name": "John Doe",
  "phoneN": "9876543210",
  "dob": "1990-01-15T00:00:00.000Z",
  "sex": "male",
  "address": "123 Main St, City",
  "referredCode": "ABC123"  // optional
}

// Response:
{
  "id": "uuid-here",
  "phoneN": "9876543210",
  "personTypeId": 2,
  "name": "John Doe",
  "email": "user@example.com",
  "address": "123 Main St, City",
  "referralCode": "XYZ789",
  "referrerId": "referrer-uuid",
  // ... other fields
}
```

---

## Missing Features & Recommendations

### Critical Missing Features

| Priority | Feature | Status | Impact |
|----------|---------|--------|--------|
| 🔴 **HIGH** | Product Catalog | Not Built | No products to browse/purchase |
| 🔴 **HIGH** | Shopping Cart | Not Built | Cannot add items to cart |
| 🔴 **HIGH** | Payment Integration | Not Built | Cannot process purchases |
| 🔴 **HIGH** | Admin Dashboard | Stub Only | Admin cannot manage anything |
| 🟡 **MEDIUM** | Sales Guy Role | Not in Schema | Missing intermediary role |
| 🟡 **MEDIUM** | Order Management | Not Built | Cannot track orders |
| 🟡 **MEDIUM** | Worker Assignment | Not Built | Cannot assign installations |
| 🟡 **MEDIUM** | Banner Management | Not Built | Cannot upload promotional banners |
| 🟢 **LOW** | Notification System | Not Built | No push/email notifications |
| 🟢 **LOW** | Analytics Dashboard | Not Built | No business insights |

### Detailed Gap Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FEATURE COMPLETION STATUS                                │
└─────────────────────────────────────────────────────────────────────────────┘

AUTHENTICATION & USERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[████████████████████] 100%  Email OTP Login
[████████████████████] 100%  User Registration
[████████████████████] 100%  JWT Authentication
[████████████████████] 100%  Role-based Routing
[████████░░░░░░░░░░░░]  40%  Role Dashboards (UI exists, functionality missing)
[░░░░░░░░░░░░░░░░░░░░]   0%  Sales Guy Role

REFERRAL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[████████████████████] 100%  Referral Code Generation
[████████████████████] 100%  Referral Link Generation
[████████████████████] 100%  Referrer Tracking
[░░░░░░░░░░░░░░░░░░░░]   0%  Referral Analytics/Reports
[░░░░░░░░░░░░░░░░░░░░]   0%  Commission Tracking

E-COMMERCE FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[░░░░░░░░░░░░░░░░░░░░]   0%  Product Catalog
[░░░░░░░░░░░░░░░░░░░░]   0%  Product Categories
[░░░░░░░░░░░░░░░░░░░░]   0%  Pricing Management
[░░░░░░░░░░░░░░░░░░░░]   0%  Shopping Cart
[░░░░░░░░░░░░░░░░░░░░]   0%  Checkout Flow
[░░░░░░░░░░░░░░░░░░░░]   0%  Payment Gateway
[░░░░░░░░░░░░░░░░░░░░]   0%  Order Tracking

ADMIN FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[░░░░░░░░░░░░░░░░░░░░]   0%  Add/Edit Products
[░░░░░░░░░░░░░░░░░░░░]   0%  Set Pricing
[░░░░░░░░░░░░░░░░░░░░]   0%  Upload Banners
[░░░░░░░░░░░░░░░░░░░░]   0%  Manage Roles
[░░░░░░░░░░░░░░░░░░░░]   0%  View Reports

SERVICE REQUESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[████████░░░░░░░░░░░░]  40%  Create Request UI (exists, no backend)
[░░░░░░░░░░░░░░░░░░░░]   0%  Request API Endpoints
[░░░░░░░░░░░░░░░░░░░░]   0%  Worker Assignment
[░░░░░░░░░░░░░░░░░░░░]   0%  Status Tracking
[░░░░░░░░░░░░░░░░░░░░]   0%  Completion Workflow
```

### Recommended Database Schema Additions

```sql
-- Products Table (needed)
CREATE TABLE Product (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    categoryId INT REFERENCES Category(id),
    imageUrls TEXT[],
    status VARCHAR DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP
);

-- Categories Table (needed)
CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    parentId INT REFERENCES Category(id)
);

-- Orders Table (needed)
CREATE TABLE Order (
    id UUID PRIMARY KEY,
    customerId UUID REFERENCES Person(id),
    dealerId UUID REFERENCES Person(id),
    totalAmount DECIMAL NOT NULL,
    status VARCHAR DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Order Items Table (needed)
CREATE TABLE OrderItem (
    id UUID PRIMARY KEY,
    orderId UUID REFERENCES Order(id),
    productId UUID REFERENCES Product(id),
    quantity INT NOT NULL,
    unitPrice DECIMAL NOT NULL
);

-- Service Requests Table (needed)
CREATE TABLE ServiceRequest (
    id UUID PRIMARY KEY,
    orderId UUID REFERENCES Order(id),
    workerId UUID REFERENCES Person(id),
    scheduledDate TIMESTAMP,
    location TEXT,
    status VARCHAR DEFAULT 'pending',
    notes TEXT,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Banners Table (needed)
CREATE TABLE Banner (
    id UUID PRIMARY KEY,
    imageUrl TEXT NOT NULL,
    linkUrl TEXT,
    position INT,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW()
);
```

### Security Recommendations

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Hardcoded JWT Secret | 🔴 HIGH | Move `'my-secret'` to environment variable |
| No Rate Limiting | 🟡 MEDIUM | Add rate limiting on OTP endpoints |
| No Input Validation | 🟡 MEDIUM | Add Zod/validation schemas |
| Plain Aadhar Storage | 🔴 HIGH | Encrypt sensitive Aadhar data |
| No HTTPS Check | 🟢 LOW | Force HTTPS in production |

---

## Frontend Routes Summary

| Route | Component | Role Required | Status |
|-------|-----------|---------------|--------|
| `/` | Login | None | ✅ Working |
| `/register` | Register | NEW (ID: 5) | ✅ Working |
| `/dealer` | Dealer | Dealer (ID: 2) | ⚠️ Static UI |
| `/customer` | Dealer* | Customer (ID: 4) | ⚠️ Redirects to same |
| `/worker` | Dealer* | Worker (ID: 3) | ⚠️ Redirects to same |
| `/admin` | Dealer* | Admin (ID: 1) | ⚠️ Redirects to same |
| `/create-request` | CreateRequest | Any logged in | ⚠️ UI only, no backend |
| `/thank-you` | ThankYou | Any logged in | ✅ Working |

*Note: All role dashboards currently use the same Dealer component placeholder.

---

## Next Steps Recommendation

### Phase 1: Core E-Commerce (Immediate)
1. Design and implement Product/Category schema
2. Build product listing API
3. Create product browsing UI
4. Implement shopping cart (client-side first)

### Phase 2: Order & Payment (Short-term)
1. Design Order/OrderItem schema
2. Integrate payment gateway (Razorpay/Stripe)
3. Build checkout flow
4. Implement order confirmation

### Phase 3: Service Fulfillment (Medium-term)
1. Design ServiceRequest schema
2. Build worker assignment system
3. Create worker mobile interface
4. Implement status tracking

### Phase 4: Admin Portal (Medium-term)
1. Build admin dashboard
2. Product management CRUD
3. User management
4. Banner management
5. Basic analytics

---

*Document generated from codebase analysis on January 29, 2026*
