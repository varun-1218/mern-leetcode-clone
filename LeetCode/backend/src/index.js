
// require('dotenv').config();
// const express = require('express')
// const app = express();
// // require('dotenv').config();
// const main =  require('./config/db')
// const cookieParser =  require('cookie-parser');
// const authRouter = require("./routes/userAuth");
// const redisClient = require('./config/redis');
// const problemRouter = require("./routes/problemCreator");
// const submitRouter = require("./routes/submit")
// const aiRouter = require("./routes/aiChatting")
// const videoRouter = require("./routes/videoCreator");
// const cors = require('cors')

// // console.log("Hello")

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true 
// }))

// app.use(express.json());
// app.use(cookieParser());

// app.use('/user',authRouter);
// app.use('/problem',problemRouter);
// app.use('/submission',submitRouter);
// app.use('/ai',aiRouter);
// app.use("/video",videoRouter);


// const InitalizeConnection = async ()=>{
//     try{

//         await Promise.all([main(),redisClient.connect()]);
//         // await main();
//         console.log("DB Connected");
        
//         app.listen(process.env.PORT, ()=>{
//             console.log("Server listening at port number: "+ process.env.PORT);
//         })

//     }
//     catch(err){
//         console.log("Error: "+err);
//     }
// }


// InitalizeConnection();




// require('dotenv').config();
// const express = require('express');
// const app = express();
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// // Import DB and Redis
// const main = require('./config/db');
// const redisClient = require('./config/redis');   // <-- ADD THIS

// // Import routes
// const problemRouter = require('./routes/problemCreator');
// const submitRouter = require('./routes/submit');
// const authRouter = require('./routes/userAuth');
// const aiRouter = require('./routes/aiChatting');
// const videoRouter = require('./routes/videoCreator');

// // Swagger
// const setupSwagger = require('./swagger');

// // CORS
// const corsOptions = {
//   origin: [
//     'http://localhost:5173',
//     'https://mern-leetcode-clone.vercel.app'
//   ],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// app.use(bodyParser.json());
// app.use(cookieParser());

// // Swagger
// setupSwagger(app);

// // Routes
// app.use('/problem', problemRouter);
// app.use('/submission', submitRouter);
// app.use('/user', authRouter);
// app.use('/ai', aiRouter);
// app.use('/video', videoRouter);

// const PORT = process.env.PORT || 3000;

// // ✅ Connect to MongoDB and Redis before starting the server
// const startServer = async () => {
//   try {
//     await main();
//     console.log('✅ MongoDB connected');
//   } catch (err) {
//     console.error('❌ MongoDB connection failed:', err.message);
//     process.exit(1);
//   }

//   // Try to connect Redis, but don't block the server
//   redisClient.connect().catch((err) => {
//     console.warn('⚠️ Redis not available:', err.message);
//   });

//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };



// startServer();





require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import DB and Redis
const main = require('./config/db');
const redisClient = require('./config/redis');

// Import routes
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const authRouter = require('./routes/userAuth');
const aiRouter = require('./routes/aiChatting');
const videoRouter = require('./routes/videoCreator');

// Swagger
const setupSwagger = require('./swagger');

// CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://mern-leetcode-clone.vercel.app'
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

// Swagger
setupSwagger(app);

// Routes
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/user', authRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);

// ✅ TEMPORARY DEBUG ENDPOINT – remove after fixing Redis
app.get('/debug-redis', (req, res) => {
  const pw = process.env.REDIS_PASSWORD || '';
  res.json({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password_length: pw.length,
    password_first3: pw.slice(0, 3),
    password_last3: pw.slice(-3),
    password_has_quotes: pw.includes('"') || pw.includes("'"),
    password_has_spaces: /\s/.test(pw),
  });
});

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB and Redis before starting the server
const startServer = async () => {
  try {
    await main();
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  // Try to connect Redis, but don't block the server
  redisClient.connect().catch((err) => {
    console.warn('⚠️ Redis not available:', err.message);
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();