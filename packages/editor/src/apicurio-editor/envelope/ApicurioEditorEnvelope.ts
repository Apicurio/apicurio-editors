import { init } from "@kie-tools-core/editor/dist/envelope";
import { NoOpKeyboardShortcutsService } from "@kie-tools-core/keyboard-shortcuts/dist/envelope";
import { ApicurioEditorFactory } from "../ApicurioEditorFactory";
import "./ApicurioEditorEnvelope.css";

init({
  container: document.getElementById("apicurio-envelope-app")!,
  bus: {
    postMessage: (message, _targetOrigin, _) =>
      window.parent.postMessage(message, "*", _),
  },
  editorFactory: new ApicurioEditorFactory(),
  keyboardShortcutsService: new NoOpKeyboardShortcutsService(),
});
