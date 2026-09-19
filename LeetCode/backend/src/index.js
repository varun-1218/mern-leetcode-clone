
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




require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import DB connection
const main = require('./config/db');

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

const PORT = process.env.PORT || 3000;

// ✅ Call the DB connection before starting the server
const startServer = async () => {
  try {
    await main();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();