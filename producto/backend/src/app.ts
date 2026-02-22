import express from 'express';
import cors from 'cors';
import { meRouter } from './routes/me';
import { activitiesRouter } from './routes/activities';
import { sessionsRouter } from './routes/sessions';

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use((req, _res, next) => {
        console.log("INCOMING", req.method, req.url);
        console.log("BODY:", req.body);
        next();
    });

    app.set("etag", false);

    app.use("/api", (_req, res, next) => {
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        next();
    });

    app.get("/health", (req, res) => {
        res.json({ ok: true });
    });

    app.use("/api", meRouter);
    app.use("/api", activitiesRouter);
    app.use("/api", sessionsRouter);

    return app;
}