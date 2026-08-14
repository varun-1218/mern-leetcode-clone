const { createClient }  = require('redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-19934.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 19934
//     }
// });


const redisClient = createClient({
    url: process.env.REDIS_PASS  // This should be your Redis URL
});



// Add error handling
redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});



module.exports = redisClient;