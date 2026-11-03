import { createApp } from './app.js';
// Deliberate build break for the fail-fast demo: ./banner.js does not exist.
import { banner } from "./banner.js";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

const server = app.listen(port, () => {
  console.log(`${banner} listening on port ${port}`);
});

// Shut down cleanly when Docker or the terminal stops the process.
function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
