// const mongoose = require('mongoose');

// async function main() {
//     await mongoose.connect(process.env.DB_CONNECT_STRING)
// }

// module.exports = main;




// const mongoose = require('mongoose');

// const main = async () => {
//   try {
//     const uri = process.env.DB_CONNECT_STRING;
//     console.log('🔍 DB_CONNECT_STRING exists:', !!uri);
//     if (uri) {
//       console.log('🔍 URI starts with:', uri.substring(0, 30));
//     } else {
//       console.error('❌ DB_CONNECT_STRING is not set!');
//       process.exit(1);
//     }
//     await mongoose.connect(uri);
//     console.log('✅ MongoDB connected');
//   } catch (err) {
//     console.error('❌ MongoDB connection error:', err.message);
//     throw err;
//   }
// };

// module.exports = main;






const mongoose = require('mongoose');

const main = async () => {
  try {
    const uri = process.env.DB_CONNECT_STRING;
    console.log('🔍 DB_CONNECT_STRING exists:', !!uri);
    if (uri) {
      console.log('🔍 URI starts with:', uri.substring(0, 30));
    } else {
      console.error('❌ DB_CONNECT_STRING is not set!');
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = main;