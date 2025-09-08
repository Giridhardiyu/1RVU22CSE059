const express = require("express");
const Log = require("../Logging Middleware/loggingMiddleware");
const urls = require("./data");

const app = express();
app.use(express.json());

const PORT = 3000;
const STACK = "backend";
const SERVICE = "middleware";

function generateShortUrl() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

app.post("/shorturls", async (req, res) => {
    const { url, validity, shortcode } = req.body;

    try {
        if (!url || typeof url !== "string" || !url.startsWith("http")) {
            await Log(STACK, "error", SERVICE, "Invalid URL provided");
            return res.status(400).json({ error: "Invalid URL" });
        }

        const validityMinutes = validity && !isNaN(validity) ? parseInt(validity) : 30;
        const expiry = Date.now() + validityMinutes * 60 * 1000;

        let finalCode = shortcode || generateShortUrl();

        if (urls[finalCode]) {
            await Log(STACK, "error", SERVICE, "Shortcode already exists");
            return res.status(409).json({ error: "Shortcode already exists" });
        }

        urls[finalCode] = { url, expiry, clicks: 0 };

        await Log(STACK, "info", SERVICE, `Shortcode created: ${finalCode}`);

        res.status(201).json({
            shortLink: `http://localhost:${PORT}/${finalCode}`,
            expiry: new Date(expiry).toISOString(),
        });
    } catch (error) {
        await Log(STACK, "fatal", SERVICE, error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/:shortcode", async (req, res) => {
    const code = req.params.shortcode;
    const data = urls[code];

    try {
        if (!data) {
            await Log(STACK, "error", SERVICE, "Shortcode not found");
            return res.status(404).json({ error: "Shortcode not found" });
        }

        if (Date.now() > data.expiry) {
            await Log(STACK, "warn", SERVICE, "Link expired");
            return res.status(410).json({ error: "Link expired" });
        }

        data.clicks++;
        await Log(STACK, "info", SERVICE, `Redirecting shortcode: ${code}`);
        res.redirect(data.url);
    } catch (error) {
        await Log(STACK, "fatal", SERVICE, error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/shorturls/:shortcode/stats", async (req, res) => {
    const code = req.params.shortcode;
    const data = urls[code];

    try {
        if (!data) {
            await Log(STACK, "error", SERVICE, "Shortcode not found");
            return res.status(404).json({ error: "Shortcode not found" });
        }

        await Log(STACK, "info", SERVICE, `Stats fetched for ${code}`);
        res.json({
            originalUrl: data.url,
            expiry: new Date(data.expiry).toISOString(),
            clicks: data.clicks,
        });
    } catch (error) {
        await Log(STACK, "fatal", SERVICE, error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, async () => {
    await Log(STACK, "info", SERVICE, `Server started on port ${PORT}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
