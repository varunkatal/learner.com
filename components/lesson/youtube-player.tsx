"use client";

import { useState } from "react";
import { embedUrl, thumbnailUrl } from "@/lib/video";

// Shows the video's thumbnail first and loads the YouTube player only when tapped.
// The full player is ~1 MB, so this keeps the chapter page fast on slow mobile data.
export function YouTubePlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
      {playing ? (
        <iframe
          src={embedUrl(id)}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full"
          aria-label={`Play video: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails; next/image would need a remote pattern and adds nothing here */}
          <img
            src={thumbnailUrl(id)}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full bg-brand text-2xl text-white shadow-card transition-transform group-hover:scale-110">
              ▶
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
