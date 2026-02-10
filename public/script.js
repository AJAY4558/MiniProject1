document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("complaintForm")

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault()

            const name = document.getElementById("name").value
            const highway = document.getElementById("highway").value
            const issueType = document.getElementById("issueType").value
            const subject = document.getElementById("subject").value
            const description = document.getElementById("description").value

            const res = await fetch("/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, highway, issueType, subject, description })
            })

            const data = await res.json()

            if (!res.ok) {
                document.getElementById("message").innerText = data.message
                return
            }

            document.getElementById("message").innerText = "Issue Registered. ID: " + data.id
            form.reset()
        })
    }

})

async function loadComplaints() {
    const res = await fetch("/complaints")
    const data = await res.json()

    const list = document.getElementById("complaintList")
    list.innerHTML = ""

    data.forEach(c => {
        list.innerHTML += `
      <div class="card-item">
        <span class="status-badge ${c.status}">${c.status}</span>
        <p><strong>ID:</strong> ${c.id}</p>
        <p><strong>Name:</strong> ${c.name}</p>
        <p><strong>Highway:</strong> ${c.highway}</p>
        <p><strong>Issue:</strong> ${c.issueType}</p>
        <p><strong>Subject:</strong> ${c.subject}</p>
        <p><strong>Description:</strong> ${c.description}</p>
        <p><strong>Date:</strong> ${c.date}</p>

        <select onchange="updateStatus(${c.id}, this.value)">
          <option value="pending" ${c.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="resolved" ${c.status === "resolved" ? "selected" : ""}>Resolved</option>
          <option value="rejected" ${c.status === "rejected" ? "selected" : ""}>Rejected</option>
        </select>

        <button onclick="deleteComplaint(${c.id})">Delete</button>
      </div>
    `
    })
}

async function updateStatus(id, status) {
    await fetch("/complaints/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    })
    loadComplaints()
}

async function deleteComplaint(id) {
    await fetch("/complaints/" + id, { method: "DELETE" })
    loadComplaints()
}