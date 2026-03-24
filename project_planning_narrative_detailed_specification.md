# Project Planning Narrative & Detailed Specification

## 1. Origin Story
This project began from a real-world need: a small mobile services shop operating in a rural area wanted to expand its reach beyond physical walk-in customers. The business provides mobile sales, accessories, CCTV installation, GPS setup, and related services. The primary challenge was visibility, service coordination, and customer reach.

The goal evolved into creating a mobile-first web application that functions as a hybrid between an e-commerce platform and a service booking system — similar in spirit to Flipkart or Amazon but tailored for local services.

The planning process emphasized simplicity first, scalability later, and strong administrative control during early adoption.

---

## 2. Product Vision

### Core Goals
- Establish online presence
- Allow customers to browse products and service bundles
- Enable service request workflows
- Provide admin-controlled operations
- Gradually automate business processes

### Guiding Principles
- Deliver MVP fast
- Avoid premature optimization
- Manual workflows before automation
- Mobile-first customer experience
- Expand through phases

---

## 3. Phase Strategy

### Phase 1 — MVP
- Static landing page with categories
- Product & service browsing
- Combo packages
- Order placement (request-based)
- Manual admin approval
- Email OTP authentication
- Admin dashboard
- Support chat
- Notifications
- Wishlist

### Phase 2 — Expansion
- Online payments (split payments for services)
- Referral system
- Dealer & worker roles
- Scheduling & assignment
- Draft/publish workflow
- Social login
- Inventory integration
- Live tracking

---

## 4. Architecture Decisions

### Architecture Pattern
Modular Monolith

Rationale:
- Faster development
- Lower operational complexity
- Easy future extraction into microservices

### Tech Stack
Frontend:
- React (SPA)
- Tailwind CSS
- Headless UI

Backend:
- FastAPI (Python)

Database:
- PostgreSQL

Storage:
- Cloudinary

Hosting:
- Vercel (frontend)
- Render (backend & database)

---

## 5. Authentication Design

Chosen Approach:
JWT authentication stored in HttpOnly secure cookies.

Reasoning:
- SPA compatibility
- Secure against XSS
- Scalable
- Mobile-app ready

Flow:
1. User requests OTP
2. OTP verified
3. JWT issued
4. Cookie set
5. Browser auto-authenticates

Roles:
- Customer
- Admin

---

## 6. Mobile-First UX Strategy

Customer UI optimized for mobile browsers:
- Browse without login
- Login required for actions
- Wishlist
- Order history
- Support interaction

Admin UI optimized for desktop but responsive.

---

## 7. Database Philosophy

Principles:
- Normalize repeating data
- Use flexible attributes
- Store historical snapshots
- Avoid destructive deletes

### Dynamic Product Attributes
Different products have different specs; therefore:
- Attributes stored as key-value pairs

### Product Images
Multiple images per product supported through separate table.

### Orders
Includes status history tracking for timeline view.

---

## 8. Services Modeling

Services treated differently from products because they require contextual metadata such as installation notes and coordination.

Design remains open-ended to allow future service-specific workflows.

---

## 9. Admin Portal Capabilities

Phase 1 Admin Controls:
- Product management
- Service management
- Combo creation
- Order approval
- Status updates
- Banner promotions
- Support responses
- Basic analytics

---

## 10. Customer Experience Flow

1. Visit landing page
2. Browse categories
3. View product/service
4. Login via OTP
5. Place order request
6. Receive status updates
7. Communicate via support

---

## 11. Media Storage Decision

Cloudinary selected because:
- Free tier suitable for MVP
- Built-in CDN
- Automatic image optimization
- No DevOps overhead

Migration path exists to S3 later if needed.

---

## 12. Deployment Strategy

Frontend:
- Hosted on Vercel

Backend:
- Hosted on Render

Database:
- Managed PostgreSQL on Render

Goal:
Phase 1 infrastructure cost ≈ ₹0/month.

---

## 13. Development Workflow

Order of Implementation:
1. Backend foundation
2. Authentication
3. Core models
4. Admin APIs
5. Customer APIs
6. Support system
7. Notifications
8. Frontend integration

---

## 14. Long-Term Scalability

Future evolution:
- Payments integration
- Worker tracking
- Automation
- Analytics
- Microservice extraction if scale demands

---

## 15. Design Philosophy Summary

This system is intentionally designed to:
- Start simple
- Grow intelligently
- Support business reality
- Minimize operational cost
- Enable gradual sophistication

The planning process prioritized clarity, flexibility, and maintainability over complexity.

---

## 16. Conclusion

The project evolved from a vague business idea into a structured production-ready architecture through iterative questioning, refinement, and phased decision-making. The resulting blueprint balances practicality with scalability and is ready for AI-assisted implementation.

