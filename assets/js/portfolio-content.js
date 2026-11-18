(function () {
  "use strict";

  const INITIAL_PROJECT_COUNT = 2;

  function skillHtml(skill) {
    const items = skill.items.map(function (item) {
      return `<span class="skill-chip">${item}</span>`;
    }).join("");

    return `
      <div class="col-lg-6">
        <article class="skill-card">
          <h3>${skill.category}</h3>
          <div class="skill-chip-list">${items}</div>
        </article>
      </div>`;
  }

  function projectHtml(project, index) {
    const projectLink = project.link
      ? `<a href="${project.link}" title="${project.linkTitle || "View project"}" class="project-link" target="_blank" rel="noopener noreferrer">${project.linkTitle || "View project"} <i class="bi bi-arrow-up-right"></i></a>`
      : "";
    const technologies = (project.technologies || [])
      .map(function (technology) {
        return `<span class="project-tag">${technology}</span>`;
      }).join("");
    const images = project.images || [project.image];
    const galleryId = `project-gallery-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const gallery = images.map(function (image, index) {
      const hidden = index > 0 ? ' class="project-gallery-extra"' : "";
      const tooltip = project.tooltip || `View ${project.title} screenshot`;
      return `<a href="${image}" class="glightbox project-preview" data-gallery="${galleryId}" title="${tooltip}"${hidden}><img src="${image}" class="img-fluid" alt="${project.title} screenshot ${index + 1}" loading="lazy"></a>`;
    }).join("");

    return `
      <div class="col-lg-6 project-card-column"${index >= INITIAL_PROJECT_COUNT ? " hidden" : ""}>
        <article class="project-card">
          <div class="project-image">
            ${gallery}
            <span class="project-category">${project.category}</span>
            ${images.length > 1 ? `<span class="project-image-hint" aria-hidden="true"><i class="bi bi-images"></i> ${images.length} screenshots</span>` : ""}
          </div>
          <div class="project-body">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">${technologies}</div>
            ${projectLink}
          </div>
        </article>
      </div>`;
  }

  function resumeProjectHtml(project) {
    const link = project.link
      ? `<p><a href="${project.link}" target="_blank" rel="noopener noreferrer">${project.linkTitle || "View project"} <i class="bi bi-box-arrow-up-right"></i></a></p>`
      : "";

    return `
      <div class="resume-item">
        <h4>${project.category}</h4>
        <h5>${project.title}</h5>
        <p><em>${project.description}</em></p>
        ${link}
      </div>`;
  }

  async function renderPortfolioContent() {
    const currentYear = document.querySelector("#current-year");
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    const skillsContainer = document.querySelector("#skills-content");
    const portfolioContainer = document.querySelector("#portfolio-container");
    const toggleProjectsButton = document.querySelector("#toggle-projects");
    const resumeProjectsContainer = document.querySelector("#resume-projects");
    const resumeDownload = document.querySelectorAll("#resume-download, #hero-resume");

    if (skillsContainer) {
      skillsContainer.innerHTML = '<div class="col-12 content-loading" role="status">Loading skills…</div>';
    }

    if (portfolioContainer) {
      portfolioContainer.innerHTML = '<div class="col-12 content-loading" role="status">Loading projects…</div>';
    }

    try {
      const response = await fetch("assets/data/portfolio.json");
      if (!response.ok) {
        throw new Error("Could not load portfolio data");
      }

      const data = await response.json();

      if (skillsContainer) {
        skillsContainer.innerHTML = data.skills.map(skillHtml).join("");
      }

      if (portfolioContainer) {
        portfolioContainer.innerHTML = data.projects.map(projectHtml).join("");

        if (window.GLightbox) {
          window.GLightbox({
            selector: ".project-preview",
            loop: true,
            zoomable: true
          });
        }
      }

      if (toggleProjectsButton && portfolioContainer) {
        toggleProjectsButton.hidden = data.projects.length <= INITIAL_PROJECT_COUNT;
        toggleProjectsButton.addEventListener("click", function () {
          portfolioContainer.querySelectorAll(".project-card-column").forEach(function (card, index) {
            if (index >= INITIAL_PROJECT_COUNT) {
              card.hidden = false;
            }
          });
          toggleProjectsButton.setAttribute("aria-expanded", "true");
          toggleProjectsButton.hidden = true;
        });
      }

      if (resumeProjectsContainer) {
        resumeProjectsContainer.innerHTML = data.projects
          .slice(0, 4)
          .map(resumeProjectHtml)
          .join("");
      }

      resumeDownload.forEach(function (link) {
        if (data.resume) {
          link.href = data.resume;
        }
      });
    } catch (error) {
      console.error(error);
      if (skillsContainer) {
        skillsContainer.innerHTML = '<div class="col-12 content-error" role="status">Skills could not be loaded. Please refresh the page.</div>';
      }
      if (portfolioContainer) {
        portfolioContainer.innerHTML = '<div class="col-12 content-error" role="status">Projects could not be loaded. Please refresh the page.</div>';
      }
    }
  }

  document.addEventListener("DOMContentLoaded", renderPortfolioContent);
})();
