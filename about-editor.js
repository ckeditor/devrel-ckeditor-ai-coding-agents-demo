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
const AUTOSAVE_WAITING_TIME = 1000;
const editableAbout = document.querySelector("#editable-about");
const originalData = editableAbout.innerHTML.replace(/>\s+</g, "><").trim();
const saveButton = document.querySelector("#save-about");
const resetButton = document.querySelector("#reset-about");
const statusElement = document.querySelector("#about-storage-status");
const licenseKey = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;
const aiTokenUrl = import.meta.env.VITE_CKEDITOR_AI_TOKEN_URL;
let initialData = null;
let skipNextAutosave = false;

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

function setStatus(message) {
  statusElement.textContent = message;
}

InlineEditor.create({
  root: {
    element: editableAbout,
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
    waitingTime: AUTOSAVE_WAITING_TIME,
    save: (editor) => {
      if (skipNextAutosave) {
        skipNextAutosave = false;
        return Promise.resolve();
      }

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
})
  .then((editor) => {
    if (initialData !== null) {
      setStatus("Restored saved content from this browser.");
    }

    saveButton.addEventListener("click", () => {
      try {
        localStorage.setItem(STORAGE_KEY, editor.getData());
        setStatus("Content saved locally in this browser.");
      } catch (error) {
        setStatus("Could not save content locally.");
        console.error("Could not save the About content to localStorage.", error);
      }
    });

    resetButton.addEventListener("click", () => {
      skipNextAutosave = editor.getData() !== originalData;
      editor.setData(originalData);

      try {
        localStorage.removeItem(STORAGE_KEY);
        setStatus("Content reset to the original copy; local storage cleared.");
      } catch (error) {
        setStatus("Content reset, but local storage could not be cleared.");
        console.error("Could not clear the About content from localStorage.", error);
      }
    });
  })
  .catch((error) => {
    console.error("CKEditor failed to initialize.", error);
  });
