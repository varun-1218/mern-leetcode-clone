// const express = require('express');

// const authRouter =  express.Router();
// const {register, login,logout, adminRegister,deleteProfile} = require('../controllers/userAuthent')
// const userMiddleware = require("../middleware/userMiddleware");
// const adminMiddleware = require('../middleware/adminMiddleware');

// // Register
// authRouter.post('/register', register);
// authRouter.post('/login', login);
// authRouter.post('/logout', userMiddleware, logout);
// authRouter.post('/admin/register', adminMiddleware ,adminRegister);
// authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
// authRouter.get('/check',userMiddleware,(req,res)=>{

//     const reply = {
//         firstName: req.result.firstName,
//         emailId: req.result.emailId,
//         _id:req.result._id,
//         role:req.result.role,
//     }

//     res.status(200).json({
//         user:reply,
//         message:"Valid User"
//     });
// })
// // authRouter.get('/getProfile',getProfile);


// module.exports = authRouter;

// // login
// // logout
// // GetProfile




const express = require('express');
const router = express.Router();

// Import controller functions
const {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile
} = require('../controllers/userAuthent');

// Import middleware
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - emailId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered and logged in successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailId
 *               - password
 *             properties:
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user (invalidates token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       503:
 *         description: Server error
 */
router.post('/logout', userMiddleware, logout);

/**
 * @swagger
 * /user/admin-register:
 *   post:
 *     summary: Register an admin user (for testing)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - emailId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/admin-register', adminMiddleware, adminRegister);

/**
 * @swagger
 * /user/delete-profile:
 *   delete:
 *     summary: Delete the authenticated user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-profile', userMiddleware, deleteProfile);

/**
 * @swagger
 * /user/check:
 *   get:
 *     summary: Check authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valid user
 */
router.get('/check', userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };
  res.status(200).json({ user: reply, message: "Valid User" });
});

module.exports = router;