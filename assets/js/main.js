const header = document.querySelector(".site-header");
const preloader = document.querySelector(".preloader");

if (preloader) {
  document.body.classList.add("is-loading");

  let preloaderHidden = false;
  const hidePreloader = () => {
    if (preloaderHidden) return;
    preloaderHidden = true;
    window.setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, 350);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hidePreloader, { once: true });
  } else {
    hidePreloader();
  }

  window.addEventListener("load", hidePreloader, { once: true });
}

if (window.AOS) {
  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 90,
    delay: 0,
  });
}

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = "Inquiry Ready";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      form.reset();
    }, 1800);
  });
});

document.querySelectorAll(".sponsor-marquee").forEach((marquee) => {
  marquee.querySelectorAll(".sponsor-logo").forEach((logo) => {
    logo.addEventListener("mouseenter", () => marquee.classList.add("is-paused"));
    logo.addEventListener("mouseleave", () => marquee.classList.remove("is-paused"));
    logo.addEventListener("focus", () => marquee.classList.add("is-paused"));
    logo.addEventListener("blur", () => marquee.classList.remove("is-paused"));
  });
});

document.querySelectorAll("[data-auto-scroll]").forEach((scroller) => {
  let isPaused = false;
  let loopWidth = 0;
  let animationFrame = 0;
  let lastTimestamp = 0;
  let hasSetInitialLoopPosition = false;

  function normalizeLoopScroll() {
    if (!loopWidth) return;

    if (scroller.scrollLeft >= loopWidth * 2) {
      scroller.scrollLeft -= loopWidth;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft += loopWidth;
    }
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const track = scroller.querySelector(".horizontal-work-track");
  if (!track) return;

  const originalItems = Array.from(track.children);

  originalItems
    .slice()
    .reverse()
    .forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, input, textarea, select").forEach((focusable) => {
        focusable.setAttribute("tabindex", "-1");
      });
      track.prepend(clone);
    });

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button, input, textarea, select").forEach((focusable) => {
      focusable.setAttribute("tabindex", "-1");
    });
    track.appendChild(clone);
  });

  function updateLoopWidth() {
    loopWidth = track.scrollWidth / 3;
    if (loopWidth && !hasSetInitialLoopPosition) {
      const previewOffset = Math.min(scroller.clientWidth * 0.18, 320);
      scroller.scrollLeft = loopWidth - previewOffset;
      hasSetInitialLoopPosition = true;
    }
  }

  function autoScroll(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;

    const elapsed = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!isPaused && loopWidth > scroller.clientWidth) {
      scroller.scrollLeft += elapsed * 0.035;
      normalizeLoopScroll();
    }

    animationFrame = window.requestAnimationFrame(autoScroll);
  }

  updateLoopWidth();
  window.addEventListener("resize", updateLoopWidth, { passive: true });
  scroller.addEventListener("mouseenter", () => {
    isPaused = true;
  });
  scroller.addEventListener("mouseleave", () => {
    isPaused = false;
  });
  scroller.addEventListener("focusin", () => {
    isPaused = true;
  });
  scroller.addEventListener("focusout", () => {
    isPaused = false;
  });
  animationFrame = window.requestAnimationFrame(autoScroll);
});
