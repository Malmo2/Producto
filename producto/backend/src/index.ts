import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

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
  if (!header)
    return res.status(401).json({ error: "Missing Authorization header" });

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

type Worksession = {
  id: string;
  userId: string;
  title: string;
  category: string;
  startAt: string;
  endAt: string | null;
};

type WorkSessionRow = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  start_at: string;
  end_at: string | null;
  created_at: string;
};

type CreateWorkSessionInput = {
  title: string;
  category: string;
  startAt: string;
  endAt?: string | null;
};

type ActivityRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  color: string | null;
  activity_date: string;
  activity_time: string;
  starts_at: string;
  created_at: string;
};

type CreateActivityInput = {
  title: string;
  date: string;
  time: string;
  description?: string | null;
  color?: string | null;
};

const sessions: Worksession[] = [];

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  const user = (req as AuthedRequest).user;
  res.json({ ok: true, user });
});

app.get("/api/sessions", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;

  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabaseUser
    .from("work_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("start_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ ok: true, sessions: data ?? [] });
});

app.get("/api/activities", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;

  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabaseUser
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ ok: true, activities: data ?? [] });
});

app.post("/api/activities", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;

  const { title, date, time, description, color } =
    req.body as Partial<CreateActivityInput>;
  if (!title || !date || !time) {
    return res.status(400).json({ error: "title, date, time are required" });
  }

  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabaseUser
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

app.post("/api/sessions", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;

  const { title, category, startAt, endAt } = req.body as {
    title?: string;
    category?: string;
    startAt?: string;
    endAt?: string | null;
  };

  if (!title || !category || !startAt) {
    return res
      .status(400)
      .json({ error: "title, category, startAt are required" });
  }

  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabaseUser
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
  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";
  const sessionId = req.params.id;

  const { endAt } = req.body as { endAt?: string | null };
  if (!endAt) return res.status(400).json({ error: "endAt is required" });

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error, count } = await supabaseUser
    .from("work_sessions")
    .update({ end_at: endAt }, { count: "exact" })
    .eq("id", sessionId)
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  if (!count || count === 0) {
    return res
      .status(404)
      .json({ error: "Session not found (or not allowed)" });
  }

  return res.json({ ok: true, session: data?.[0] ?? null });
});

app.delete("/api/sessions/:id", requireAuth, async (req, res) => {
  const sessionId = req.params.id;

  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { error, count } = await supabaseUser
    .from("work_sessions")
    .delete({ count: "exact" })
    .eq("id", sessionId);

  if (error) return res.status(500).json({ error: error.message });

  if (!count || count === 0) {
    return res
      .status(404)
      .json({ error: "Session not found (or not allowed)" });
  }

  return res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
