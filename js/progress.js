
document.addEventListener("DOMContentLoaded", () => {
  const KEY = "platformUnifiedProgressV2";

  const courseDefs = {
    android: { name: "Android Repair", total: 8, prefix: "lesson-android-", courseUrl: "course-android.html" },
    iphone: { name: "iPhone Repair", total: 8, prefix: "lesson-iphone-", courseUrl: "course-iphone.html" },
    laptops: { name: "Laptop Maintenance", total: 8, prefix: "lesson-laptop-", courseUrl: "course-laptops.html" },
    diagnostics: { name: "Mobile Device Diagnostics", total: 8, prefix: "lesson-diagnostics-", courseUrl: "course-diagnostics.html" },
    electronics: { name: "Electronics Essentials", total: 8, prefix: "lesson-electronics-", courseUrl: "course-electronics.html" }
  };

  function read() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "{}");
      return v && typeof v === "object" ? v : {};
    } catch {
      return {};
    }
  }

  function write(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getCompleted(course) {
    const data = read();
    return Array.isArray(data[course]?.completed) ? data[course].completed : [];
  }

  function getQuiz(course, lesson) {
    const data = read();
    return Boolean(data[course]?.quiz?.[lesson]);
  }

  function markQuiz(course, lesson, passed) {
    const data = read();
    data[course] ||= {};
    data[course].quiz ||= {};
    data[course].quiz[lesson] = Boolean(passed);
    write(data);
  }

  function markCompleted(course, lesson) {
    const data = read();
    data[course] ||= {};
    data[course].completed ||= [];
    if (!data[course].completed.includes(lesson)) data[course].completed.push(lesson);
    data[course].completed.sort((a,b)=>a-b);
    write(data);
  }

  function unmarkCompleted(course, lesson) {
    const data = read();
    if (!data[course]?.completed) return;
    data[course].completed = data[course].completed.filter(n => n !== lesson);
    write(data);
  }

  function coursePercent(course) {
    const def = courseDefs[course];
    if (!def) return 0;
    return Math.round((getCompleted(course).length / def.total) * 100);
  }

  function overallPercent() {
    const total = Object.values(courseDefs).reduce((a,c)=>a+c.total,0);
    const done = Object.keys(courseDefs).reduce((a,k)=>a+getCompleted(k).length,0);
    return Math.round((done/total)*100);
  }

  // Expose safe helpers for dashboard / certificate page.
  window.PlatformProgress = {
    read, getCompleted, getQuiz, markQuiz, markCompleted, unmarkCompleted,
    coursePercent, overallPercent, courseDefs
  };

  initLessonCompletion();
  initDashboard();
  initCertificateEligibility();

  function initLessonCompletion() {
    const root = document.querySelector("[data-unified-lesson]");
    if (!root) return;

    const course = root.dataset.course;
    const lesson = Number(root.dataset.lesson);
    const completeBtn = document.getElementById("unified-complete-btn");
    const quizForm = document.getElementById("unified-quiz-form");
    const quizFeedback = document.getElementById("unified-quiz-feedback");
    const status = document.getElementById("unified-completion-status");

    if (!courseDefs[course] || !lesson) return;

    const refresh = () => {
      const quizPassed = getQuiz(course, lesson);
      const completed = getCompleted(course).includes(lesson);

      if (completeBtn) {
        completeBtn.disabled = !quizPassed && !completed;
        completeBtn.classList.toggle("is-completed", completed);
        completeBtn.textContent = completed ? "MODULE COMPLETED ✓" : (quizPassed ? "MARK MODULE COMPLETE" : "PASS THE QUIZ TO COMPLETE");
      }

      if (status) {
        status.textContent = completed
          ? "This module is saved as completed on this device."
          : quizPassed
            ? "Knowledge check passed. You can now mark this module complete."
            : "Complete the free knowledge check before marking this module complete.";
      }
    };

    if (quizForm) {
      quizForm.addEventListener("submit", e => {
        e.preventDefault();
        const questions = [...quizForm.querySelectorAll("[data-correct]")];
        let correct = 0;

        questions.forEach(q => {
          const chosen = q.querySelector("input:checked");
          if (chosen && chosen.value === q.dataset.correct) correct++;
        });

        const passed = questions.length > 0 && correct === questions.length;
        markQuiz(course, lesson, passed);

        if (quizFeedback) {
          quizFeedback.className = "unified-quiz-feedback " + (passed ? "pass" : "fail");
          quizFeedback.innerHTML = passed
            ? `<strong>${correct}/${questions.length} correct.</strong> Knowledge check passed.`
            : `<strong>${correct}/${questions.length} correct.</strong> Review the lesson and try again. Attempts are free and unlimited.`;
        }
        refresh();
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        const completed = getCompleted(course).includes(lesson);
        if (completed) unmarkCompleted(course, lesson);
        else if (getQuiz(course, lesson)) markCompleted(course, lesson);
        refresh();
      });
    }

    refresh();
  }

  function initDashboard() {
    const dash = document.querySelector("[data-unified-dashboard]");
    if (!dash) return;

    const overall = overallPercent();
    const overallText = document.getElementById("overall-progress-value");
    const overallBar = document.getElementById("overall-progress-bar");
    if (overallText) overallText.textContent = overall + "%";
    if (overallBar) overallBar.style.width = overall + "%";

    Object.entries(courseDefs).forEach(([key,def]) => {
      const done = getCompleted(key).length;
      const pct = coursePercent(key);
      const card = document.querySelector(`[data-course-card="${key}"]`);
      if (!card) return;
      card.querySelector("[data-course-percent]")?.replaceChildren(document.createTextNode(pct + "%"));
      card.querySelector("[data-course-count]")?.replaceChildren(document.createTextNode(`${done} / ${def.total} modules completed`));
      const bar = card.querySelector("[data-course-bar]");
      if (bar) bar.style.width = pct + "%";

      const next = Array.from({length:def.total},(_,i)=>i+1).find(n=>!getCompleted(key).includes(n)) || def.total;
      const link = card.querySelector("[data-continue]");
      if (link) link.href = `${def.prefix}${String(next).padStart(2,"0")}.html`;
    });

    const eligibility = document.getElementById("dashboard-certificate-status");
    if (eligibility) {
      const completeCourses = Object.keys(courseDefs).filter(k => coursePercent(k) === 100);
      eligibility.textContent = completeCourses.length
        ? `${completeCourses.length} course${completeCourses.length > 1 ? "s" : ""} currently eligible for a completion certificate.`
        : "Complete all 8 modules of a course to unlock certificate eligibility.";
    }
  }

  function initCertificateEligibility() {
    const page = document.querySelector("[data-certificate-eligibility]");
    if (!page) return;

    Object.entries(courseDefs).forEach(([key,def]) => {
      const row = document.querySelector(`[data-cert-course="${key}"]`);
      if (!row) return;
      const pct = coursePercent(key);
      const eligible = pct === 100;
      row.classList.toggle("eligible", eligible);
      const status = row.querySelector("[data-cert-status]");
      if (status) status.textContent = eligible ? "ELIGIBLE" : `${pct}% COMPLETE`;
      const action = row.querySelector("[data-cert-action]");
      if (action) {
        action.textContent = eligible ? "PREVIEW CERTIFICATE" : "CONTINUE COURSE";
        action.href = eligible ? `certificate-preview.html?course=${key}` : def.courseUrl;
      }
    });
  }
});
