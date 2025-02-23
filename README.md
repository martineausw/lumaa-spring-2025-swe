# Task Management Submission

Admittedly, this project is incomplete due to tunnel vision and filling in gaps. It was challenging but rewarding. Unfortunately, in trying to structure everything well with testing. Other areas fell through the cracks towards the end. Thank you for the opportunity.

## Video

![demo](codebase.mov)

## Set Up

### Environment Variables

- DATABASE_URL, for Prisma ORM with the following format using PostgreSQL "postgresql://username:password@host:port/database_name"
- AUTH_ACCESS, local secret for JWT authentication
- AUTH_REFRESH, database tokens to refresh expired JWT for users
- AUTH_PORT, integer port for auth-server
- CONTENT_PORT, integer port for content server

### Backend

```
npm install
npm run dev-db-migrate
npm start
```

### Frontend

```
npm run dev
```

### Testing

Setting up testing for the database is where I regrettably spent most of my time. Testing the database is destructive so guards are included in server/src/utils.

```
npm run dev-db-test
```

### Salary Expectations

$900 / month
