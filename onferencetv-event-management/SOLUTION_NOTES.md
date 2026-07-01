# Solution Notes

## 1. Approach
The application was built prioritizing clean separation of concerns and maintainability over enterprise complexity. I approached the project by first establishing the backend architecture (Express, Prisma, PostgreSQL, Zod) to ensure a robust and type-safe data layer. Once the APIs were established, I developed the frontend (Vite, React, Tailwind, shadcn/ui) focusing on a clean, responsive user interface. 

The frontend uses TanStack Query for server state management and Redux Toolkit strictly for UI state (e.g., managing the visibility of different dialogs). This separation ensures that API caching and invalidation are handled optimally without polluting the global Redux store.

## 2. Technology Choices
- **PERN Stack (PostgreSQL, Express, React, Node.js)**: Chosen for its robust backend capabilities and clear separation between client and server, which is essential for scalable applications.
- **Prisma ORM**: Provides excellent type safety and a declarative schema, making database operations straightforward and less error-prone compared to raw SQL queries or traditional ORMs.
- **Zod**: Used on both frontend and backend for schema validation. This ensures data consistency across the stack and prevents invalid data from reaching the database.
- **TanStack Query (React Query)**: The industry standard for handling server state. It automates loading states, error handling, caching, and cache invalidation (e.g., refreshing the dashboard after creating an event).
- **Redux Toolkit**: Used exclusively for UI state (dialog visibility and tracking selected event IDs). Using it only for client state prevents the common anti-pattern of manually managing API caches in Redux.
- **shadcn/ui & Radix UI**: Selected for the UI components because they are accessible, highly customizable, and provide a premium, modern aesthetic without the overhead of heavy component libraries.

## 3. Challenges Faced
- **State Separation**: Keeping server state (TanStack Query) and UI state (Redux) separate requires discipline. I had to ensure that the Redux store only tracked `isOpen` states and `selectedEventId`, while the actual fetching and mutation logic lived inside React Query hooks.
- **Consistent Validation**: Ensuring that the frontend validation rules perfectly matched the backend rules. By creating a shared `eventSchemas.ts` logic structure (conceptually shared, physically mirrored here for simplicity), I ensured both ends expect the same data formats.
- **Tailwind v4 Compatibility**: Vite React templates now default to Tailwind v4, which has a different configuration structure that can clash with `shadcn/ui` initialization. This required a deliberate downgrade to Tailwind v3 to ensure components generated smoothly.

## 4. Error Handling
- **Missing required fields**: On the frontend, React Hook Form integrated with Zod prevents submission and displays inline red error text. On the backend, the `validate.middleware.ts` catches invalid inputs and returns a 400 Bad Request with a structured error array.
- **Invalid event date**: If a user manages to bypass the frontend date picker restrictions, the backend Zod schema's `.refine()` method catches the invalid date and returns a 400 error.
- **Event not found**: GET, PUT, and DELETE routes perform a check (`getEventById`) before executing their operations. If the event is missing, they return a clean 404 Not Found response.
- **Database/Server failure**: The global `error.middleware.ts` catches unhandled exceptions, logs them securely, and returns a generic 500 Internal Server Error, ensuring that internal stack traces or database errors are not leaked to the client.

## 5. AI Usage
- **Architecture Planning**: AI tools were utilized to structure the folder layout and ensure all assignment requirements were met systematically.
- **Boilerplate Generation**: AI assisted in rapidly scaffolding the Express setup, Prisma schema, and standard CRUD routes, allowing more time to focus on the business logic and user interface.
- **Documentation**: AI helped draft clear, professional documentation (this file and the README).
- All AI-generated suggestions and code snippets were manually reviewed, tested, and adapted to fit the specific constraints and requirements of the assignment.

## 6. Future Improvements
- **Authentication and Authorization**: Adding user login (e.g., via NextAuth or JWT) to restrict event creation and management to authenticated users.
- **Pagination and Filtering**: Implementing server-side pagination, search, and filtering capabilities in the dashboard as the number of events grows.
- **Calendar View**: Providing an alternative calendar view for the dashboard to visually map out upcoming events.
- **Enhanced AI Provider Integration**: Connecting the `generateContent` route to a real LLM provider (like OpenAI or Anthropic) instead of the local deterministic placeholder.
- **Automated Testing**: Introducing Jest/Supertest for backend unit and integration tests, and Vitest/React Testing Library for frontend component tests.
- **Dockerization**: Wrapping the application and the database in a `docker-compose.yml` for true one-click local deployment.
