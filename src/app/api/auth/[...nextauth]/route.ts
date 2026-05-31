import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";
import { handleProxy } from "../../[...path]/route";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async redirect({ baseUrl, url }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

async function customHandler(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const resolvedParams = await context.params;
  const nextauthParams = resolvedParams?.nextauth || [];
  const action = nextauthParams[0];

  if (["login", "register", "refresh", "logout"].includes(action)) {
    const wrappedParams = Promise.resolve({
      path: ["auth", ...nextauthParams],
    });
    return handleProxy(request, { params: wrappedParams });
  }

  return handler(request, context);
}

export { customHandler as GET, customHandler as POST };
