const container = document.getElementById("team");

const searchInput = document.getElementById("search");

const filterSelect = document.getElementById("filter");

const API_URL = "http://localhost:5000/team";

// Scroll Animation
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");
        }
    });

}, { threshold: 0.1 });

// Fetch Team Members
async function fetchTeamMembers() {

    container.innerHTML = `
      <div class="loading">
        Loading Team Members...
      </div>
    `;

    const query = new URLSearchParams({

        search: searchInput.value,

        role: filterSelect.value
    });

    try {

        const response = await fetch(
            `${API_URL}?${query}`
        );

        const data = await response.json();

        // Empty State
        if (data.length === 0) {

            container.innerHTML = `
              <div class="empty-state">
                No Team Members Found
              </div>
            `;

            return;
        }

        // Dynamic Cards
        container.innerHTML = data.map((member, index) => `

            <div 
              class="card"
              style="animation-delay:${index * 0.1}s"
            >

                <img 
                  src="${member.image}" 
                  loading="lazy"

                  onerror="
                    this.src='https://via.placeholder.com/400x300'
                  "
                >

                <div class="card-content">

                    <p>${member.role}</p>

                    <h3>${member.name}</h3>

                    <span class="bio">
                      ${member.bio || "No bio available"}
                    </span>

                    <div class="social-links">

                        <a 
                          href="${member.github || '#'}"
                          target="_blank"
                        >
                          GitHub
                        </a>

                        <a 
                          href="${member.linkedin || '#'}"
                          target="_blank"
                        >
                          LinkedIn
                        </a>

                    </div>

                </div>

            </div>

        `).join("");

        // Observer
        document.querySelectorAll(".card").forEach(card => {

            observer.observe(card);
        });

    } catch (err) {

        container.innerHTML = `
          <div class="empty-state">
            Backend Connection Failed
          </div>
        `;

        console.log(err);
    }
}

// Search Debounce
let timer;

searchInput.addEventListener("input", () => {

    clearTimeout(timer);

    timer = setTimeout(() => {

        fetchTeamMembers();

    }, 400);
});

// Filter
filterSelect.addEventListener(
    "change",
    fetchTeamMembers
);

// Initial Load
window.onload = fetchTeamMembers