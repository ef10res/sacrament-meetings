
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsed = z.object({
                    email: z.string().email(),
                    password: z.string().min(6),
                }).safeParse(credentials);

                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                const adminEmail = process.env.ADMIN_EMAIL;
                const passwordHash = process.env.ADMIN_PASSWORD_HASH;

                if (!adminEmail || !passwordHash) return null;
                if (email !== adminEmail) return null;

                const passwordsMatch = await bcrypt.compare(
                    password,
                    passwordHash
                );

                if (!passwordsMatch) return null;

                return {
                    id: 'admin',
                    email: adminEmail,
                    name: 'Meeting Administrator',
                };
            },
        }),
    ],
});
