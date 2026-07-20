import "dotenv/config"
import http from "http"
import app from "./app.js"

import { initializeSocket } from "./socket/index.js";

const server = http.createServer(app)
initializeSocket(server);
const PORT = 5000;
server.listen(PORT, () => {
     console.log(` Server running on http://localhost:${PORT}`);
})