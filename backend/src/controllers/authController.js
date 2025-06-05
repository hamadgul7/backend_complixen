const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const resend = require("../../config/resend.js");
const CompanyControl = require('../models/companyOwner/companyControls-model.js');
const Control = require('../models/Administration/adminControls-model.js');

async function sendWelcomeEmail(toEmail, name) {
    try {
        const response = await resend.emails.send({
        from: 'CompliXen <developer@complixen.com>',
        to: toEmail,
        subject: 'Welcome to Our Platform!',
        html: `<strong>Hello ${name}</strong><br>Welcome aboard!`,
        });

        console.log("Email sent:", response);
    } catch (err) {
        console.error("Error sending email:", err);
    }
}

// sendWelcomeEmail("user@example.com", "John");


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.register = async (req, res) => {
    const { username, email, password, assignedFramework } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const user = new User({
        username,
        email,
        password,
        assignedFrameworks: assignedFramework,
        role: 'CompanyOwner',
        verificationToken,

    });

    await user.save();

    const url = `http://172.104.48.135:5000/api/auth/verify-email?token=${verificationToken}`;
    console.log("Verification URL:", url);

    try {
        const response = await resend.emails.send({
        from: 'CompliXen <developer@complixen.com>',
        to: email,
        subject: 'Welcome to Our Platform!',
        html: `<strong>Hello ${username}</strong><br>Welcome aboard!
            <p>Click <a href="${url}">here</a> to verify your email.</p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p>CompliXen</p>`,
        });

        console.log("Email sent:", response);
    } catch (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Failed to send verification email"});
    }


    try {
    const frameworkQuery = {};
    for (const [key, value] of Object.entries(assignedFramework)) {
      if (value === true) {
        frameworkQuery[`frameworks.${key}`] = true;
      }
    }
    console.log('helooooo', user._id)

    const matchingControls = await Control.find(frameworkQuery);

    const companyControls = matchingControls.map(ctrl => ({
        controlTemplate: {
            _id: ctrl._id,
            code: ctrl.code,
            name: ctrl.name,
            description: ctrl.description,
            question: ctrl.question,
            activities: ctrl.activities,
            frameworks: ctrl.frameworks,
            frameworkRefs: ctrl.frameworkRefs
        },
        user: user._id,
        company: null,
        owner: null,
        policyApprover: null,
        approver: null,
        requiredApprovalStage: 'Draft',
        isReady: false,
        scope: 'In Scope',
        evidence: [],
        mappedRequirements: ctrl.mappedRequirements
    }));


    await CompanyControl.insertMany(companyControls);

    console.log(`Assigned ${companyControls.length} controls to user ${user._id}`);
    } catch (error) {
        console.error("Error assigning controls during registration:", error.message);
    }
    

    // try {
    //     await transporter.sendMail({
    //         to: email,
    //         subject: "Verify your email",
    //         html: `<h1>Hello ${user.username}</h1>
    //         <p>Click <a href="${url}">here</a> to verify your email.</p>
    //         <p>If you did not create an account, please ignore this email.</p>
    //         <p>Thank you!</p>
    //         <p>Best regards,</p>
    //         <p>CompliXen</p>`
    //     }, (err, info) => {
    //         if (err) {
    //             console.error("Error sending email:", err);
    //         } else {
    //             console.log("Email sent:", info.response);
    //             console.log("Message ID:", info.messageId);
    //         }
    //     });
    // } catch (error) {
    //     console.error("Error sending email:", error);
    //     return res.status(500).json({ message: "Failed to send verification email"});
    // }
    
    res.status(201).json({ message: "Verification email sent. Please check your inbox.", url });
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: "Email verified successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Verification failed" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified) return res.status(403).json({ message: "Please verify your email first." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
        token,
        user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
        }
    });
};
