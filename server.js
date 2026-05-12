const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// DATA FILE
const dataPath = path.join(__dirname, "data.json");

// READ DATA
function readData() {

    try {

        const data = fs.readFileSync(
            dataPath,
            "utf-8"
        );

        return JSON.parse(data);

    } catch (err) {

        return [];
    }
}

// WRITE DATA
function writeData(data) {

    fs.writeFileSync(
        dataPath,
        JSON.stringify(data, null, 2)
    );
}

// GET MEMBERS
app.get("/team", (req, res) => {

    try {

        let data = readData();

        const { search, role } = req.query;

        // SEARCH
        if (search) {

            data = data.filter(member =>

                member.name
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );
        }

        // FILTER
        if (role) {

            data = data.filter(member =>

                member.role
                    .toLowerCase()
                    .includes(role.toLowerCase())

            );
        }

        res.status(200).json(data);

    } catch (err) {

        res.status(500).json({
            message: "Failed To Fetch Members"
        });
    }
});

// ADD MEMBER
app.post("/team", (req, res) => {

    try {

        const data = readData();

        const newMember = {

            id: Date.now().toString(),

            name: req.body.name,

            role: req.body.role,

            image: req.body.image,

            bio: req.body.bio,

            github: req.body.github,

            linkedin: req.body.linkedin
        };

        data.push(newMember);

        writeData(data);

        res.status(201).json({
            message: "Member Added",
            member: newMember
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed To Add Member"
        });
    }
});

// UPDATE MEMBER
app.put("/team/:id", (req, res) => {

    try {

        const data = readData();

        const index = data.findIndex(

            member => member.id === req.params.id
        );

        if (index === -1) {

            return res.status(404).json({
                message: "Member Not Found"
            });
        }

        data[index] = {

            id: req.params.id,

            name: req.body.name,

            role: req.body.role,

            image: req.body.image,

            bio: req.body.bio,

            github: req.body.github,

            linkedin: req.body.linkedin
        };

        writeData(data);

        res.json({
            message: "Member Updated"
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed To Update Member"
        });
    }
});

// DELETE MEMBER
app.delete("/team/:id", (req, res) => {

    try {

        let data = readData();

        data = data.filter(

            member => member.id !== req.params.id
        );

        writeData(data);

        res.json({
            message: "Member Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed To Delete Member"
        });
    }
});

// SERVER
const PORT = 5000;

app.listen(PORT, () => {

    console.log(`
===================================

SERVER RUNNING SUCCESSFULLY

===================================

API:
http://localhost:5000/team

===================================
    `);

});