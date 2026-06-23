# Milestone 2: User Application API Documentation

This document outlines the API requirements for the Customer/User application features.

## 1. Authentication & Profile
### POST `/auth/register`
Registers a new user or vendor.
**Request Body:**
```json
{
  "role": "user" | "vendor",
  "mobileNumber": "string",
  "fullName": "string", // If role is user
  "email": "string", // Optional
  "businessName": "string", // If role is vendor
  "ownerName": "string", // If role is vendor
  "city": "string",
  "area": "string",
  "address": "string"
}
```

### POST `/auth/login`
Initializes login via OTP.
**Request Body:**
```json
{
  "mobileNumber": "string"
}
```

### POST `/auth/verify-otp`
Verifies OTP and returns user details + JWT.
**Response Body:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "role": "user" | "vendor",
    "name": "string",
    "isProfileComplete": boolean
  }
}
```

---

## 2. Discovery (Home & Search)
### GET `/user/home`
Fetches data for the User Home Screen.
**Response:**
```json
{
  "banners": [
    { "id": "1", "title": "Offer", "image": "url", "action": "deeplink" }
  ],
  "categories": [
    { "id": "1", "name": "Banquet", "icon": "icon_name" }
  ],
  "featuredVendors": [
    { "id": "v1", "name": "Grand Hall", "rating": 4.5, "price": 100000, "image": "url" }
  ]
}
```

### GET `/vendors`
Search and filter vendors.
**Query Parameters:**
- `query`: string (Name/Category)
- `category`: string
- `city`: string
- `minPrice`: number
- `maxPrice`: number
- `rating`: number
- `capacity`: number
- `sortBy`: "price_low" | "price_high" | "rating"

---

## 3. Vendor Details & Interaction
### GET `/vendors/:id`
Get full details of a specific vendor.
**Response:**
```json
{
  "id": "v1",
  "name": "string",
  "description": "string",
  "gallery": ["url1", "url2"],
  "services": [
    { "name": "Main Hall", "price": 50000, "capacity": 500 }
  ],
  "reviews": [
    { "user": "Ankit", "rating": 5, "comment": "Great!", "date": "2023-10-01" }
  ],
  "contact": {
    "whatsapp": "number",
    "phone": "number"
  }
}
```

### POST `/leads/contact`
Tracks when a user attempts to contact a vendor (WhatsApp/Call).
**Request Body:**
```json
{
  "vendorId": "string",
  "type": "whatsapp" | "call"
}
```

### POST `/vendors/:id/reviews`
Submit a review for a vendor.
**Request Body:**
```json
{
  "rating": number (1-5),
  "comment": "string"
}
```

---

## 4. Comparison Feature
### GET `/vendors/compare`
Compare multiple vendors.
**Query Parameters:**
- `ids`: array of strings (e.g., `ids=v1,v2,v3`)
**Response:**
Returns a list of vendor objects with comparable fields (price, capacity, rating, services).
