import {
  Bold,
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

const licenseKey = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;
const aiTokenUrl = import.meta.env.VITE_CKEDITOR_AI_TOKEN_URL;
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
  },
  licenseKey: licenseKey || "<YOUR_LICENSE_KEY>",
  plugins: [
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
