const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/signup", async (req, res) => {
    // Validate request body against the schema
    const { username, email, password, cPassword } = req.body;

    // Basic validation
    if (!username || !email || !password || !cPassword) {
        return res.json({ msg: "Please enter all fields" });
    }

    // Password match validation
    if (password !== cPassword) {
        return res.json({ msg: "Passwords do not match" });
    }

    try {
        // Find user by email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate token
        const token = jwt.sign({ email: createdUser.email }, process.env.SECRET, { expiresIn: "30d" });
        res.cookie('token', token, {httpOnly: true})
        return res.json({ msg: "User created Successfully"});
    } catch (e) {
        console.log(e)
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.json({ msg: "Please enter all fields" });
    }

    try {
        // Find user by email
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.json({ msg: "User-Email already registered" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return res.json({ msg: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ email: existingUser.email }, process.env.SECRET, { expiresIn: "30d" });
        res.cookie('token', token, {httpOnly: true})
        return res.json({ msg: "Signin successful"});
    } catch (error) {
        console.error("Error during signin:", error);
        res.json({ msg: "Server error during signin" });
    }
});

// Protected route that requires authentication
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // The user object is attached to the request by the authMiddleware
        const user = req.user;
        const userProfile = await User.findOne({email:user.email});

        // Return the user's profile data
        return res.json({
            username: userProfile.username,
            email: userProfile.email,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post("/forgot-password", async(req,res)=>{
    const {email} = req.body;

    // Basic validation
    if (!email) {
        return res.json({ msg: "Please enter your registered email" });
    }

    try {
        // Find user by email
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.json({ msg: "User not found" });
        }

        const token = jwt.sign({ email: existingUser.email }, process.env.SECRET, { expiresIn: "30d" });

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'abhiramjaini28@gmail.com',
            pass: 'evgy xqie fpvh dwpi'
          }
        });

        let mailOptions = {
          from: 'abhiramjaini28@gmail.com',
          to: email,
          subject: 'Reset password',
          text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            return res.json({msg: "error sending email"});
          } else {
            return res.json({msg: "email sent"});
          }
        });
       
    } catch (error) {
        console.error(error);
        res.json({ msg: "Server error" });
    }
})

router.post("/reset-password/:token", async (req,res)=>{
    const {token} = req.params;
    const {password, cPassword} = req.body;

    try{
        const decode = jwt.verify(token, process.env.SECRET)
        const email = decode.email;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // Update the document in MongoDB
        await User.findOneAndUpdate({email}, {password: hashedPassword});

        return res.json({msg: "password updated"})
    } catch(e){
        console.log(e);
        return res.status(500).json({msg: "Server error"});
    }
})

router.post("/logout", (req,res)=>{
    // Clear the token cookie
    res.clearCookie('token');
    return res.json({ msg: "Logged out successfully" });
})


module.exports = router;
