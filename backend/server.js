require('dotenv').config(); // 1. Must be at the very top

const app = require('./src/app');
const connectDB = require('./src/db/db'); // Adjust path if needed

// 2. Connect to DB first, THEN start the server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('DB connected & Server running!');
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });