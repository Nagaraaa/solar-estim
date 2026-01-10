'use server'

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();

    // Set secure HttpOnly cookie
    cookieStore.set({
        name: 'solar-admin-auth',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
}
