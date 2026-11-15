export function navigateTo(path: string) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function goHome(id?: string) {
  const target = id || "home";
  if (location.pathname !== "/") {
    history.pushState({}, "", id ? `/#${id}` : "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  const reveal = (attempt = 0) => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else if (attempt < 10) requestAnimationFrame(() => reveal(attempt + 1));
  };
  reveal();
}

export function goService(slug: string) {
  navigateTo(`/services/${slug}`);
}
