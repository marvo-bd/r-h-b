// Containers
const featuredContainer = document.getElementById("featured-post-container");
const latestContainer = document.getElementById("latest-post-container");
const regularContainer = document.getElementById("regular-posts-container");
const loadMoreBtn = document.getElementById("load-more-btn");

let allPosts = [];
let regularPosts = [];
let displayedCount = 0;
const POSTS_BATCH = 4;

// Fetch posts.json
fetch("/posts.json")
  .then(response => response.json())
  .then(data => {
    allPosts = data;

    // Render featured post
    const featured = allPosts.find(p => p.featured);
    if (featured) renderFeaturedPost(featured);

    // Render latest post
    const latest = allPosts.find(p => p.latest && !p.featured);
    if (latest) renderLatestPost(latest);

    // Prepare regular posts (exclude featured & latest)
    regularPosts = allPosts.filter(p => !p.featured && !p.latest);

    // Render initial batch of regular posts
    renderRegularPosts();
  })
  .catch(err => console.error("Error loading posts.json:", err));

// Render Featured Post
function renderFeaturedPost(post) {
  const html = `
    <article class="relative height-auto rounded-xl transform transition-all duration-500 group">
      <!-- Featured Label -->
      <span class="absolute top-4 left-4 bg-yellow-400 text-black font-bold uppercase text-sm px-3 py-1 rounded-full z-40">
        Featured
      </span>
      <!-- Pulsating Halo -->
      <div class="absolute -inset-1 rounded-xl pointer-events-none pulse-glow z-0"></div>
      <!-- Solid Purple Border -->
      <div class="absolute inset-0 rounded-xl border-4 border-purple-600 pointer-events-none z-20"></div>
      <!-- Featured Image -->
      <a href="${post.url}" class="relative z-10 block rounded-xl">
        <img src="${post.cover}" alt="${post.title}" class="w-full h-80 md:h-96 object-cover rounded-xl">
      </a>
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm p-0 md:p-8 flex flex-col justify-end z-30 rounded-xl">
        <h3 class="text-4xl md:text-5xl font-extrabold mb-3 text-yellow-400 drop-shadow-lg">
          <a href="${post.url}" class="hover:underline">${post.title}</a>
        </h3>
        <p class="text-gray-300 mb-3 text-lg">${formatDate(post.date)} • ${post.duration} min read</p>
        <p class="text-gray-200 line-clamp-3 text-lg">${post.description}</p>
      </div>
    </article>
  `;
  featuredContainer.innerHTML = html;
}

// Render Latest Post
function renderLatestPost(post) {
  const html = `
    <article class="relative bg-black/80 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group border border-purple-600">
      <!-- Latest Label -->
      <span class="absolute top-4 left-4 bg-purple-600 text-white font-bold uppercase text-sm px-3 py-1 rounded-full z-30">
        Latest
      </span>
      <a href="${post.url}">
        <img src="${post.cover}" alt="${post.title}" class="w-full h-48 object-cover rounded-xl">
      </a>
      <div class="p-6">
        <h3 class="text-2xl font-bold mb-1 group-hover:text-purple-400 transition-colors">
          <a href="${post.url}" class="hover:underline">${post.title}</a>
        </h3>
        <p class="text-gray-400 mb-2">${formatDate(post.date)} • ${post.duration} min read</p>
        <p class="text-gray-300 line-clamp-3">${post.description}</p>
      </div>
    </article>
  `;
  latestContainer.innerHTML = html;
}

// Render Regular Posts in batches
function renderRegularPosts() {
  const nextBatch = regularPosts.slice(displayedCount, displayedCount + POSTS_BATCH);
  nextBatch.forEach(post => {
    const postHTML = `
      <article class="relative group rounded-xl overflow-hidden transition-all duration-300">
        <!-- Gradient Border -->
        <div class="absolute inset-0 p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 rounded-xl pointer-events-none z-0"></div>
        <!-- Card Background -->
        <a href="${post.url}" class="flex flex-col md:flex-row bg-black/80 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/50 relative z-10">
          <!-- Image Left -->
          <img src="${post.cover}" alt="${post.title}" class="w-full md:w-1/3 aspect-video object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <!-- Text Right -->
          <div class="p-4 flex flex-col justify-center md:w-2/3">
            <h3 class="text-xl font-bold mb-1 group-hover:text-pink-400 transition-colors">${post.title}</h3>
            <p class="text-gray-400 mb-1 text-sm">${formatDate(post.date)} • ${post.duration} min read</p>
            <p class="text-gray-300 line-clamp-3 text-sm">${post.description}</p>
          </div>
        </a>
      </article>
    `;
    regularContainer.insertAdjacentHTML("beforeend", postHTML);
  });

  displayedCount += nextBatch.length;

  // Hide Load More button if all posts displayed
  if (displayedCount >= regularPosts.length) {
    loadMoreBtn.style.display = "none";
  }
}

// Load More button click
loadMoreBtn.addEventListener("click", () => {
  renderRegularPosts();
});

// Helper to format date (e.g., "2025-06-08" → "June 8, 2025")
function formatDate(dateStr) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString("en-US", options);
}
