import {
  Editor,
  EditorFactory,
  EditorInitArgs,
  KogitoEditorChannelApi,
  KogitoEditorEnvelopeContextType,
} from "@kie-tools-core/editor/dist/api";
import { TextEditorInterface } from "./TextEditorInterface";

export class TextEditorFactory
  implements EditorFactory<Editor, KogitoEditorChannelApi>
{
  createEditor(
    envelopeContext: KogitoEditorEnvelopeContextType<KogitoEditorChannelApi>,
    initArgs: EditorInitArgs
  ) {
    return Promise.resolve(
      new TextEditorInterface(envelopeContext, initArgs)
    );
  }
}
