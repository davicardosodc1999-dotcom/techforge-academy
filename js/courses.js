document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

  initCourseArtDepth();

  function initCourseArtDepth() {
    if (touchDevice || reducedMotion) return;

    document.querySelectorAll(".course-hero-art").forEach((art) => {
      const core = art.querySelector(".art-core");
      const tags = art.querySelectorAll(".floating-tag");
      if (!core) return;

      art.addEventListener("pointermove", (event) => {
        const rect = art.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        const baseTransform = core.closest(".art-electronics")
          ? `translate(-50%, -50%) rotate(${45 + x * 4}deg)`
          : core.closest(".art-iphone")
          ? `translate(-50%, -50%) rotate(${8 + x * 4}deg)`
          : core.closest(".art-notebook")
          ? `translate(-50%, -56%) rotateY(${x * 5}deg) rotateX(${y * -4}deg)`
          : core.closest(".art-diagnostic")
          ? `translate(-50%, -50%) rotateY(${x * 5}deg) rotateX(${y * -4}deg)`
          : `translate(-50%, -50%) rotate(${-7 + x * 4}deg) rotateY(${x * 5}deg)`;

        core.style.transform = baseTransform;

        tags.forEach((tag, index) => {
          const depth = (index + 1) * 3;
          tag.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
      });

      art.addEventListener("pointerleave", () => {
        core.style.transform = "";
        tags.forEach((tag) => (tag.style.transform = ""));
      });
    });
  }
});
