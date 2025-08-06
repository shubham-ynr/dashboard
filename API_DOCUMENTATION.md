# User Management API Documentation

## Overview
This document describes the API endpoints for user management functionality in the admin dashboard.

## Base URL
All API endpoints are prefixed with `/api/admin/users`

## Authentication
All endpoints require authentication with a valid admin user session. Use the `auth:sanctum` middleware.

## Endpoints

### 1. Get Users (with search, filtering, and pagination)
**GET** `/api/admin/users`

**Query Parameters:**
- `search` (string, optional): Search term for username, email, first_name, last_name, or uid
- `status` (string, optional): Filter by status ('active', 'inactive', 'banned')
- `role` (string, optional): Filter by role ('admin', 'user')
- `verified` (string, optional): Filter by verification status ('true', 'false')
- `sort_by` (string, optional): Sort field ('id', 'username', 'email', 'role', 'status', 'created_at', 'updated_at')
- `sort_order` (string, optional): Sort order ('asc', 'desc')
- `per_page` (integer, optional): Items per page (1-100, default: 10)
- `page` (integer, optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uid": "uuid-string",
      "username": "AU12345678",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "admin",
      "status": "active",
      "isVerified": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "from": 1,
    "to": 10
  },
  "filters": {
    "search": "john",
    "status": "active",
    "role": "admin",
    "verified": "true",
    "sort_by": "created_at",
    "sort_order": "desc"
  }
}
```

### 2. Get User Statistics
**GET** `/api/admin/users/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 150,
    "active_users": 120,
    "inactive_users": 20,
    "banned_users": 10,
    "verified_users": 100,
    "unverified_users": 50,
    "admin_users": 5,
    "regular_users": 145
  }
}
```

### 3. Create User
**POST** `/api/admin/users`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "status": "active",
  "isVerified": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "uid": "uuid-string",
    "username": "CU12345678",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "isVerified": false,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 4. Get Specific User
**GET** `/api/admin/users/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uid": "uuid-string",
    "username": "AU12345678",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "isVerified": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 5. Update User
**PUT** `/api/admin/users/{id}`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "password": "newpassword123",
  "role": "admin",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "uid": "uuid-string",
    "username": "AU12345678",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "role": "admin",
    "status": "active",
    "isVerified": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 6. Delete User
**DELETE** `/api/admin/users/{id}`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 7. Update User Status
**PATCH** `/api/admin/users/{id}/status`

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": 1,
    "uid": "uuid-string",
    "username": "AU12345678",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "inactive",
    "isVerified": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 8. Update User Verification Status
**PATCH** `/api/admin/users/{id}/verify`

**Request Body:**
```json
{
  "isVerified": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User verification status updated successfully",
  "data": {
    "id": 1,
    "uid": "uuid-string",
    "username": "AU12345678",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "isVerified": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to create user",
  "error": "Database connection error"
}
```

## Frontend Integration

The frontend uses the `useUsers` hook from `@/hooks/use-users.js` which provides:

- `fetchUsers()` - Get users with filters and pagination
- `fetchUserStats()` - Get user statistics
- `createUser(userData)` - Create a new user
- `updateUser(id, userData)` - Update a user
- `deleteUser(id)` - Delete a user
- `updateUserStatus(id, status)` - Update user status
- `verifyUser(id, isVerified)` - Update verification status
- `getUser(id)` - Get a specific user

The hook also provides state management for:
- `users` - Array of users
- `loading` - Loading state
- `error` - Error state
- `pagination` - Pagination information
- `filters` - Current filters

## Usage Example

```javascript
import { useUsers } from '@/hooks/use-users';

function UserManager() {
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUserStatus
  } = useUsers();

  // Fetch users with search
  const handleSearch = (searchTerm) => {
    fetchUsers({ search: searchTerm });
  };

  // Update user status
  const handleStatusChange = async (userId, newStatus) => {
    const result = await updateUserStatus(userId, newStatus);
    if (result.success) {
      console.log('Status updated successfully');
    }
  };

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
}
``` 