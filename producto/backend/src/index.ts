import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log("INCOMING:", req.method, req.url);
  next();
});

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthedRequest = express.Request & {
  user: { id: string; email: string | null };
};

async function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const header = req.header("authorization");
  if (!header) return res.status(401).json({ error: "Missing Authorization header" });

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
}

app.set("etag", false);

app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

type CreateWorkSessionInput = {
  title: string;
  category: string;
  startAt: string;
  endAt?: string | null;
};

type CreateActivityInput = {
  title: string;
  date: string;
  time: string;
  description?: string | null;
  color?: string | null;
};

function supabaseWithToken(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

function bearerToken(req: express.Request) {
  const header = req.header("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ ok: true, user: (req as AuthedRequest).user });
});

app.get("/api/sessions", requireAuth, async (req, res) => {
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

app.get("/api/sessions/:id", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const token = bearerToken(req);
  const db = supabaseWithToken(token);

  const { data, error } = await db
    .from('work_sessions')
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .single();

  if (error) return res.status(404).json({ error: "Session not found (or not allowed)" });

  return res.json({ ok: true, session: data });
});

app.post("/api/sessions", requireAuth, async (req, res) => {
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
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ ok: true, session: data });
});

app.put("/api/sessions/:id", requireAuth, async (req, res) => {
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

app.delete("/api/sessions/:id", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const sessionId = req.params.id;

  const token = bearerToken(req);
  const db = supabaseWithToken(token);

  const { error, count } = await db
    .from("work_sessions")
    .delete({ count: "exact" })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) return res.status(500).json({ error: error.message });
  if (!count) return res.status(404).json({ error: "Session not found (or not allowed)" });

  return res.json({ ok: true });
});

app.get("/api/activities", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const token = bearerToken(req);
  const db = supabaseWithToken(token);

  const { data, error } = await db
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true, activities: data ?? [] });
});

app.post("/api/activities", requireAuth, async (req, res) => {
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

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

app.delete("/api/activities/:id", requireAuth, async (req,res) => {
  const user = (req as AuthedRequest).user
  const { id } = req.params

  const token = bearerToken(req)
  const db = supabaseWithToken(token)

  const { error } = await db
  .from ("activities")
  .delete()
  .eq("id", id)
  .eq("user_id", user.id)

  if (error) return res.status(500).json({ error: error.message})
    return res.status(204).send()
})
