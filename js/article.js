// ---- Utils ----
function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr; // fallback if bad date
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  
  // ---- Suggested Articles state ----
  let allSuggestions = [];
  let shownCount = 0;
  const SUGGESTIONS_BATCH = 3;
  
  // Load current post + suggestions
  function loadSuggestedArticles(currentId) {
    const container = document.getElementById("suggested-articles");
    if (!container) return; // not on article page
    const section = container.parentElement;
    const btn = document.getElementById("load-more-suggestions");
  
    fetch("/posts.json")
      .then(r => r.json())
      .then(posts => {
        // Find current post
        const cur = (currentId || "").toLowerCase();
        const currentPost = posts.find(p => (p.id || "").toLowerCase() === cur);
  
        // Setup share buttons with this post
        setupShareButtons(currentPost);
  
        // Exclude current article from suggestions
        allSuggestions = posts.filter(p => (p.id || "").toLowerCase() !== cur);
  
        // If none, hide section
        if (allSuggestions.length < 1) {
          if (section) section.style.display = "none";
          return;
        }
  
        // Shuffle
        allSuggestions = allSuggestions.sort(() => Math.random() - 0.5);
  
        // Reset & first render
        shownCount = 0;
        container.innerHTML = "";
        renderMore(container);
  
        // Button appears only if there are more beyond first batch
        if (btn) {
          btn.style.display = shownCount < allSuggestions.length ? "inline-block" : "none";
          btn.onclick = () => {
            renderMore(container);
            btn.style.display = shownCount < allSuggestions.length ? "inline-block" : "none";
          };
        }
      })
      .catch(err => console.error("Error loading suggested articles:", err));
  }
  
  function renderMore(container) {
    const next = allSuggestions.slice(shownCount, shownCount + SUGGESTIONS_BATCH);
    next.forEach(post => {
      const html = `
        <article class="bg-black/80 rounded-xl shadow-lg hover:shadow-purple-500/50 overflow-hidden border border-purple-600 transition-all duration-300">
          <a href="${post.url}">
            <img src="${post.cover}" alt="${post.title}" class="w-full h-48 object-cover">
          </a>
          <div class="p-4">
            <h3 class="text-lg font-bold text-yellow-400 mb-1">
              <a href="${post.url}" class="hover:underline">${post.title}</a>
            </h3>
            <p class="text-gray-400 text-sm mb-2">${formatDate(post.date)} • ${post.duration} min read</p>
            <p class="text-gray-300 line-clamp-3">${post.description}</p>
          </div>
        </article>
      `;
      container.insertAdjacentHTML("beforeend", html);
    });
    shownCount += next.length;
  }
  
  // ---- Share Buttons ----
  function setupShareButtons(post) {
    const shareContainer = document.getElementById("share-buttons");
    if (!shareContainer) return;
  
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || document.title);
    const desc = encodeURIComponent(post?.description || "Check out this article on Raven Hunt!");
    const cover = encodeURIComponent(post?.cover || "");
  
    const buttons = [
      {
        name: "Twitter / X",
        url: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        classes: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      },
      {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        classes: "px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
      },
      {
        name: "Pinterest",
        url: `https://pinterest.com/pin/create/button/?url=${url}&media=${cover}&description=${desc}`,
        classes: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      }
    ];
  
    shareContainer.innerHTML = "";
  
    buttons.forEach(btn => {
      shareContainer.insertAdjacentHTML(
        "beforeend",
        `<a href="${btn.url}" target="_blank" rel="noopener" class="${btn.classes}">${btn.name}</a>`
      );
    });
  
    shareContainer.insertAdjacentHTML(
      "beforeend",
      `<button onclick="copyLink()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
        Copy Link
      </button>`
    );
  }
  
  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Link copied to clipboard!");
    });
  }
  