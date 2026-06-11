import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { upsertUser } from "@/lib/db/user";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/save-trip(.*)",
  "/api/get-trips(.*)",
  "/api/get-trip(.*)",
  "/api/delete-trip(.*)",
  "/api/itinerary(.*)",
  "/api/get-leads(.*)",
  "/api/get-users(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      await upsertUser(clerkUser);
    } catch (error) {
      console.error("Failed to upsert user:", error);
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
