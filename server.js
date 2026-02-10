const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static("public"))

let complaints = []
let idCounter = 1

app.get("/complaints", (req, res) => {
    res.json(complaints)
})

app.get("/complaints/:id", (req, res) => {
    const complaint = complaints.find(c => c.id == req.params.id)
    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" })
    }
    res.json(complaint)
})

app.post("/complaints", (req, res) => {
    const { name, highway, issueType, subject, description } = req.body

    if (!name || !highway || !issueType || !subject || !description) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const newComplaint = {
        id: idCounter++,
        name,
        highway,
        issueType,
        subject,
        description,
        status: "pending",
        date: new Date().toLocaleString()
    }

    complaints.push(newComplaint)

    res.status(201).json(newComplaint)
})

app.put("/complaints/:id", (req, res) => {
    const complaint = complaints.find(c => c.id == req.params.id)

    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" })
    }

    complaint.status = req.body.status
    res.json(complaint)
})

app.delete("/complaints/:id", (req, res) => {
    const exists = complaints.find(c => c.id == req.params.id)

    if (!exists) {
        return res.status(404).json({ message: "Complaint not found" })
    }

    complaints = complaints.filter(c => c.id != req.params.id)
    res.json({ message: "Deleted successfully" })
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})