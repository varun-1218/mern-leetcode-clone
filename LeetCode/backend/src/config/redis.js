// const { createClient }  = require('redis');

// // const redisClient = createClient({
// //     username: 'default',
// //     password: process.env.REDIS_PASS,
// //     socket: {
// //         host: 'redis-19934.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
// //         port: 19934
// //     }
// // });


// const redisClient = createClient({
//     url: process.env.REDIS_PASS  // This should be your Redis URL
// });



// // Add error handling
// redisClient.on('error', (err) => {
//     console.log('Redis Client Error', err);
// });



// module.exports = redisClient;



const { createClient } = require('redis');

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    reconnectStrategy: false,   // <-- do not retry forever
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

module.exports = redisClient;