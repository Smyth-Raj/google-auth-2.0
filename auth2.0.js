import express from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import https from "https";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

// Load SSL certificate files
let privateKey, certificate;
try {
    privateKey = fs.readFileSync("server.key", "utf8");
    certificate = fs.readFileSync("server.crt", "utf8");
} catch (err) {
    console.error("❌ SSL Certificate not found! Make sure server.key and server.crt exist.");
    process.exit(1);
}

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "mysecret", // Change this to a secure secret in production
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true }, // Secure cookies only work with HTTPS
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://localhost:5001/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

// Serialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Home Route
app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

// Google Login Route (Fixed Syntax)
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// Google OAuth Callback
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => res.redirect("/")
);

// Logout Route (Fixed)
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("❌ Error during logout:", err);
            return res.status(500).json({ message: "Something went wrong during logout" });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("❌ Error destroying session:", err);
                return res.status(500).json({ message: "Error destroying session" });
            }

            res.clearCookie("connect.sid");

            // Redirect to home page (not Google logout)
            res.redirect("/");
        });
    });
});

// Start HTTPS Server
const PORT = process.env.PORT || 5001;
https
    .createServer({ key: privateKey, cert: certificate }, app)
    .listen(PORT, () => console.log(`🚀 Server running on https://localhost:${PORT}`));
