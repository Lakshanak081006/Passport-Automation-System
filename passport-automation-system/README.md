# Passport Automation System

A full-stack web application that automates passport application processing.
Applicants apply online and track their application; authorised **Status Changers** review applications,
change their status, and the applicant is notified by email. Every change is recorded in a history table.

## 1. Technology stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, JavaScript (JSX), React Router, Axios, plain CSS |
| Backend   | Java 17+, Spring Boot 3.3, Spring Web, Spring Data JPA, Spring Security, Bean Validation, Spring Boot Mail |
| Auth      | JWT (jjwt 0.12), BCrypt password hashing, role-based authorisation |
| Database  | PostgreSQL |
| Build     | **Gradle** (backend), npm (frontend) |

## 2. Folder structure

```text
passport-automation-system/
├── backend/                     Spring Boot + Gradle project (open THIS folder in IntelliJ)
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradlew / gradlew.bat
│   ├── gradle/wrapper/gradle-wrapper.properties
│   └── src/main/java/com/passport/automation/
│       ├── PassportAutomationApplication.java
│       ├── config/       CorsConfig, DataInitializer (seeds the Status Changer)
│       ├── controller/   Auth, Applicant, PassportApplication, StatusChanger
│       ├── dto/          request/response records
│       ├── entity/       User, PassportApplication, ApplicationStatusHistory + enums
│       ├── exception/    GlobalExceptionHandler, ResourceNotFound, BadRequest
│       ├── repository/   Spring Data JPA repositories
│       ├── security/     SecurityConfig, JwtService, JwtAuthenticationFilter, CustomUserDetailsService
│       └── service/      Auth, User, PassportApplication, Status, Email
├── frontend/                    React (Vite) project
│   └── src/  components/ context/ pages/ services/ styles/ utils/ App.jsx main.jsx
├── database/schema.sql          Manual SQL schema (optional)
└── README.md
```

## 3. Install prerequisites

* **JDK 17 or 21**  (`java -version`)
* **Node.js 18+** (`node -v`)
* **PostgreSQL 14+** (`psql --version`)
* **IntelliJ IDEA Community** (Gradle support is built in; no separate Gradle install needed)

## 4. PostgreSQL setup

```bash
psql -U postgres
```
```sql
CREATE DATABASE passport_automation;
\q
```
That is all. Tables are created automatically when the backend starts
(`spring.jpa.hibernate.ddl-auto=update`). `database/schema.sql` is the equivalent manual script:
`psql -U postgres -d passport_automation -f database/schema.sql`.

## 5. Backend configuration

File: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/passport_automation
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD      # <-- change this (or set env var DB_PASSWORD)
```

Every setting can also be overridden with an environment variable, for example
`DB_PASSWORD`, `DB_USERNAME`, `DB_URL`, `JWT_SECRET`, `MAIL_USERNAME`, `MAIL_PASSWORD`,
`SEED_EMAIL`, `SEED_PASSWORD`.

## 6. Email configuration

Emails are sent with Spring Boot Mail (`EmailService`). To use Gmail:

1. Enable 2-Step Verification on the Google account.
2. Create an **App password** (Google Account -> Security -> App passwords).
3. Set the environment variables (or edit `application.properties`):

```text
MAIL_USERNAME=yourname@gmail.com
MAIL_PASSWORD=your16characterapppassword
```

**If `MAIL_USERNAME` is empty, no email is sent; the full email text is printed in the backend console instead.**
This lets you demo the notification flow without an SMTP account. A mail failure never breaks registration,
submission or a status update.

Emails are sent on: registration, application submission, and every status change.

## 7. Run the backend

Windows:
```cmd
cd backend
gradlew.bat bootRun
```
macOS / Linux:
```bash
cd backend
./gradlew bootRun
```
Build + tests: `./gradlew clean build`

**Gradle wrapper note:** `gradle-wrapper.jar` is a binary file and could not be generated in the environment
where this project was created. Choose either option (one time only):

* **IntelliJ (recommended):** `File -> Open` -> select the `backend` folder -> "Open as Project". IntelliJ reads
  `gradle-wrapper.properties`, downloads Gradle 8.10.2 itself and imports the project. Run
  `PassportAutomationApplication` from the editor, or use the Gradle tool window (`Tasks -> application -> bootRun`).
  To create the jar, run `Tasks -> build setup -> wrapper`.
* **Command line:** install Gradle 8.x, then in `backend/` run `gradle wrapper --gradle-version 8.10.2`.
  This creates the jar and replaces `gradlew`/`gradlew.bat` with the official versions.

Expected console output:
```text
Default STATUS_CHANGER created: statuschanger@passport.com
Started PassportAutomationApplication in ... seconds
```
The API runs on **http://localhost:8080**.

## 8. Run the frontend

```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**. (The backend allows this origin via CORS; to change it use `CORS_ORIGINS`.)
To point the frontend at another backend URL, copy `.env.example` to `.env` and edit `VITE_API_URL`.

## 9. Default Status Changer account

| Email                      | Password    | Role           |
|----------------------------|-------------|----------------|
| statuschanger@passport.com | ChangeMe123 | STATUS_CHANGER |

Created automatically on first start. Change it in `application.properties`
(`app.seed.status-changer.*`) **before the first run**, or with `SEED_EMAIL` / `SEED_PASSWORD`.
The account is only created if the email does not already exist; it cannot be created from the public
registration page (that page always creates APPLICANT accounts).

## 10. User roles

| Role           | Can do |
|----------------|--------|
| APPLICANT      | Register, log in, apply for a passport, view own application/status/history, get emails |
| STATUS_CHANGER | Log in, see dashboard counts, list/search all applications, view full details, change status with remarks, view history |

The role is decided by the backend from the database when the user logs in; the login page has no role selector.
Every API is protected server-side: `/api/applicant/**` needs `ROLE_APPLICANT`,
`/api/status-changer/**` needs `ROLE_STATUS_CHANGER`.

## 11. Application workflow

```text
Applicant registers -> logs in -> submits application (ID like PAS202600001, status SUBMITTED)
        |
Status Changer logs in -> opens application -> selects new status + remarks -> Update Status
        |
Backend: updates application -> writes a history row -> e-mails the applicant
        |
Applicant sees the new status, timeline, remarks and history
```

Statuses: `SUBMITTED, UNDER_REVIEW, DOCUMENT_VERIFICATION, APPROVED, REJECTED, PASSPORT_DISPATCHED, COMPLETED`.

Business rules: one active application per applicant (a rejected applicant may apply again);
renewal requires the previous passport number; rejection requires remarks;
`REJECTED` and `COMPLETED` applications are closed and cannot be changed.

## 12. API overview

| Method | URL | Role | Purpose |
|--------|-----|------|---------|
| POST | `/api/auth/register` | public | Create applicant account |
| POST | `/api/auth/login` | public | Returns `{token, userId, name, email, role}` |
| GET  | `/api/applicant/profile` | APPLICANT | Own profile (never includes password) |
| GET  | `/api/applicant/application` | APPLICANT | Own application (204 if none) |
| POST | `/api/applicant/application` | APPLICANT | Submit application |
| GET  | `/api/applicant/application/history` | APPLICANT | Own status history |
| GET  | `/api/status-changer/stats` | STATUS_CHANGER | Counts for the dashboard cards |
| GET  | `/api/status-changer/applications?search=` | STATUS_CHANGER | List / search (ID, name, email) |
| GET  | `/api/status-changer/applications/{id}` | STATUS_CHANGER | Full application details |
| PUT  | `/api/status-changer/applications/{id}/status` | STATUS_CHANGER | Body `{newStatus, remarks}` |
| GET  | `/api/status-changer/applications/{id}/history` | STATUS_CHANGER | Status history |

Send the token as `Authorization: Bearer <token>`.

### Quick API test (curl)

```bash
# register
curl -X POST localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{
 "fullName":"Test User","dateOfBirth":"1999-04-12","gender":"Female","email":"test@example.com",
 "mobile":"9876543210","address":"12 Main Street","password":"Password123","confirmPassword":"Password123"}'

# login (copy the token from the response)
curl -X POST localhost:8080/api/auth/login -H "Content-Type: application/json" \
     -d '{"email":"statuschanger@passport.com","password":"ChangeMe123"}'

# list applications as the status changer
curl localhost:8080/api/status-changer/applications -H "Authorization: Bearer TOKEN"
```

## 13. Demo script (manual test of the complete flow)

1. Register an applicant at `/register` -> redirected to `/login`.
2. Log in as the applicant -> dashboard -> **Apply Passport** -> submit. Note the Application ID.
3. Log out; log in as `statuschanger@passport.com`.
4. Dashboard shows counts and the application. Click **Update Status**, choose `UNDER_REVIEW`, add remarks.
5. Backend console shows the email (or your inbox receives it).
6. Log in again as the applicant: dashboard/status timeline show the new status; **Application History** lists both changes.
7. Try opening `/status-changer/dashboard` as the applicant: you are redirected; calling its API returns 403.

## 14. Troubleshooting

| Problem | Fix |
|---------|-----|
| `password authentication failed for user "postgres"` | Wrong `spring.datasource.password` / `DB_PASSWORD` |
| `database "passport_automation" does not exist` | Run `CREATE DATABASE passport_automation;` |
| `Connection refused localhost:5432` | PostgreSQL service is not running |
| `Port 8080 was already in use` | Stop the other program or set `server.port=8081` (and `VITE_API_URL`) |
| `gradle-wrapper.jar` missing / `gradlew` says Gradle not installed | See the "Gradle wrapper note" in section 7 |
| Unsupported class file / `release version 17 not supported` | Use JDK 17+ (IntelliJ: File -> Project Structure -> SDK; Gradle JVM in Settings -> Build Tools -> Gradle) |
| Frontend shows "Cannot reach the server" | Backend not running, or wrong `VITE_API_URL` |
| Browser CORS error | Frontend must run on `http://localhost:5173` (or add your origin to `CORS_ORIGINS`) |
| Redirected to login unexpectedly | Token expired (24h). Log in again |
| No email arrives | Set `MAIL_USERNAME`/`MAIL_PASSWORD` (Gmail App password). Without them, emails are only logged |
| Changed seed credentials but old ones still work | The seed only runs if that email does not exist; delete the user row or use a new email |
