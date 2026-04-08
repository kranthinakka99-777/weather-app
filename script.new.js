const profile = {
  name: "Your Name",
  tagline: "Student, creator, and future web developer.",
  shortBio:
    "I enjoy learning new technology, building creative projects, and turning ideas into simple experiences people can use.",
  about:
    "This website is your space to introduce yourself. You can talk about where you are from, what you are studying, what kind of projects you enjoy, and what you want to do next.",
  currentFocusTitle: "Learning by building every week.",
  currentFocusText:
    "Right now I am focused on improving my design sense, practicing JavaScript, and creating projects that show my growth.",
  facts: [
    { label: "Based in", value: "India" },
    { label: "Focus", value: "Frontend projects" },
    { label: "Goal", value: "Grow every day" }
  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "Responsive Design",
    "Problem Solving",
    "Teamwork"
  ],
  values: [
    "I like clear communication and simple solutions.",
    "I enjoy learning from each project and improving step by step.",
    "I want to build websites that feel useful, clean, and welcoming."
  ],
  timeline: [
    {
      year: "2026",
      title: "Created my personal website",
      description: "Started building a place online to share my work and story."
    },
    {
      year: "2025",
      title: "Explored web development",
      description: "Learned the basics of page structure, styling, and interaction."
    },
    {
      year: "Next",
      title: "Build more portfolio projects",
      description: "Planning to create stronger projects and expand my skills."
    }
  ],
  contacts: [
    { label: "Email", value: "yourname@example.com", href: "mailto:yourname@example.com" },
    { label: "Instagram", value: "@yourhandle", href: "https://instagram.com/" },
    { label: "LinkedIn", value: "Your profile", href: "https://linkedin.com/" }
  ]
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function renderFacts() {
  const factsContainer = document.getElementById("quickFacts");

  factsContainer.innerHTML = profile.facts
    .map(
      (fact) => `
        <div class="stat">
          <strong>${fact.value}</strong>
          <span>${fact.label}</span>
        </div>
      `
    )
    .join("");
}

function renderSkills() {
  const skillsContainer = document.getElementById("skillsList");

  skillsContainer.innerHTML = profile.skills
    .map((skill) => `<span class="chip">${skill}</span>`)
    .join("");
}

function renderValues() {
  const valuesContainer = document.getElementById("valuesList");

  valuesContainer.innerHTML = profile.values.map((value) => `<li>${value}</li>`).join("");
}

function renderTimeline() {
  const timelineContainer = document.getElementById("timeline");

  timelineContainer.innerHTML = profile.timeline
    .map(
      (item) => `
        <article class="timeline-item">
          <div>
            <strong>${item.year}</strong>
          </div>
          <div>
            <span>${item.title}</span>
            <p>${item.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderContacts() {
  const contactContainer = document.getElementById("contactLinks");

  contactContainer.innerHTML = profile.contacts
    .map(
      (contact) => `
        <a class="contact-link" href="${contact.href}" target="_blank" rel="noreferrer">
          <strong>${contact.label}</strong>
          <span>${contact.value}</span>
        </a>
      `
    )
    .join("");
}

function addRevealClasses() {
  const sections = document.querySelectorAll(".hero-copy, .hero-card, .panel, .footer");

  sections.forEach((section, index) => {
    section.classList.add("reveal");
    section.classList.add(`delay-${Math.min(index, 3)}`);
  });
}

function initializeSite() {
  setText("heroName", profile.name);
  setText("heroTagline", profile.tagline);
  setText("heroBio", profile.shortBio);
  setText("focusTitle", profile.currentFocusTitle);
  setText("focusText", profile.currentFocusText);
  setText("aboutText", profile.about);
  setText(
    "contactText",
    "You can reach me through the links below. I am always open to learning, collaboration, and new ideas."
  );
  setText("footerText", `${profile.name} | Personal Website`);

  const primaryLink = document.getElementById("primaryLink");
  const emailContact = profile.contacts.find((contact) => contact.label === "Email");

  if (primaryLink && emailContact) {
    primaryLink.href = emailContact.href;
  }

  document.title = `${profile.name} | About Me`;

  renderFacts();
  renderSkills();
  renderValues();
  renderTimeline();
  renderContacts();
  addRevealClasses();
}

initializeSite();
