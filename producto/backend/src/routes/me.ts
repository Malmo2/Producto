import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { AuthedRequest } from '../types';

export const meRouter = Router();

meRouter.get("/me", requireAuth, (req, res) => {
    res.json({ ok: true, user: (req as AuthedRequest).user });
});