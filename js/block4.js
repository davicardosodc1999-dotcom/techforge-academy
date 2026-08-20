
document.addEventListener('DOMContentLoaded', () => {
  const LESSON_KEY = 'techPlatformCompletedLessons';
  const getDone = () => {
    try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '[]'); } catch { return []; }
  };
  const setDone = (arr) => localStorage.setItem(LESSON_KEY, JSON.stringify([...new Set(arr)]));

  document.querySelectorAll('[data-lesson-quiz]').forEach(panel => {
    const lesson = panel.dataset.lessonQuiz;
    const form = panel.querySelector('form');
    const feedback = panel.querySelector('.quiz-feedback');
    if (!form || !feedback) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const questions = [...form.querySelectorAll('[data-answer]')];
      let correct = 0;
      questions.forEach(q => {
        const chosen = q.querySelector('input:checked');
        if (chosen && chosen.value === q.dataset.answer) correct++;
      });
      const passed = questions.length && correct === questions.length;
      feedback.className = 'quiz-feedback is-visible ' + (passed ? 'is-pass' : 'is-fail');
      feedback.innerHTML = passed
        ? `<strong>Great work — ${correct}/${questions.length} correct.</strong><br>You completed this knowledge check. Your free lesson PDF is available above for review and offline study.`
        : `<strong>${correct}/${questions.length} correct.</strong><br>Review the lesson and try again. There is no charge and no attempt limit.`;
      if (passed) {
        const done = getDone(); done.push(lesson); setDone(done);
        document.querySelectorAll(`[data-completion-for="${lesson}"]`).forEach(el => el.textContent = 'Knowledge check completed');
      }
    });
  });

  document.querySelectorAll('[data-course-progress]').forEach(card => {
    const total = Number(card.dataset.total || 8);
    const prefix = card.dataset.courseProgress;
    const count = getDone().filter(x => x.startsWith(prefix)).length;
    const pct = Math.min(100, Math.round((count / total) * 100));
    const meter = card.querySelector('.completion-meter span');
    const text = card.querySelector('[data-progress-text]');
    if (meter) meter.style.width = pct + '%';
    if (text) text.textContent = `${count} of ${total} lessons completed • ${pct}%`;
  });
});
