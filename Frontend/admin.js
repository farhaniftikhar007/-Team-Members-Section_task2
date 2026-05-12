let editId = null;

const API_URL = "http://localhost:5000/team";

const form = document.getElementById("form");

const list = document.getElementById("list");

// Load Members
async function loadMembers() {

    list.innerHTML = `
      <h3 style="text-align:center;">
        Loading Members...
      </h3>
    `;

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        // Empty State
        if (data.length === 0) {

            list.innerHTML = `
              <h3 style="text-align:center;">
                No Members Found
              </h3>
            `;

            return;
        }

        // Dynamic Members
        list.innerHTML = data.map(member => `

            <div class="member">

                <div class="member-info">

                    <h3>${member.name}</h3>

                    <p>${member.role}</p>

                    <small>
                      ${member.bio || "No Bio"}
                    </small>

                </div>

                <div class="actions">

                    <button 
                      class="edit-btn"
                      onclick="editMember('${member.id}')"
                    >
                      Edit
                    </button>

                    <button 
                      class="delete-btn"
                      onclick="deleteMember('${member.id}')"
                    >
                      Delete
                    </button>

                </div>

            </div>

        `).join("");

    } catch (err) {

        list.innerHTML = `
          <h3 style="
            text-align:center;
            color:red;
          ">
            Backend Connection Failed
          </h3>
        `;

        console.log(err);
    }
}

// Form Submit
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const member = {

        name: document.getElementById("name").value,

        role: document.getElementById("role").value,

        image: document.getElementById("image").value,

        bio: document.getElementById("bio").value,

        github: document.getElementById("github").value,

        linkedin: document.getElementById("linkedin").value
    };

    try {

        const method = editId ? "PUT" : "POST";

        const url = editId
            ? `${API_URL}/${editId}`
            : API_URL;

        await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(member)

        });

        alert(
          editId
          ? "Member Updated Successfully"
          : "Member Added Successfully"
        );

        form.reset();

        editId = null;

        document.getElementById("formTitle")
            .innerText = "Add Member";

        document.getElementById("submitBtn")
            .innerText = "Add Member";

        loadMembers();

    } catch (err) {

        alert("Something went wrong");

        console.log(err);
    }
});

// Edit Member
async function editMember(id) {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        const member = data.find(m => m.id === id);

        if (!member) return;

        document.getElementById("name").value =
            member.name;

        document.getElementById("role").value =
            member.role;

        document.getElementById("image").value =
            member.image;

        document.getElementById("bio").value =
            member.bio;

        document.getElementById("github").value =
            member.github || "";

        document.getElementById("linkedin").value =
            member.linkedin || "";

        editId = id;

        document.getElementById("formTitle")
            .innerText = "Edit Member";

        document.getElementById("submitBtn")
            .innerText = "Update Member";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (err) {

        console.log(err);
    }
}

// Delete Member
async function deleteMember(id) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        alert("Member Deleted Successfully");

        loadMembers();

    } catch (err) {

        alert("Delete Failed");

        console.log(err);
    }
}

// Initial Load
loadMembers();