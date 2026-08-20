document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "techPlatformProgressV1";
  const body = document.body;
  const course = body.dataset.course || "";
  const currentLesson = Number(body.dataset.lesson || 0);

  initLessonSidebar();
  initProgressUI();
  initCompletionButton();
  initDashboard();

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function completedLessons(courseKey = "smartphones") {
    const data = getProgress();
    return Array.isArray(data[courseKey]) ? data[courseKey] : [];
  }

  function markComplete(courseKey, lessonNumber) {
    const data = getProgress();
    const existing = Array.isArray(data[courseKey]) ? data[courseKey] : [];
    if (!existing.includes(lessonNumber)) existing.push(lessonNumber);
    data[courseKey] = existing.sort((a,b) => a-b);
    saveProgress(data);
  }

  function initLessonSidebar() {
    const button = document.getElementById("lesson-menu-btn");
    const sidebar = document.getElementById("lesson-sidebar");
    const overlay = document.getElementById("lesson-overlay");
    if (!button || !sidebar || !overlay) return;

    const close = () => {
      sidebar.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      overlay.hidden = true;
      document.body.classList.remove("menu-open");
    };

    const open = () => {
      sidebar.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      overlay.hidden = false;
      document.body.classList.add("menu-open");
    };

    button.addEventListener("click", () => sidebar.classList.contains("open") ? close() : open());
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initProgressUI() {
    if (!course) return;
    const done = completedLessons(course);
    const total = course === "smartphones" ? 8 : 1;
    const percent = Math.round((done.length / total) * 100);

    const sidebarBar = document.getElementById("sidebar-progress-bar");
    const sidebarText = document.getElementById("sidebar-progress-text");
    const headerProgress = document.getElementById("header-progress");

    if (sidebarBar) sidebarBar.style.width = `${percent}%`;
    if (sidebarText) sidebarText.textContent = `${done.length} of ${total} completed`;
    if (headerProgress) headerProgress.textContent = `${percent}% COMPLETE`;

    document.querySelectorAll(".lesson-nav-item").forEach((item, index) => {
      const number = index + 1;
      if (done.includes(number)) {
        item.classList.add("completed");
        const badge = item.querySelector(":scope > span");
        if (badge) badge.textContent = "✓";
        const small = item.querySelector("small");
        if (small && !item.classList.contains("active")) small.textContent = "Completed";
      }
    });

    const button = document.getElementById("complete-lesson-btn");
    if (button && done.includes(currentLesson)) {
      button.classList.add("completed");
      button.innerHTML = 'COMPLETED <span>✓</span>';
    }
  }

  function initCompletionButton() {
    const button = document.getElementById("complete-lesson-btn");
    const toast = document.getElementById("lesson-toast");
    if (!button || !course || !currentLesson) return;

    button.addEventListener("click", () => {
      markComplete(course, currentLesson);
      button.classList.add("completed");
      button.innerHTML = 'COMPLETED <span>✓</span>';
      initProgressUI();

      if (toast) {
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 2200);
      }
    });
  }

  function initDashboard() {
    const dashboard = document.querySelector("[data-dashboard]");
    if (!dashboard) return;

    const done = completedLessons("smartphones");
    const percent = Math.round((done.length / 8) * 100);

    const percentEl = document.getElementById("dashboard-percent");
    const bar = document.getElementById("dashboard-progress-bar");
    const completed = document.getElementById("dashboard-completed-count");
    const nextLink = document.getElementById("dashboard-next-link");

    if (percentEl) percentEl.textContent = `${percent}%`;
    if (bar) bar.style.width = `${percent}%`;
    if (completed) completed.textContent = `${done.length} / 8 modules completed`;

    const next = [1,2,3,4,5,6,7,8].find((n) => !done.includes(n)) || 8;
    if (nextLink) nextLink.href = `lesson-smartphones-${String(next).padStart(2,"0")}.html`;

    const firstAchievement = document.querySelector('[data-achievement="first"]');
    const halfwayAchievement = document.querySelector('[data-achievement="halfway"]');
    const completeAchievement = document.querySelector('[data-achievement="complete"]');
    if (done.length >= 1) firstAchievement?.classList.add("unlocked");
    if (done.length >= 4) halfwayAchievement?.classList.add("unlocked");
    if (done.length >= 8) completeAchievement?.classList.add("unlocked");
  }
});
