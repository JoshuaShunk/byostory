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

// Update matcher to exclude /terms and /privacy
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', 
    '/', 
    '/(api|trpc)(.*)', 
    '!/terms', // Exclude /terms
    '!/privacy' // Exclude /privacy
  ],
};
