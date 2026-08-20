(() => {
  "use strict";

  function normalizeYouTubeId(value) {
    const raw = (value || "").trim();
    if (!raw || raw === "YOUTUBE_VIDEO_ID") return "";
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

    try {
      const url = new URL(raw);
      if (url.hostname.includes("youtu.be")) {
        return url.pathname.split("/").filter(Boolean)[0] || "";
      }
      if (url.searchParams.get("v")) return url.searchParams.get("v");

      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex(p => ["embed","shorts","live"].includes(p));
      if (marker >= 0 && parts[marker + 1]) return parts[marker + 1];
    } catch (_) {}

    return "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function startVideo(box,id,moduleName) {
    const iframe=document.createElement("iframe");
    iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    iframe.title=`YouTube video lesson for ${moduleName}`;
    iframe.loading="lazy";
    iframe.referrerPolicy="strict-origin-when-cross-origin";
    iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen=true;
    box.replaceChildren(iframe);
    box.classList.add("is-playing");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-youtube-video]").forEach(box => {
      const id=normalizeYouTubeId(box.dataset.youtubeVideo);
      const moduleName=box.dataset.moduleTitle || "this module";

      if (!id) {
        box.innerHTML=`
          <div class="youtube-placeholder">
            <span class="youtube-placeholder-icon" aria-hidden="true">▶</span>
            <strong>Video lesson coming soon</strong>
            <p>A focused video will reinforce ${escapeHtml(moduleName)}.</p>
          </div>`;
        return;
      }

      const poster=document.createElement("button");
      poster.type="button";
      poster.className="youtube-poster";
      poster.setAttribute("aria-label",`Play YouTube video for ${moduleName}`);

      poster.innerHTML=`
        <img
          class="youtube-poster-image"
          src="https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg"
          alt="YouTube video thumbnail for ${escapeHtml(moduleName)}"
          loading="lazy"
          referrerpolicy="no-referrer"
        >
        <span class="youtube-poster-shade" aria-hidden="true"></span>
        <span class="youtube-play-button" aria-hidden="true">
          <span class="youtube-play-triangle"></span>
        </span>
        <span class="youtube-poster-caption">
          <small>SUPPLEMENTARY VIDEO</small>
          <strong>${escapeHtml(moduleName)}</strong>
          <em>Click to play on YouTube</em>
        </span>
      `;

      poster.addEventListener("click",()=>startVideo(box,id,moduleName),{once:true});
      box.replaceChildren(poster);
    });
  });
})();