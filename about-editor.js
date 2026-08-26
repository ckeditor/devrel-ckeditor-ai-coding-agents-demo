import {
  Bold,
  Autosave,
  Essentials,
  Heading,
  InlineEditor,
  Italic,
  Mention,
  Paragraph,
} from "ckeditor5";
import {
  AIChat,
  AIChatShortcuts,
  AIEditorIntegration,
  AIQuickActions,
  FormatPainter,
  SlashCommand,
} from "ckeditor5-premium-features";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";

const STORAGE_KEY = "trailhead:about-html";
const licenseKey = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;
const aiTokenUrl = import.meta.env.VITE_CKEDITOR_AI_TOKEN_URL;
let initialData = null;

try {
  initialData = localStorage.getItem(STORAGE_KEY);
} catch (error) {
  console.warn("Could not restore the About content from localStorage.", error);
}

const aiPlugins = aiTokenUrl
  ? [AIChat, AIChatShortcuts, AIQuickActions, AIEditorIntegration]
  : [];
const aiToolbarItems = aiTokenUrl
  ? ["toggleAi", "aiQuickActions", "ask-ai", "improve-writing"]
  : [];

if (!aiTokenUrl) {
  console.warn(
    "CKEditor AI is disabled until VITE_CKEDITOR_AI_TOKEN_URL is configured."
  );
}

InlineEditor.create({
  root: {
    element: document.querySelector("#editable-about"),
    ...(initialData !== null ? { initialData } : {}),
  },
  licenseKey: licenseKey || "<YOUR_LICENSE_KEY>",
  plugins: [
    Autosave,
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Mention,
    FormatPainter,
    SlashCommand,
    ...aiPlugins,
  ],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "formatPainter",
    "|",
    "undo",
    "redo",
    "|",
    ...aiToolbarItems,
  ],
  autosave: {
    waitingTime: 1000,
    save: (editor) => {
      try {
        localStorage.setItem(STORAGE_KEY, editor.getData());
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
  ...(aiTokenUrl
    ? {
        cloudServices: {
          tokenUrl: aiTokenUrl,
        },
        collaboration: {
          channelId: "trailhead-about",
        },
        ai: {
          serviceUrl: "https://ai.cke-cs.com/v1",
          container: {
            type: "overlay",
            side: "right",
            visibleByDefault: false,
          },
        },
      }
    : {}),
}).catch((error) => {
  console.error("CKEditor failed to initialize.", error);
});
