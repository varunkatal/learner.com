// YouTube helpers. Admins paste any kind of YouTube link; we store only the 11-character video ID.

const ID = /^[A-Za-z0-9_-]{11}$/;

// Accepts: a bare ID, youtube.com/watch?v=…, youtu.be/…, /shorts/…, /live/…, /embed/…
// Returns null when no video ID can be found.
export function youtubeIdFrom(input: string): string | null {
  const value = input.trim();
  if (ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");

  let id: string | null = null;
  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v");
    if (!id) {
      const [, section, maybeId] = url.pathname.split("/");
      if (["shorts", "live", "embed", "v"].includes(section)) id = maybeId;
    }
  }
  return id && ID.test(id) ? id : null;
}

// Privacy-friendly player (no tracking cookies until the video plays).
export function embedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function thumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
