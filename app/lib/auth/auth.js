import {mongodbConnect} from "../db/db";
import {userModel} from "../models/model";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        await mongodbConnect();
        const user = await userModel
          .findOne({
            email: credentials?.email,
          })
          .select("+password");
        if (!user) throw new Error("Wrong Email");
        const passwordMatch = await bcrypt.compare(
          credentials?.password,
          user?.password
        );
        if (!passwordMatch) throw new Error("Wrong Password");
        return {email: user.email, role: user.role, id: user._id};
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Ensure role and other fields are added to the token and session
    async jwt({token, user}) {
      if (user) {
        token.role = user.role;
        token.id = user._id; // Add role to JWT token
      }
      return token;
    },
    async session({session, token}) {
      session.user.role = token.role; // Pass role from token to session
      session.user.id = token.id;
      return session;
    },
  },
};
