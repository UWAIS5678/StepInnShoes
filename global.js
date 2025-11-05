// Wait for the DOM to fully load before running scripts
document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // WhatsApp Button Popup Logic
  // ============================
  const whatsappBtn = document.querySelector(".whatsapp-btn");
  const whatsappPopup = document.querySelector(".whatsapp-popup");
  const closeBtn = document.querySelector(".wclose-btn");
  const whatsappPopupBtn = document.querySelector(".whatsapp-popup-btn");

  if (whatsappBtn && whatsappPopup && closeBtn && whatsappPopupBtn) {
    // Show the WhatsApp popup when the button is clicked
    whatsappBtn.addEventListener("click", () => {
      whatsappPopup.style.display = "flex";  // Show the popup
    });

    // Close the WhatsApp popup when the close button is clicked
    closeBtn.addEventListener("click", () => {
      whatsappPopup.style.display = "none";  // Hide the popup
    });

    // Redirect to WhatsApp Chat when the popup button is clicked
    whatsappPopupBtn.addEventListener("click", () => {
      window.open("https://wa.me/11234567890", "_blank");  // Replace with your WhatsApp number
      whatsappPopup.style.display = "none";  // Close the popup after redirecting
    });
  }

  // ============================
  // Smooth Scroll for Anchor Links
  // ============================
  const links = document.querySelectorAll("a[href^='#']");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50, // Adjust scroll position to avoid navbar
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================
  // Mobile Hamburger Menu Toggle
  // ============================
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const navLinks = document.getElementById("navLinks");

  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener("click", () => {
      // Toggle the 'open' class to show/hide the navigation links on mobile
      navLinks.classList.toggle("open");
    });

    // Optional: Handling navigation visibility when resizing screen
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", () => {
      if (!mediaQuery.matches) {
        navLinks.classList.remove("open");
      }
    });
  }
});

// ============================
// Auto-close nav when clicking outside (Global Scope)
// ============================
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');

if (hamburgerMenu && navLinks) {
  // Toggle nav links when hamburger is clicked
  hamburgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('show');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
      navLinks.classList.remove('show');
    }
  });
}
