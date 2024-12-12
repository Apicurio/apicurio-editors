import { init } from "@kie-tools-core/editor/dist/envelope";
import { NoOpKeyboardShortcutsService } from "@kie-tools-core/keyboard-shortcuts/dist/envelope";
import { TextEditorFactory } from "../TextEditorFactory";
import "./TextEditorEnvelope.css";

init({
  container: document.getElementById("text-envelope-app")!,
  bus: {
    postMessage: (message, _targetOrigin, _) =>
      window.parent.postMessage(message, "*", _),
  },
  editorFactory: new TextEditorFactory(),
  keyboardShortcutsService: new NoOpKeyboardShortcutsService(),
});
