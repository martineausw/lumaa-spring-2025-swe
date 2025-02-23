# Approach

## Dependencies

- express
- bcrypt
- jsonwebtoken

## Developer dependencies

- nodemon
- prisma
- typescript
- ts-node

## PostgreSQL

### Environment Variables

`DATABASE_URL`, with format `"postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"`

### Tables

- User

  - id, uuid primary key
  - username, required unique string
  - password, required unique string

- Task
  - id, uuid primary key
  - title, required string
  - description, optional string
  - isComplete, boolean false

## Authentication Server

### Environment Variables

`ACCESS_SECRET`, 64 byte hex string
`REFRESH_SECRET`, 64 byte hex string
`AUTH_PORT`, port number

### Endpoints

- `POST /auth/login`

  1. Get from body

  - username
  - password

  2. Generate access JWT token using access secret key
  3. Generate refresh JWT token using refresh secret key
  4. Get user from database
  5. Verify token against password

- `POST /auth/register`

  1. Get from body

  - username
  - password

  2. Hash password with bcrypt
  3. Generate uuid
  4. Store user(uuid, name, pass) in user table

### JWT

1. Generate access token
2. Store as a browser cookie
3. Generate refresh token
4. Store in database

### Hashing

1. Get user information from sign up form
2. Use bcrypt to hash password
3. Store username and hashed password in database

## Content Server

### Environment Variables

`CONTENT_PORT`, port number

### Endpoints

- `GET /tasks`

  1. Get access token from header
  2. Deserialize user access token with access secret key
  3. Get all from tasks table

- `POST /tasks`

  1. Get access token from header
  2. Deserialize user access token with access secret key
  3. Get from body

  - title
  - description

  4. Store in tasks table

- `PUT /tasks/:id`

  1. Get access token from header
  2. Deserialize user access token with access secret key
  3. Get id from url
  4. Update task with id in table

- `DELETE /tasks/:id`
  1. Get access token from header
  2. Deserialize user access token with access secret key
  3. Get id from url
  4. Delete task with id from table

### Middleware

- Verify request token against access secret key, open login form on failure
