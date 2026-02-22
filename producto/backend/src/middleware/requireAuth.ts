import express from 'express';
import { supabase } from '../lib/supabaseClient';
import type { AuthedRequest } from '../types';

export async function requireAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    const header = req.header('authorization');
    if (!header) return res.status(401).json({ error: "Missing authorization header" });

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Invalid Authorization format (expected: Bearer <token>)",
        });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    (req as AuthedRequest).user = {
        id: data.user.id,
        email: data.user.email ?? null,
    };

    next();
};