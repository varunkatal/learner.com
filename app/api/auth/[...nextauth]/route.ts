import { handlers } from "@/lib/auth";

// Auth.js handles /api/auth/* here: sign-in, the Google callback, sign-out and the session.
export const { GET, POST } = handlers;
