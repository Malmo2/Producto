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

type AuthedRequest = express.Request & { user: { id: string; email: string | null } };

async function requireAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const header = req.header("authorization");
    if (!header) return res.status(401).json({ error: "Missing Authorization header" });

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res
            .status(401)
            .json({ error: "Invalid Authorization format (expected: Bearer <token>)" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    (req as AuthedRequest).user = { id: data.user.id, email: data.user.email ?? null };
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

app.get("/api/sessions", requireAuth, (req, res) => {
    const user = (req as AuthedRequest).user;
    const mySessions = sessions.filter((s) => s.userId === user.id);
    res.json({ ok: true, sessions: mySessions });
});

app.post("/api/sessions", requireAuth, (req, res) => {
    const user = (req as AuthedRequest).user;

    const { title, category, startAt, endAt } = req.body as {
        title?: string;
        category?: string;
        startAt?: string;
        endAt?: string | null;
    };

    if (!title || !category || !startAt) {
        return res.status(400).json({ error: "title, category, startAt are required" });
    }

    const newSession: Worksession = {
        id: makeId(),
        userId: user.id,
        title,
        category,
        startAt,
        endAt: endAt ?? null
    };

    sessions.push(newSession);
    res.status(201).json({ ok: true, session: newSession });

});


app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
