# Master Build Blueprint
## Project: Service + Product Commerce Platform (Mobile-First)

---

## 1. Project Overview
A mobile-first web application designed for a rural mobile-services business to sell products (phones, accessories) and services (CCTV installation, GPS setup) with admin-driven workflows.

### Objectives
- Provide online presence
- Allow customers to browse products/services
- Request orders and services
- Enable admin approval and manual workflow
- Support future automation and roles

### Phase Strategy
**Phase 1 (MVP)**
- Product & Service listing
- Combos
- Order placement & manual approval
- Email OTP login
- Admin dashboard
- Support chat
- Notifications
- Mobile-first UX

**Phase 2 (Planned)**
- Online payments
- Referral system
- Dealer/Worker roles
- Scheduling & tracking
- Draft/Publish workflow
- Social login
- Inventory sync

---

## 2. Architecture
### Pattern
Modular Monolith

### Stack
Frontend:
- React (Vite)
- Tailwind CSS
- Headless UI
- Axios
- React Query

Backend:
- FastAPI
- Python 3.11+
- JWT Auth (HttpOnly Cookies)

Database:
- PostgreSQL

Storage:
- Cloudinary

Hosting:
- Frontend: Vercel
- Backend: Render
- DB: Render PostgreSQL

---

## 3. Authentication
- Email OTP login
- JWT stored in HttpOnly Secure Cookie
- Roles: customer, admin

Flow:
1. User requests OTP
2. Backend verifies OTP
3. JWT issued
4. Cookie set
5. Browser sends cookie automatically

---

## 4. Database Schema (Core Tables)

### users
id (uuid)
email
name
role
is_verified
created_at

### user_profiles
user_id
profile_image

### addresses
id
user_id
full_address
city
state
pincode
landmark

### categories
id
name
parent_id

### products
id
name
description
category_id
base_price
discount_price
is_active
is_published
created_at

### product_images
id
product_id
image_url
display_order
is_primary
created_at

### product_attributes
id
product_id
attribute_name
attribute_value

### services
id
name
description
base_price
is_active
is_published

### combos
id
name
description
price
banner_image
is_active
is_published

### combo_items
id
combo_id
item_type
item_id
quantity

### orders
id
user_id
status
total_price
address_id
notes
created_at

### order_items
id
order_id
item_type
item_id
quantity
price_snapshot

### order_status_history
id
order_id
status
updated_by
timestamp
notes

### wishlist
id
user_id
product_id
created_at

### support_tickets
id
user_id
order_id
status
created_at

### support_messages
id
ticket_id
sender_id
message
message_type
created_at

### banners
id
title
image_url
redirect_type
redirect_id
priority
start_date
end_date
is_active

### notifications
id
user_id (nullable)
title
message
type
is_read
created_at

---

## 5. API Endpoints (REST)

Auth:
POST /auth/request-otp
POST /auth/verify-otp
POST /auth/logout
GET /auth/me

Products:
GET /products
GET /products/{id}
POST /admin/products
PATCH /admin/products/{id}

Services:
GET /services
POST /admin/services

Combos:
GET /combos
POST /admin/combos

Orders:
POST /orders
GET /orders
GET /orders/{id}
PATCH /admin/orders/{id}/status

Support:
POST /support/tickets
GET /support/tickets
POST /support/messages

Notifications:
GET /notifications
PATCH /notifications/{id}/read

---

## 6. Frontend Structure

/src
  /pages
  /components
  /features
  /api
  /hooks
  /layouts

Customer Features:
- Landing page
- Search
- Categories
- Product details
- Wishlist
- Order history
- Support chat

Admin Features:
- Dashboard
- Product management
- Service management
- Combo management
- Orders
- Support panel
- Banner control
- Analytics summary

---

## 7. Deployment

Frontend:
- Vercel

Backend:
- Render (Docker optional)

Media:
- Cloudinary upload via signed requests

---

## 8. Phase 2 Roadmap
- Payments (split logic)
- Referral credits
- Worker assignment
- Live tracking
- Draft workflow
- Social login
- Inventory sync

---

## 9. Development Principles
- Mobile-first UI
- Manual workflows first
- No premature optimization
- Modular code structure
- Soft deletes (is_active / deleted_at)
- Store price snapshots

---

## 10. Success Criteria
- Admin can manage products & orders
- Customer can place requests
- Manual service workflow works
- Stable deployment

