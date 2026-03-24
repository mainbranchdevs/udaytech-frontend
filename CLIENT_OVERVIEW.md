# Udaya Tech Platform - Client Overview
### A Simple Guide to How Your Platform Works

---

## What is Udaya Tech?

Udaya Tech is a **mobile shopping app** designed for selling and installing technology products like GPS tracking devices and security cameras. Think of it as your own mini-Amazon, but specifically built for your business and optimized for phone users.

---

## The People Who Use Your Platform

Your platform has **five types of users**, each with their own role:

### 1. Admin (You)
**What they do:** The boss of the platform. Controls everything.

- Add new products to sell
- Set prices
- Upload promotional banners
- Add new dealers, workers, and managers
- See reports and analytics

**Current Status:** The login works, but the admin dashboard features are still being built.

---

### 2. Dealer (Your Sales Partners)

**What they do:** Like your franchise partners. They bring in customers and earn through referrals.

- Log into their own dashboard
- See their performance (total referrals, completed sales, pending orders)
- Generate special referral links to share with others
- Create service requests for their customers
- Track the status of installations

**How they earn:** When a dealer shares their referral link and someone signs up, that person is linked to them permanently. This can be used for commission tracking.

**Current Status:** Basic dashboard exists with referral link generation working.

---

### 3. Sales Guy (Coming Soon)

**What they do:** The middleman between dealers and workers.

- Coordinate between dealers who bring orders and workers who install products
- Manage scheduling
- Handle customer communication

**Current Status:** Not yet built. This role is planned for a future phase.

---

### 4. Worker (Installation Technicians)

**What they do:** The people who go to customers' homes/offices to install GPS units and cameras.

- See their assigned jobs
- View customer location and contact details
- Mark installations as complete
- Report any issues

**Current Status:** Login works, but the worker-specific dashboard is still placeholder.

---

### 5. Customer (End Users)

**What they do:** The people who buy your products.

- Browse product catalog
- Add items to cart
- Make purchases
- Schedule installation appointments
- Track their orders

**Current Status:** Login works, but the shopping features are not yet built.

---

## How Does Login Work?

Your platform uses a **simple and secure login system** - no passwords needed!

```
Step 1: User enters their email address
          ↓
Step 2: System sends a 6-digit code to their email
          ↓
Step 3: User enters the code
          ↓
Step 4: System checks if they're already registered:
        
        - If YES: Takes them to their dashboard
          (Admin dashboard, Dealer dashboard, etc.)
          
        - If NO: Takes them to the registration form
```

**Why no passwords?**
- More secure (no passwords to steal or forget)
- Easier for users (just check email)
- Works great on mobile phones

---

## The Referral System - How It Works

This is one of the most powerful features of your platform. Here's how it works in simple terms:

### The Story of a Referral

```
1. DEALER RANI signs up on your platform
   → She gets her own unique code: "RANI23"

2. Rani goes to her "Thank You" page
   → She sees two links she can share:
   
   DEALER LINK: "Invite someone to become a dealer like me"
   CUSTOMER LINK: "Invite someone to become a customer"

3. Rani shares the CUSTOMER LINK with her friend RAHUL via WhatsApp

4. RAHUL clicks the link and signs up
   → The system automatically knows:
   - Rahul should be a "Customer" (not a dealer)
   - Rahul was referred by Rani
   - This connection is saved forever

5. Later, you can see reports showing:
   - Rani referred Rahul
   - Rani referred 15 customers total
   - 8 of those customers made purchases
```

### Why This Matters for Your Business

- **Track who brings business:** Know which dealers are most effective
- **Pay commissions fairly:** Clear records of who referred whom
- **Grow organically:** Your dealers become your marketing team
- **Build networks:** Dealers can also recruit other dealers

---

## What the App Looks Like (Current Screens)

### Screen 1: Login Page
- Clean mobile design
- Enter email, get code, verify
- Branded with Udaya Tech logo

### Screen 2: Registration Form
- Two-step process for new users
- Collects: Name, Date of Birth, Gender, Phone, Address
- Auto-fills referral code if they clicked a referral link

### Screen 3: Dealer Dashboard
- Shows stats: Total orders, Completed, Pending
- List of recent referrals with status
- Bottom navigation: Home, Create Request, Referral List, Profile

### Screen 4: Create Service Request
- Form for dealers to submit new customer orders
- Fields: Customer name, phone, location, service type, date/time, notes

### Screen 5: Thank You / Referral Page
- Welcome message after registration
- Shows both referral links (dealer and customer)
- Easy "Copy" buttons to share links

---

## What's Working Today

| Feature | Status | Notes |
|---------|--------|-------|
| Email + OTP Login | ✅ Working | Users can sign in securely |
| User Registration | ✅ Working | New users can create accounts |
| Role-based Access | ✅ Working | Different users see different dashboards |
| Referral Link Generation | ✅ Working | Users can create and share links |
| Referral Tracking | ✅ Working | System knows who referred whom |
| Mobile-First Design | ✅ Working | Looks great on phones |

---

## What's Still Being Built

| Feature | Priority | Description |
|---------|----------|-------------|
| Product Catalog | HIGH | The actual list of GPS units and cameras |
| Shopping Cart | HIGH | Ability to add items and checkout |
| Payment System | HIGH | Process payments (Razorpay, etc.) |
| Admin Dashboard | HIGH | Your control panel for everything |
| Order Tracking | MEDIUM | See where orders are in the process |
| Worker App | MEDIUM | For technicians to see their jobs |
| Notifications | LOW | Push alerts and email updates |
| Reports | LOW | Business analytics and insights |

---

## How Everything Connects

```
                           ┌─────────────────┐
                           │    CUSTOMER     │
                           │  Buys products  │
                           └────────┬────────┘
                                    │ orders from
                                    ▼
┌─────────────┐  refers   ┌─────────────────┐  assigns job  ┌─────────────┐
│   DEALER    │◄─────────►│    PLATFORM     │──────────────►│   WORKER    │
│ Brings      │           │   (Your App)    │               │ Installs    │
│ customers   │           │                 │               │ products    │
└─────────────┘           └────────┬────────┘               └─────────────┘
                                   │
                                   │ managed by
                                   ▼
                          ┌─────────────────┐
                          │     ADMIN       │
                          │  Controls all   │
                          └─────────────────┘
```

---

## Questions You Might Have

### "Can dealers see each other's customers?"
No. Each dealer only sees their own referrals and stats. Privacy is maintained.

### "What if someone registers without a referral link?"
They get linked to a system default referrer (code: "SYS45"). You can track these separately.

### "Can a customer become a dealer later?"
This would require some admin action currently. The system is designed to be flexible for this.

### "How do payments work?"
Payment integration is planned but not yet built. This will connect to services like Razorpay or Stripe.

### "Is the data secure?"
- Passwords: None stored (OTP system is safer)
- User data: Stored in secure PostgreSQL database
- Connections: All encrypted (HTTPS)
- Recommendations: Some security improvements are needed for sensitive data like Aadhar numbers

---

## Summary

Your Udaya Tech platform is a **solid foundation** with:
- ✅ Working login system
- ✅ User role management
- ✅ Referral tracking
- ✅ Mobile-friendly design

To become a complete e-commerce platform, the main additions needed are:
- Product catalog and shopping cart
- Payment processing
- Admin management tools
- Order and installation tracking

The architecture is well-designed to support these additions without major changes to what's already built.

---

*This document explains your platform in simple terms. For technical details, see PLATFORM_DOCUMENTATION.md*
