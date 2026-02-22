import express from 'express';
import type { Request } from 'express';

export type AuthedRequest = express.Request & {
    user: { id: string, email: string | null };
};

export type CreateWorkSessionInput = {
    title: string;
    category: string;
    startAt: string;
    endAt?: string | null;
};

export type CreateActivityInput = {
    title: string;
    date: string;
    time: string;
    description?: string | null;
    color?: string | null;
};



