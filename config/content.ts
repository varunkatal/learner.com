// The kinds of content a chapter can have. The order here is the order of the tabs on the chapter page.
// Videos are YouTube links; everything else is a Google Drive / Google Slides link.

export const contentTypes = [
  {
    id: "animated",
    label: "Animated videos",
    short: "Animated",
    icon: "🎬",
    isVideo: true,
  },
  {
    id: "recorded",
    label: "Recorded classes",
    short: "Recorded",
    icon: "🎥",
    isVideo: true,
  },
  { id: "notes", label: "Notes", short: "Notes", icon: "📄", isVideo: false },
  { id: "ppt", label: "PPT slides", short: "PPT", icon: "📊", isVideo: false },
  {
    id: "worksheet",
    label: "Worksheets",
    short: "Worksheets",
    icon: "📝",
    isVideo: false,
  },
] as const;

export type ContentType = (typeof contentTypes)[number]["id"];

export const contentTypeIds = contentTypes.map((t) => t.id) as [
  ContentType,
  ...ContentType[],
];

export function contentTypeInfo(id: ContentType) {
  return contentTypes.find((t) => t.id === id)!;
}

export function isVideoType(id: ContentType) {
  return contentTypeInfo(id).isVideo;
}
