import express from "express";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.SUPABASE_URL as string; // backend/.env
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string; // backend/.env


if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function supabaseWithToken(token: string) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    });
}

export function bearerToken(req: express.Request) {
    const header = req.header("authorization") ?? "";
    return header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
}