import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import type { AuthedRequest, CreateWorkSessionInput } from '../types';
import { bearerToken, supabaseWithToken } from '../lib/supabaseClient';

export const sessionsRouter = Router();

sessionsRouter.get("/sessions", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { data, error } = await db
        .from("work_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("start_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, sessions: data ?? [] });
});


sessionsRouter.get("/sessions/:id", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { data, error } = await db
        .from("work_sessions")
        .select("*")
        .eq("id", req.params.id)
        .eq("user_id", user.id)
        .single();

    if (error) return res.status(400).json({ error: "Session not found (or not allowed)" });
    res.json({ ok: true, session: data });

});

sessionsRouter.post("/sessions", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const { title, category, startAt, endAt } = req.body as Partial<CreateWorkSessionInput>;
    if (!title || !category || !startAt) {
        return res.status(400).json({ error: "title, category, startAt are required" });
    }

    const token = bearerToken(req);
    const db = supabaseWithToken(token);



    const { data, error } = await db
        .from("work_sessions")
        .insert({
            user_id: user.id,
            title,
            category,
            start_at: startAt,
            end_at: endAt ?? null,
        })
        .select("*")
        .single()

    if (error) return res.status(500).json({ error: error.message });
    return res.json(201).json({ ok: true, session: data });
});

sessionsRouter.put("/sessions/:id", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const sessionId = req.params.id;
    const { endAt } = req.body as { endAt?: string | null };

    if (!endAt) return res.status(400).json({ error: "endAt is required" });

    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { data, error, count } = await db
        .from("work_sessions")
        .update({ end_at: endAt }, { count: "exact" })
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .select("*");

    if (error) return res.status(500).json({ error: error.message });
    if (!count) return res.status(404).json({ error: "Session not found (or not allowed)" });

    return res.json({ ok: true, session: data?.[0] ?? null });
});

sessionsRouter.delete("/sessions/:id", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const sessionId = req.params.id;

    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { error, count } = await db
        .from("work_sessions")
        .delete({ count: "exact" })
        .eq("id", sessionId)
        .eq("user_id", user.id)

    if (error) return res.status(500).json({ error: error.message });
    if (!count) return res.status(404).json({ error: "Session not found (or not allowed)" });

    return res.json({ ok: true });
});



