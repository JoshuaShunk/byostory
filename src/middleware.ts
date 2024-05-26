import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
  // Add any other protected routes here
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

// Update matcher to include only protected routes and exclude /terms and /privacy
export const config = {
  matcher: [
    '/((?!terms|privacy).*)',  // Exclude /terms and /privacy
    '/', 
    '/(api|trpc)(.*)'
  ],
};
