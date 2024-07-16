const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await collection.findOne({ email });

        if (!user) {
            // User does not exist
            res.json("notexist");
            return;
        }

        // Check if the password matches
        if (user.password === password) {
            // Password is correct, user exists
            console.log(user.name);
            res.json({status:"exist",name:user.name});
        } else {
            // Password is incorrect
            res.json("incorrect");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("fail");
    }
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const data = {
        name: name,
        email: email,
        password: password
    };

    try {
        const check = await collection.findOne({ email: email });

        if (check) {
            // User already exists
            res.json("exist");
        } else {
            // User does not exist, proceed with signup
            await collection.create(data);
            res.json("success");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("fail");
    }
});


app.listen(8000, () => {
    console.log("port connected");
});