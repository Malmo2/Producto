import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3001);

const app = createApp();

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});