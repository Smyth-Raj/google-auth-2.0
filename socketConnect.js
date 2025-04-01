const express = require('express')
const app = express()
app.use(express.json())
var save = {}

app.get("/get-data", async (req, res) => {
    try {
        return res.status(200).json({ data: save, message: "Data fetched successfully " })

    } catch (error) {
        return res.status(400).json({ error: error })
    }
})
app.post("/save", async (req, res) => {
    const { user, password } = req.body
    try {
        if (!user || !password) {
            return res.status(400).json({ error: " please provide data password and user" })
        }
        if (user && password) {
            save.userName = user,
                save.password = password
            return res.status(200).json({ message: "data saved successfully", data: save })
        }
    }
    catch (error) {
        return res.status(400).json({ error: error, message: "not connected" })
    }
})

app.post("/other", (req, res) => {
    const { address } = req.body
    if (!address) {
        return res.status(400).json({ message: "porvide address" })
    }
    try {

        if (address) {
            save.address = address
            return res.status(200).json({message:"address has been updated successfully ", userData : save })

        }
    } catch (error) {
        return res.status(400).json({ error: error, message: "error occurred" })
    }
})

var port = 5000
app.listen(port, (req, res) => {
    console.log(`# succces # server connected on the port ${port}`)

})