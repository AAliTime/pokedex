/** @type {import('next').NextConfig} */

// Increase default MaxListeners threshold for Node streams during dev bundling
if (process.env.NODE_ENV === "development") {
  require("events").EventEmitter.defaultMaxListeners = 25;
}

const nextConfig = {
  /* your existing config */
};

module.exports = nextConfig;