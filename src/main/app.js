const siteContent = {
  profile: {
    name: "Pratyusha",
    oneLine: "software builder, careful reader, and collector of useful internet things.",
    links: [
      { label: "x", href: "https://x.com/pratyusharj" },
      { label: "mail", href: "mailto:hello@example.com" },
      { label: "github", href: "https://github.com/pratyusharj" },
    ],
    about: [
      "I like building useful things that are quiet, direct, and easy to return to. This site is meant to be that kind of place: part calling card, part notebook, part shelf for links I keep recommending.",
      "I am happiest around thoughtful systems, strong opinions held lightly, and tools that make people feel more capable. The blog is for original notes and for resharing essays, posts, talks, and references that keep becoming relevant again.",
      "Outside the usual work-shaped boxes, I care about making life events easier for guests and hosts. The wedding archive is here because a good wedding site is really an information design problem: answer the questions people actually have, in the order they need them.",
    ],
  },
  projects: [
    {
      title: "Wedding website archive",
      description:
        "A guest-first wedding site archive with planning notes, page structure, and examples other people can adapt.",
      href: "#wedding",
      linkLabel: "view archive",
      tags: ["information-design", "personal", "wedding"],
    },
    {
      title: "whoami",
      description:
        "This personal site: a small web 1.0-ish home for projects, writing, saved links, and resume material.",
      href: "https://github.com/pratyusharj/whoami",
      linkLabel: "github",
      tags: ["static-site", "vanilla-js"],
    },
    {
      title: "Tiny projects shelf",
      description:
        "A reserved spot for smaller tools, experiments, and scripts that are useful enough to share without turning them into a production.",
      href: "https://github.com/pratyusharj",
      linkLabel: "github",
      tags: ["experiments", "tools"],
    },
  ],
  posts: [
    {
      title: "First note",
      date: "draft",
      description:
        "A placeholder for the first original post. Keep posts short if that makes publishing easier.",
      href: "#blog",
      tags: ["draft"],
    },
  ],
  links: [
    {
      title: "Parse, don't validate",
      source: "Alexis King",
      date: "2019-11-05",
      description:
        "A type-driven design essay about preserving information at system boundaries instead of throwing it away after validation.",
      href: "https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/",
      tags: ["types", "programming", "systems"],
    },
  ],
  wedding: {
    intro:
      "A public archive of the wedding website, kept here as an example for couples who want their site to be genuinely helpful to guests.",
    rationale:
      "The goal is not to preserve every private detail. It is to show the organization: what belongs on the first screen, what guests need before booking travel, how FAQs can prevent repeated texts, and how to make the site feel warm without hiding the practical stuff.",
    archiveHref: "#wedding",
    map: [
      "Start with date, place, and the one action guests need to take next.",
      "Separate schedule, travel, attire, lodging, registry, and FAQ so guests can scan.",
      "Keep private details removable before publishing the archive.",
      "Add notes explaining why each section exists and what questions it answered.",
    ],
  },
};

const routes = {
  home: renderHome,
  about: renderAbout,
  projects: renderProjects,
  blog: renderBlog,
  wedding: renderWedding,
};

const app = document.querySelector("#app");

window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", renderRoute);

function renderRoute() {
  const route = normalizeRoute(window.location.hash);
  routes[route]();
  updateActiveNav(route);
  app.focus({ preventScroll: true });
}

function normalizeRoute(hash) {
  const route = hash.replace(/^#\/?/, "");
  return Object.hasOwn(routes, route) ? route : "home";
}

function updateActiveNav(activeRoute) {
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.routeLink === activeRoute);
  });
}

function useTemplate(id) {
  const template = document.querySelector(`#${id}`);
  const fragment = template.content.cloneNode(true);
  app.replaceChildren(fragment);
}

function renderHome() {
  useTemplate("home-template");
  document.querySelector("#home-title").textContent = siteContent.profile.name;
  document.querySelector(".lede").textContent = siteContent.profile.oneLine;

  const list = document.querySelector(".contact-list");
  siteContent.profile.links.forEach((link) => {
    const item = document.createElement("li");
    const anchor = createAnchor(link.href, link.label);
    item.append(anchor);
    list.append(item);
  });
}

function renderAbout() {
  useTemplate("about-template");
  const aboutCopy = document.querySelector("[data-about-copy]");
  siteContent.profile.about.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    aboutCopy.append(p);
  });
}

function renderProjects() {
  useTemplate("projects-template");
  const list = document.querySelector("[data-projects]");
  siteContent.projects.forEach((project) => {
    list.append(createItem(project));
  });
}

function renderBlog() {
  useTemplate("blog-template");
  document.querySelector("[data-post-count]").textContent = `${siteContent.posts.length} item`;
  document.querySelector("[data-link-count]").textContent = `${siteContent.links.length} item`;

  const postList = document.querySelector("[data-posts]");
  siteContent.posts.forEach((post) => {
    postList.append(createItem(post));
  });

  const linkList = document.querySelector("[data-links]");
  siteContent.links.forEach((link) => {
    linkList.append(createItem(link, link.source));
  });
}

function renderWedding() {
  useTemplate("wedding-template");
  document.querySelector("[data-wedding-intro]").textContent = siteContent.wedding.intro;
  document.querySelector("[data-wedding-rationale]").textContent = siteContent.wedding.rationale;
  document.querySelector("[data-wedding-link]").href = siteContent.wedding.archiveHref;

  const map = document.querySelector("[data-wedding-map]");
  siteContent.wedding.map.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    map.append(item);
  });
}

function createItem(entry, eyebrow) {
  const article = document.createElement("article");
  article.className = "item";

  const titleRow = document.createElement("div");
  titleRow.className = "item-title";

  const title = document.createElement("h3");
  const titleLink = createAnchor(entry.href, entry.title);
  title.append(titleLink);
  titleRow.append(title);

  const meta = document.createElement("span");
  meta.className = "date";
  meta.textContent = eyebrow || entry.date || entry.linkLabel || "";
  if (meta.textContent) {
    titleRow.append(meta);
  }

  const description = document.createElement("p");
  description.textContent = entry.description;

  article.append(titleRow, description);

  if (entry.linkLabel && entry.href) {
    const metaList = document.createElement("ul");
    metaList.className = "meta-list";
    const item = document.createElement("li");
    item.append(createAnchor(entry.href, entry.linkLabel));
    metaList.append(item);
    article.append(metaList);
  }

  if (entry.tags?.length) {
    article.append(createTags(entry.tags));
  }

  return article;
}

function createTags(tags) {
  const list = document.createElement("ul");
  list.className = "tag-row";
  tags.forEach((tag) => {
    const item = document.createElement("li");
    item.textContent = tag;
    list.append(item);
  });
  return list;
}

function createAnchor(href, label) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.textContent = label;

  if (/^https?:\/\//.test(href)) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }

  return anchor;
}
