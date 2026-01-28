document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // FILTERING
  // ---------------------------
  const filterButtons = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".card");

  function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });
    activeBtn.classList.add("is-active");
    activeBtn.setAttribute("aria-selected", "true");
  }

  function filterProjects(filter) {
    cards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.filter;
      setActiveButton(button);
      filterProjects(filterValue);
    });
  });

  filterProjects("all");

  // Footer year (optional)
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------
  // MODAL
  // ---------------------------
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalImg = document.getElementById("modalImg");
  const modalBadge = document.getElementById("modalBadge");
  const modalChips = document.getElementById("modalChips");
  const modalLinks = document.getElementById("modalLinks");
  const modalGallery = document.getElementById("modalGallery");

  let lastFocusedElement = null;

  function openModalFromCard(card) {
    lastFocusedElement = document.activeElement;

    const title = card.querySelector(".title")?.textContent?.trim() || "Project";
    const desc = card.querySelector(".desc")?.textContent?.trim() || "";
    const img = card.querySelector("img");
    const badge = card.querySelector(".badge")?.textContent?.trim() || "";
    const badgeClass =
      card.querySelector(".badge")?.className?.split(" ").find(c => c.startsWith("badge-")) || "";

    // Fill modal
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    if (img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt || title;
    }

    modalBadge.textContent = badge;
 
    modalBadge.className = "modal-badge";
    if (badgeClass) modalBadge.classList.add(badgeClass.replace("badge-", "modal-badge-"));

    // Chips
    modalChips.innerHTML = "";
    card.querySelectorAll(".chip").forEach(chip => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = chip.textContent.trim();
      modalChips.appendChild(span);
    });

    // Links
    modalLinks.innerHTML = "";
    card.querySelectorAll(".links a").forEach(a => {
      const link = document.createElement("a");
      link.href = a.href;
      link.target = a.target || "_blank";
      link.rel = "noreferrer";
      link.textContent = a.textContent.trim();
      modalLinks.appendChild(link);
    });

    // Gallery
    modalGallery.innerHTML = "";
    const galleryData = card.getAttribute("data-gallery");
    let currentGalleryImages = [];
    if (galleryData) {
      currentGalleryImages = galleryData.split(",").map(img => img.trim());
      currentGalleryImages.forEach((imgSrc, index) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `${title} gallery image ${index + 1}`;
        img.style.cursor = "pointer";
        img.addEventListener("click", () => openLightbox(currentGalleryImages, index));
        galleryItem.appendChild(img);
        modalGallery.appendChild(galleryItem);
      });
    }

    // Populate project detail sections
    const whatIBuild = card.getAttribute("data-what-i-build");
    const coreSystems = card.getAttribute("data-core-systems");
    const challenges = card.getAttribute("data-challenges");
    const futureImprovements = card.getAttribute("data-future-improvements");

    // Check for custom sections (section1, section2, section3)
    const section1Title = card.getAttribute("data-section1-title");
    const section1Content = card.getAttribute("data-section1");
    const section2Title = card.getAttribute("data-section2-title");
    const section2Content = card.getAttribute("data-section2");
    const section3Title = card.getAttribute("data-section3-title");
    const section3Content = card.getAttribute("data-section3");

    function populateList(elementId, text) {
      const listEl = document.getElementById(elementId);
      listEl.innerHTML = "";
      if (text) {
        const items = text.split(",").map(item => item.trim());
        items.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          listEl.appendChild(li);
        });
      }
    }

    function updateSectionTitle(elementId, newTitle) {
      const section = document.getElementById(elementId);
      const h4 = section.querySelector("h4");
      if (h4) h4.textContent = newTitle;
    }

    // If custom sections exist, use them and hide what-i-build
    if (section1Title) {
      updateSectionTitle("whatIBuild", section1Title);
      populateList("whatIBuildText", section1Content);
      document.getElementById("whatIBuild").style.display = section1Content ? "block" : "none";
      
      updateSectionTitle("coreSystems", section2Title);
      populateList("coreSystemsText", section2Content);
      document.getElementById("coreSystems").style.display = section2Content ? "block" : "none";
      
      updateSectionTitle("challenges", section3Title);
      populateList("challengesText", section3Content);
      document.getElementById("challenges").style.display = section3Content ? "block" : "none";
      
      document.getElementById("futureImprovements").style.display = futureImprovements ? "block" : "none";
      populateList("futureText", futureImprovements);
    } else {
      // Default behavior
      populateList("whatIBuildText", whatIBuild);
      populateList("coreSystemsText", coreSystems);
      populateList("challengesText", challenges);
      populateList("futureText", futureImprovements);

      document.getElementById("whatIBuild").style.display = whatIBuild ? "block" : "none";
      document.getElementById("coreSystems").style.display = coreSystems ? "block" : "none";
      document.getElementById("challenges").style.display = challenges ? "block" : "none";
      document.getElementById("futureImprovements").style.display = futureImprovements ? "block" : "none";
    }

    // Open
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // focus close button for accessibility
    const closeBtn = modal.querySelector("[data-close='true']");
    if (closeBtn) closeBtn.focus();

    // prevent background scroll
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // Click card -> open modal
  cards.forEach(card => {
    card.addEventListener("click", () => openModalFromCard(card));
  });

  document.querySelectorAll(".card a").forEach(a => {
    a.addEventListener("click", (e) => e.stopPropagation());
  });

  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.getAttribute("data-close") === "true") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });


  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCurrent = document.getElementById("lightboxCurrent");
  const lightboxTotal = document.getElementById("lightboxTotal");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentLightboxImages = [];
  let currentImageIndex = 0;

  function openLightbox(images, index) {
    currentLightboxImages = images;
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    lightboxImg.src = currentLightboxImages[currentImageIndex];
    lightboxCurrent.textContent = currentImageIndex + 1;
    lightboxTotal.textContent = currentLightboxImages.length;
  }

  lightboxPrev.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxImage();
  });

  lightboxNext.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % currentLightboxImages.length;
    updateLightboxImage();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target.getAttribute("data-close") === "true") {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev.click();
      if (e.key === "ArrowRight") lightboxNext.click();
    }
  });
});
