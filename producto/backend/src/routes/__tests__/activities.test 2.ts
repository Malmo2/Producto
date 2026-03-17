import express from "express";
import request from "supertest";

// Groups together tests for the GET /activities route.
// beforeEach clears Jest's module cache before every test.

describe("GET /activities", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    // Defines one test case.
    // async is used because the request and mocked database result are asynchronous.

    test("returns activities for the authenticated user", async () => {
        const fakeActivities = [
            {
                id: "a1",
                user_id: "user-123",
                title: "Study session",
                description: "Read chapter 3",
                color: "blue",
                activity_date: "2026-03-10",
                activity_time: "14:00",
            },
        ];

        // Creates a mock function for the final .order(...) call.
        // It resolves to a Supabase-like response object with data and no error.

        const orderMock = jest.fn().mockResolvedValue({
            data: fakeActivities,
            error: null,
        });

        // Creates a mock for .eq(...).
        // It returns an object containing the next method in the chain: order.

        const eqMock = jest.fn().mockReturnValue({
            order: orderMock,
        });

        // Creates a mock for .select(...).
        // It returns an object containing the next method in the chain: eq.

        const selectMock = jest.fn().mockReturnValue({
            eq: eqMock,
        });

        // Creates a mock for .from(...).
        // It returns an object containing the next method in the chain: select.

        const fromMock = jest.fn().mockReturnValue({
            select: selectMock,
        });

        // Mocks requireAuth so the request is treated as authenticated.
        // It adds a fake user to req.user and then calls next().

        jest.doMock("../../middleware/requireAuth", () => ({
            requireAuth: (req: any, _res: any, next: any) => {
                req.user = { id: "user-123" };
                next();
            },
        }));

        // Mocks the Supabase helper module.
        // bearerToken always returns "test-token".
        // supabaseWithToken returns a fake database client with a .from(...) method.

        jest.doMock("../../lib/supabaseClient", () => ({
            bearerToken: jest.fn(() => "test-token"),
            supabaseWithToken: jest.fn(() => ({
                from: fromMock,
            })),
        }));


        // Loads the router and mocked helpers after the mocks are set up.
        const { activitiesRouter } = require("../activities");
        const { bearerToken, supabaseWithToken } = require("../../lib/supabaseClient");


        // Creates a small Express test app and mounts the router.
        const app = express();
        app.use(express.json());
        app.use(activitiesRouter);


        const response = await request(app).get("/activities");

        // Expects a successful response with status 200.
        // Expects the response body to contain ok: true and the fake activities array.

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ok: true,
            activities: fakeActivities,
        });


        // Checks that:
        // bearerToken was called once,
        // supabaseWithToken was called with the fake token,
        // fromMock queried the "activities" table,
        // selectMock selected all columns with "*",
        // eqMock filtered by user_id = "user-123",
        // orderMock sorted by activity_date in ascending order.

        expect(bearerToken).toHaveBeenCalledTimes(1);
        expect(supabaseWithToken).toHaveBeenCalledWith("test-token");
        expect(fromMock).toHaveBeenCalledWith("activities");
        expect(selectMock).toHaveBeenCalledWith("*");
        expect(eqMock).toHaveBeenCalledWith("user_id", "user-123");
        expect(orderMock).toHaveBeenCalledWith("activity_date", { ascending: true });
    });

    // Defines test case on 500 return error
    // Asynchronous call
    test('returns 500 when Supabase returns an error', async () => {

        const orderMock = jest.fn().mockResolvedValue({
            data: null,
            error: { message: "Database failed" },
        });


        const eqMock = jest.fn().mockReturnValue({
            order: orderMock,
        });

        const selectMock = jest.fn().mockReturnValue({
            eq: eqMock,
        });

        const fromMock = jest.fn().mockReturnValue({
            select: selectMock,
        });

        jest.doMock("../../middleware/requireAuth", () => ({
            requireAuth: (req: any, _res: any, next: any) => {
                req.user = { id: "user-123" };
                next();
            },
        }));

        jest.doMock("../../lib/supabaseClient", () => ({
            bearerToken: jest.fn(() => "test-token"),
            supabaseWithToken: jest.fn(() => ({
                from: fromMock,
            })),
        }));

        const { activitiesRouter } = require("../activities");
        const { bearerToken, supabaseWithToken } = require("../../lib/supabaseClient");

        const app = express();
        app.use(express.json());
        app.use(activitiesRouter);

        const response = await request(app).get("/activities");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Database failed",
        });

        expect(bearerToken).toHaveBeenCalledTimes(1);
        expect(supabaseWithToken).toHaveBeenCalledWith("test-token");
        expect(fromMock).toHaveBeenCalledWith("activities");
        expect(selectMock).toHaveBeenCalledWith("*");
        expect(eqMock).toHaveBeenCalledWith("user_id", "user-123");
        expect(orderMock).toHaveBeenCalledWith("activity_date", { ascending: true });

    });


    test("returns an empty array when Supabase returns null data", async () => {
        const orderMock = jest.fn().mockResolvedValue({
            data: null,
            error: null,
        });


        const eqMock = jest.fn().mockReturnValue({
            order: orderMock,
        });

        const selectMock = jest.fn().mockReturnValue({
            eq: eqMock,
        });

        const fromMock = jest.fn().mockReturnValue({
            select: selectMock,
        });

        jest.doMock("../../middleware/requireAuth", () => ({
            requireAuth: (req: any, _res: any, next: any) => {
                req.user = { id: "user-123" };
                next();
            },
        }));

        jest.doMock("../../lib/supabaseClient", () => ({
            bearerToken: jest.fn(() => "test-token"),
            supabaseWithToken: jest.fn(() => ({
                from: fromMock,
            })),
        }));

        const { activitiesRouter } = require("../activities");
        const { bearerToken, supabaseWithToken } = require("../../lib/supabaseClient");

        const app = express();
        app.use(express.json());
        app.use(activitiesRouter);

        const response = await request(app).get("/activities");


        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ok: true,
            activities: [],
        });

        expect(bearerToken).toHaveBeenCalledTimes(1);
        expect(supabaseWithToken).toHaveBeenCalledWith("test-token");
        expect(fromMock).toHaveBeenCalledWith("activities");
        expect(selectMock).toHaveBeenCalledWith("*");
        expect(eqMock).toHaveBeenCalledWith("user_id", "user-123");
        expect(orderMock).toHaveBeenCalledWith("activity_date", { ascending: true })

    });

});
