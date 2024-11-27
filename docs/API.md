# API Documentation

This document outlines the API endpoints and data structures used in the Kusina Amadeo website.

## Authentication

### Login
```typescript
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": string,
  "password": string
}

Response:
{
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "role": "ADMIN" | "USER"
  }
}
```

### Logout
```typescript
POST /api/auth/logout

Response:
{
  "success": boolean
}
```

## Menu Management

### Get All Menu Items
```typescript
GET /api/menu
Query Parameters:
- category?: string
- search?: string
- page?: number
- limit?: number

Response:
{
  "items": Array<{
    "id": string,
    "name": string,
    "description": string,
    "price": number,
    "category": string,
    "image": string,
    "available": boolean
  }>,
  "total": number,
  "page": number,
  "totalPages": number
}
```

### Get Menu Item
```typescript
GET /api/menu/:id

Response:
{
  "id": string,
  "name": string,
  "description": string,
  "price": number,
  "category": string,
  "image": string,
  "available": boolean,
  "ingredients": Array<string>,
  "nutritionalInfo": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}
```

### Create Menu Item
```typescript
POST /api/menu
Content-Type: multipart/form-data

Request:
{
  "name": string,
  "description": string,
  "price": number,
  "category": string,
  "image": File,
  "available": boolean,
  "ingredients": Array<string>,
  "nutritionalInfo": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

Response:
{
  "id": string,
  "name": string,
  ...
}
```

### Update Menu Item
```typescript
PUT /api/menu/:id
Content-Type: multipart/form-data

Request:
{
  "name"?: string,
  "description"?: string,
  "price"?: number,
  "category"?: string,
  "image"?: File,
  "available"?: boolean,
  "ingredients"?: Array<string>,
  "nutritionalInfo"?: {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

Response:
{
  "id": string,
  "name": string,
  ...
}
```

### Delete Menu Item
```typescript
DELETE /api/menu/:id

Response:
{
  "success": boolean
}
```

## Category Management

### Get All Categories
```typescript
GET /api/categories

Response:
{
  "categories": Array<{
    "id": string,
    "name": string,
    "description": string,
    "itemCount": number
  }>
}
```

### Create Category
```typescript
POST /api/categories
Content-Type: application/json

Request:
{
  "name": string,
  "description": string
}

Response:
{
  "id": string,
  "name": string,
  "description": string
}
```

## Order Management

### Create Order
```typescript
POST /api/orders
Content-Type: application/json

Request:
{
  "items": Array<{
    "menuItemId": string,
    "quantity": number
  }>,
  "customerInfo": {
    "name": string,
    "email": string,
    "phone": string
  },
  "deliveryAddress"?: {
    "street": string,
    "city": string,
    "state": string,
    "zipCode": string
  }
}

Response:
{
  "orderId": string,
  "status": "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED",
  "total": number,
  "estimatedTime": number
}
```

### Get Order Status
```typescript
GET /api/orders/:id

Response:
{
  "orderId": string,
  "status": "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED",
  "items": Array<{
    "name": string,
    "quantity": number,
    "price": number
  }>,
  "total": number,
  "estimatedTime": number,
  "createdAt": string,
  "updatedAt": string
}
```

## Image Upload

### Upload Image
```typescript
POST /api/upload
Content-Type: multipart/form-data

Request:
{
  "image": File
}

Response:
{
  "url": string
}
```

## Error Responses

All API endpoints may return the following error responses:

```typescript
{
  "error": {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_ERROR`: Server error

## Authentication

All admin endpoints require authentication using a JWT token in the Authorization header:

```typescript
Authorization: Bearer <token>
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute

## Websocket Events

The following events are available through WebSocket connection:

```typescript
// Order status updates
{
  "type": "ORDER_UPDATE",
  "data": {
    "orderId": string,
    "status": string,
    "estimatedTime": number
  }
}

// Menu item availability updates
{
  "type": "MENU_UPDATE",
  "data": {
    "itemId": string,
    "available": boolean
  }
}
```

## Best Practices

1. **Error Handling**
   - Always check for error responses
   - Implement proper retry logic
   - Handle network errors gracefully

2. **Authentication**
   - Store tokens securely
   - Refresh tokens before expiry
   - Clear tokens on logout

3. **Performance**
   - Use pagination for large datasets
   - Implement caching where appropriate
   - Minimize payload sizes

4. **Security**
   - Validate all input data
   - Use HTTPS for all requests
   - Implement proper CORS policies
