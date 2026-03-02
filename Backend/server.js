require("dotenv").config(); /* dotenv.config() */
const app = require("./src/app");
const connectDB = require("./src/config/db");
const startReminderJob = require("./src/services/cronService")

const PORT = process.env.PORT || 5000;

const startServer = async () =>{
  try{
    /* Connect to Database */
    await connectDB();
    
    /* Start Cron Job */
    startReminderJob();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    })
  }catch (err){
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start server
startServer();