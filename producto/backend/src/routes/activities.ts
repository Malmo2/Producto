import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import type { AuthedRequest, CreateActivityInput } from "../types";
import { bearerToken, supabaseWithToken } from "../lib/supabaseClient";

export const activitiesRouter = Router();

activitiesRouter.get("/activities", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { data, error } = await db
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: true })

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, activities: data ?? [] });
});

activitiesRouter.post("/activities", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const { title, date, time, description, color } = req.body as Partial<CreateActivityInput>;

    if (!title || !date || !time) {
        return res.status(400).json({ error: "title, date, time are required" });
    }

    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { data, error } = await db
        .from("activities")
        .insert({
            user_id: user.id,
            title,
            description: description ?? null,
            color: color ?? null,
            activity_date: date,
            activity_time: time,
        })
        .select("*")
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ ok: true, activity: data });
});

activitiesRouter.delete("/activities/:id", requireAuth, async (req, res) => {
    const user = (req as AuthedRequest).user;
    const { id } = req.params;

    const token = bearerToken(req);
    const db = supabaseWithToken(token);

    const { error } = await db
        .from("activities")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(204).send();

});