const axios = require("axios");

const api_url = "http://20.244.56.144/evaluation-service/logs";
const AUTH_TOKEN = "";  

const VALID_LOG_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_STACKS = ["frontend", "backend"];
const VALID_PACKAGES = ["auth", "config", "middleware", "util"];

async function Log(stack, level, pkg, message) {
  try {
    stack = stack.toLowerCase();
    level = level.toLowerCase();
    pkg = pkg.toLowerCase();
    if (!VALID_STACKS.includes(stack)) {
      console.error(`Invalid stack: ${stack}`);
      return;
    }

    if (!VALID_LOG_LEVELS.includes(level)) {
      console.error(`Invalid log level: ${level}`);
      return;
    }
    if (!VALID_PACKAGES.includes(pkg)) {
      console.warn(`⚠️ Invalid package "${pkg}", defaulting to 'middleware'`);
      pkg = "middleware";
    }

    const logEntry = {
      stack,
      level,
      package: pkg,
      message,
    };

    await axios.post(api_url, logEntry, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      },
    });

    console.log("Log sent successfully:", logEntry);
  } catch (error) {
    console.error("Failed to send log:", error.response?.data || error.message);
  }
}

module.exports = Log;

