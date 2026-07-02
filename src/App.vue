<script setup>
import { onMounted, ref } from "vue";

const STAR_CACHE_KEY = "github_stars_cache";
const STAR_CACHE_TTL = 1440 * 60 * 1000;

const isDark = ref(localStorage.getItem("theme") === "dark");
const isLoaded = ref(false);
const isHeroImageZoomed = ref(false);
const stars = ref({});

const experienceItems = [
  {
    company: "Adobe",
    title: "Senior Software Engineer",
    description: "Query languages, transpilers, query engines for audience evaluation",
    years: "Dec 2025 - present",
  },
  {
    company: "Adobe",
    title: "Software Engineer",
    description: "Entity resolution with Spark + Delta Lake, zero-downtime graph migration for FoundationDB storage platforms",
    years: "Nov 2022 - Nov 2025",
  },
  {
    company: "C3 AI",
    title: "Engineering Manager (FDE)",
    description: "Led team of 6 FDEs working with Fortune 100 platform customers; delivered new Mfg Sustainability app on GCP; ML observability for C3 AI Reliability",
    years: "Apr 2022 - Sep 2022",
  },
  {
    company: "C3 AI",
    title: "Software Engineer (FDE)",
    description: "AI-native smart lending, covenant breach early warning, anti money laundering, financial statement intelligence (OCR + analytics)",
    years: "Jul 2020 - Mar 2022",
  },
  {
    company: "Oracle",
    title: "Software Engineer",
    description: "Explainable expense report anomaly detection",
    years: "Jul 2019 - Jul 2020",
  },
];

const projects = [
  {
    name: "SQL Translator",
    tag: "Fun weekend project",
    href: "https://github.com/whoiskatrin/sql-translator",
    fallbackStars: "4.3k ★",
  },
  {
    name: "Cloudflare Agents",
    tag: "Maintainer",
    href: "https://github.com/cloudflare/agents",
    fallbackStars: "2.9k ★",
  },
  {
    name: "Cloudflare Sandbox SDK",
    tag: "Maintainer",
    href: "https://github.com/cloudflare/sandbox-sdk",
    fallbackStars: "689 ★",
  },
  {
    name: "NPM Copilot",
    tag: "Fun weekend project",
    href: "https://github.com/whoiskatrin/npm-copilot",
    fallbackStars: "374 ★",
  },
];

const mediaItems = [
  {
    title: "Agents Have Their Own Computers with Sandboxes GA",
    source: "Cloudflare Blog",
    href: "https://blog.cloudflare.com/sandbox-ga/",
  },
  {
    title: "Skills for Organizations, Partners, the Ecosystem",
    source: "Anthropic Blog",
    href: "https://claude.com/blog/organization-skills-and-directory",
  },
  {
    title: "Building Agents with OpenAI",
    source: "Cloudflare Blog",
    href: "https://blog.cloudflare.com/building-agents-with-openai-and-cloudflares-agents-sdk/",
  },
  {
    title: "Dry Run: You've Got Mail",
    source: "Cloudflare TV",
    href: "https://cloudflare.tv/event/dry-run-you-ve-got-mail/1Zr8G4vO",
  },
  {
    title: "Strategies For Builders Becoming AI Founders",
    source: "AI Unveiled Podcast",
    href: "https://open.spotify.com/episode/0UdmG7CRxbUf5axciSmwhK",
  },
];

const footerLinks = [
  { label: "Email", href: "mailto:pjavangula@adobe.com" },
  { label: "GitHub", href: "https://github.com/pratyusharj" },
  { label: "Twitter", href: "https://x.com/pratyusharj" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pratyushajavangula" },
];

function formatStars(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k ★`;
  }

  return `${count} ★`;
}

function repoKeyFromUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? `${match[1]}/${match[2]}` : null;
}

function getCachedStars() {
  try {
    const cached = localStorage.getItem(STAR_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    return Date.now() - parsed.timestamp < STAR_CACHE_TTL ? parsed.data : null;
  } catch {
    return null;
  }
}

function cacheStars(data) {
  localStorage.setItem(
    STAR_CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    }),
  );
}

async function fetchRepoStars(repoKey) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoKey}`);
    if (!response.ok) return null;

    const data = await response.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

async function loadStars() {
  const repoKeys = projects
    .map((project) => repoKeyFromUrl(project.href))
    .filter(Boolean);
  const cached = getCachedStars();

  if (cached) {
    stars.value = cached;
    return;
  }

  const nextStars = {};
  await Promise.all(
    repoKeys.map(async (repoKey) => {
      const count = await fetchRepoStars(repoKey);
      if (count !== null) {
        nextStars[repoKey] = count;
      }
    }),
  );

  if (Object.keys(nextStars).length > 0) {
    stars.value = nextStars;
    cacheStars(nextStars);
  }
}

function projectStars(project) {
  const repoKey = repoKeyFromUrl(project.href);
  const count = repoKey ? stars.value[repoKey] : null;
  return typeof count === "number" ? formatStars(count) : project.fallbackStars;
}

function applyTheme() {
  document.documentElement.classList.toggle("dark-theme", isDark.value);

  if (isDark.value) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.body.removeAttribute("data-theme");
  }
}

function toggleTheme() {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
  applyTheme();
}

function toggleHeroImageZoom() {
  isHeroImageZoomed.value = !isHeroImageZoomed.value;
}

onMounted(() => {
  applyTheme();
  isLoaded.value = true;
  loadStars();
});
</script>

<template>
  <div class="page" :class="{ loaded: isLoaded }">
    <header>
      <div class="header-identity">
        <img
          src="/assets/pratyusha.jpg"
          alt=""
          class="avatar"
          aria-hidden="true"
        />
        <span>Pratyusha Javangula</span>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <span class="status-dot" aria-hidden="true"></span>
          <span>San Francisco, CA</span>
        </div>
        <button
          class="theme"
          type="button"
          aria-label="Toggle theme"
          @click="toggleTheme"
        >
          <svg class="theme-icon" viewBox="0 0 24 24" width="18" height="18">
            <g class="sun-icon">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <line
                x1="12"
                y1="1"
                x2="12"
                y2="4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="12"
                y1="20"
                x2="12"
                y2="23"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="1"
                y1="12"
                x2="4"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="20"
                y1="12"
                x2="23"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </g>
            <g class="moon-icon">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
      </div>
    </header>

    <main>
      <div class="hero">
        <div class="hero-copy">
          <h1>Senior Software Engineer at Adobe</h1>
          <p class="subtitle">
            Building query languages, transpilers, and engines to enable
            personalization at scale in the Adobe Experience Platform Group
          </p>
          <p class="education">
            Symbolic Systems at Stanford (M.S. 2019), Cognitive Science at UCLA
            (B.S. 2017)
          </p>
        </div>
        <div class="hero-portrait">
          <button
            class="hero-portrait-button"
            :class="{ 'is-zoomed': isHeroImageZoomed }"
            type="button"
            :aria-pressed="isHeroImageZoomed"
            :aria-label="isHeroImageZoomed ? 'Close portrait' : 'Zoom portrait'"
            @click="toggleHeroImageZoom"
          >
            <img src="/assets/pratyusha.jpg" alt="Pratyusha Javangula" />
          </button>
        </div>
      </div>

      <section>
        <h2>Experience</h2>
        <div class="experience-list">
          <div
            v-for="item in experienceItems"
            :key="`${item.company}-${item.title}`"
            class="experience-item"
          >
            <span class="experience-company">{{ item.company }}</span>
            <span class="experience-title">{{ item.title }}</span>
            <span class="experience-description">{{ item.description }}</span>
            <span class="experience-years">{{ item.years }}</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Work</h2>
        <div class="projects">
          <a
            v-for="project in projects"
            :key="project.href"
            :href="project.href"
            target="_blank"
            rel="noreferrer"
            class="project"
          >
            <div class="project-info">
              <span class="project-name">{{ project.name }}</span>
              <span class="project-tag">{{ project.tag }}</span>
            </div>
            <span class="project-stars">{{ projectStars(project) }}</span>
          </a>
        </div>
      </section>

      <section class="activity-section">
        <h2>Activity</h2>
        <div class="github-contributions">
          <img
            src="https://ghchart.rshah.org/pratyusharj"
            alt="GitHub contributions"
          />
        </div>
      </section>
    </main>

    <footer>
      <a
        v-for="link in footerLinks"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noreferrer"
      >
        {{ link.label }}
      </a>
    </footer>
  </div>
</template>
