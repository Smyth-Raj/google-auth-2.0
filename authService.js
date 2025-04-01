const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = [{ username: "User1", password: "pass1" }, { username: "User2", password: "pass2" }];

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.listen(4000, () => console.log("Auth microservice running on port 4000"));
