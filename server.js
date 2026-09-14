import { connectDB } from "./config/db.js";
import app from "./app.js";
import "dotenv/config";

const port = process.env.DB_PORT;
async function start() {
    await connectDB ();
    app.listen(port, () => {
        try {
            console.log("Server Running");
            console.log("Open the server on port", port , "URL http://localhost:3000")
        } catch(err) {
            console.log("Connection failed");
            console.error(err.message);
            process.exit(1);
        }
    });
}
start();