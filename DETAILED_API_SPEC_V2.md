# Subhdin: Milestone 2 - Detailed API Specification & Integration Guide

This document defines the API endpoints and data structures required for the Subhdin Mobile Application (both User and Vendor flows).

---

## 1. Authentication Module

### POST `/auth/request-otp`
Sends a 6-digit OTP to the mobile number.
- **Body:** `{ "phone": "+919876543210" }`
- **Response:** `{ "message": "OTP sent successfully" }`

### POST `/auth/verify-otp`
Verifies OTP and performs Registration or Login.
- **Body:**
  ```json
  {
    "phone": "+919876543210",
    "code": "123456",
    "role": "user", // "user" or "vendor"
    // Registration Fields (if new user)
    "fullName": "Ankit Sharma", // Required for user
    "email": "ankit@example.com",
    "businessName": "...", // Required for vendor
    "ownerName": "...", // Required for vendor
    "city": "Jaipur",
    "area": "Malviya Nagar"
  }
  ```
- **Response:**
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "role": "user",
      "name": "Ankit Sharma",
      "isProfileComplete": true
    }
  }
  ```

---

## 2. Vendor Module (Protected)

### GET `/vendor/me`
Fetch current vendor profile.

### PUT `/vendor/me`
Update vendor profile (Owner Name, Email, Address, City, Area, etc.).

### GET `/vendor/dashboard`
Returns aggregated analytics.
```json
{
  "totalServices": 5,
  "totalOffers": 2,
  "activeOffers": 1,
  "totalViews": 1240,
  "totalContactReveals": 45,
  "totalWhatsappClicks": 30,
  "totalLeads": 15
}
```

### Services Management (`/vendor/services`)
- **GET:** List all services.
- **POST:** Create service (Name, Category, Price, Capacity, Gallery, Highlights).
- **PATCH `/:id`:** Update specific service.
- **DELETE `/:id`:** Remove service.

### Offers Management (`/vendor/offers`)
- **GET:** List all offers.
- **POST:** Create offer (Title, Description, Discount%, StartDate, EndDate).
- **PATCH `/:id`:** Update/Toggle active state.

---

## 3. Customer Discovery Module

### GET `/customer/home`
Fetch banners, categories, and featured vendors for the home screen.
- **Query:** `city`
- **Response:** `{ "banners": [], "categories": [], "featuredVendors": [] }`

### GET `/vendors`
Search and filter vendors.
- **Query Params:** `q`, `category`, `city`, `minPrice`, `maxPrice`, `minRating`, `capacity`, `sort`.

### GET `/vendors/:id`
Full details of a vendor including gallery, pricing, and reviews.

---

## 4. Analytics & Leads

### POST `/analytics/events`
Track user interactions.
- **Body:**
  ```json
  {
    "vendorId": "uuid",
    "type": "VIEW" | "CONTACT_REVEAL" | "WHATSAPP_CLICK" | "LEAD",
    "source": "mobile",
    "metadata": {}
  }
  ```

---

## 5. Uploads

### GET `/uploads/signature`
Returns Cloudinary signed upload parameters.
- **Response:** `{ "signature": "...", "timestamp": 123456, "publicId": "...", "apiKey": "..." }`

---

## Error Codes
- `401 Unauthorized`: Token missing or expired.
- `400 Bad Request`: Validation failure.
- `403 Forbidden`: Role mismatch.
- `429 Too Many Requests`: OTP Rate limiting.
