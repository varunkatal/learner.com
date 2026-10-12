import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { withDB } from "@/lib/db";
import { UserModel, type Role } from "@/models/User";

function isAdminEmail(email: string) {
  return siteConfig.adminEmails
    .map((e) => e.toLowerCase())
    .includes(email.toLowerCase());
}

// Google login only. Sessions are JWTs (a signed cookie), so most pages never touch the database.
// The user is saved in MongoDB on first sign-in; their id and role are stored in the cookie.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google], // reads AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET
  session: { strategy: "jwt" },
  trustHost: true, // needed off Vercel; the Worker sits behind Cloudflare's proxy
  pages: { signIn: "/login" },
  callbacks: {
    signIn({ profile }) {
      // Only accept Google accounts whose email Google has verified.
      return Boolean(profile?.email && profile.email_verified);
    },
    async jwt({ token, profile }) {
      // `profile` is only present right after signing in with Google.
      if (profile?.email) {
        const email = profile.email.toLowerCase();
        // Admins are listed in config/site.ts, so the role is recalculated on every sign-in.
        const role: Role = isAdminEmail(email) ? "admin" : "student";
        const user = await withDB((db) =>
          db
            .model(UserModel)
            .findOneAndUpdate(
              { email },
              { $set: { name: profile.name, image: profile.picture, role } },
              { upsert: true, returnDocument: "after" },
            ),
        );
        token.userId = String(user!._id);
        token.role = role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// Call at the top of every admin page, layout and API route. Never trust the browser for the role.
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/admin");
  if (user.role !== "admin") redirect("/");
  return user;
}
