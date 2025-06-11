import 'next-auth';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id?: string;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        role?: string;
    }
    
    interface Session {
        user: {
            id?: string;
            fullName?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            role?: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        role?: string;
    }
}