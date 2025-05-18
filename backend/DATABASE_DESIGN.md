# MongoDB Database Design for Live Event Map

## Collections

### Users
- **_id**: ObjectId (Primary Key)
- **username**: String (unique)
- **firstName**: String
- **lastName**: String
- **email**: String (unique)
- **phone**: String (unique)
- **password**: String (hashed)
- **about**: String (optional)
- **avatarUrl**: String (optional)
- **coverImageUrl**: String (optional)
- **isAdmin**: Boolean
- **createdAt**: Date
- **updatedAt**: Date

### Events
- **_id**: ObjectId (Primary Key)
- **title**: String
- **description**: String
- **date**: Date
- **category**: String
- **price**: Number
- **imageUrl**: String
- **location**: String
- **organizer**: ObjectId (Reference to Users)
- **createdAt**: Date
- **updatedAt**: Date

## Optional Enhanced Collections (Future Implementation)

### EventAttendees
- **_id**: ObjectId (Primary Key)
- **eventId**: ObjectId (Reference to Events)
- **userId**: ObjectId (Reference to Users)
- **status**: String (registered, attended, canceled)
- **paymentStatus**: String (paid, pending, refunded)
- **ticketCode**: String
- **createdAt**: Date
- **updatedAt**: Date

### Categories
- **_id**: ObjectId (Primary Key)
- **name**: String
- **description**: String
- **iconUrl**: String (optional)

### Comments
- **_id**: ObjectId (Primary Key)
- **eventId**: ObjectId (Reference to Events)
- **userId**: ObjectId (Reference to Users)
- **content**: String
- **createdAt**: Date
- **updatedAt**: Date

### Ratings
- **_id**: ObjectId (Primary Key)
- **eventId**: ObjectId (Reference to Events)
- **userId**: ObjectId (Reference to Users)
- **rating**: Number (1-5)
- **review**: String (optional)
- **createdAt**: Date

## Relationships

1. **User to Events (One-to-Many)**
   - A user can organize multiple events
   - Each event has one organizer (user)
   - Referenced by the `organizer` field in Events

2. **User to EventAttendees (One-to-Many)**
   - A user can attend multiple events
   - Referenced by the `userId` field in EventAttendees

3. **Event to EventAttendees (One-to-Many)**
   - An event can have multiple attendees
   - Referenced by the `eventId` field in EventAttendees

4. **Event to Comments (One-to-Many)**
   - An event can have multiple comments
   - Referenced by the `eventId` field in Comments

5. **User to Comments (One-to-Many)**
   - A user can make multiple comments
   - Referenced by the `userId` field in Comments

6. **Event to Ratings (One-to-Many)**
   - An event can have multiple ratings from different users
   - Referenced by the `eventId` field in Ratings

## Indexes

To optimize query performance, create the following indexes:

```javascript
// Users Collection
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 }, { unique: true })

// Events Collection
db.events.createIndex({ "organizer": 1 })
db.events.createIndex({ "category": 1 })
db.events.createIndex({ "date": 1 })
db.events.createIndex({ "price": 1 })

// EventAttendees Collection
db.eventAttendees.createIndex({ "eventId": 1 })
db.eventAttendees.createIndex({ "userId": 1 })
db.eventAttendees.createIndex({ "eventId": 1, "userId": 1 }, { unique: true })

// Comments Collection
db.comments.createIndex({ "eventId": 1 })
db.comments.createIndex({ "userId": 1 })

// Ratings Collection
db.ratings.createIndex({ "eventId": 1 })
db.ratings.createIndex({ "userId": 1 })
db.ratings.createIndex({ "eventId": 1, "userId": 1 }, { unique: true })
``` 