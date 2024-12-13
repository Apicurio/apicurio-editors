import {
  Editor,
  EditorFactory,
  EditorInitArgs,
  KogitoEditorChannelApi,
  KogitoEditorEnvelopeContextType,
} from "@kie-tools-core/editor/dist/api";
import { ApicurioEditorInterface } from "./ApicurioEditorInterface";

export class ApicurioEditorFactory
  implements EditorFactory<Editor, KogitoEditorChannelApi>
{
  createEditor(
    envelopeContext: KogitoEditorEnvelopeContextType<KogitoEditorChannelApi>,
    initArgs: EditorInitArgs
  ) {
    return Promise.resolve(
      new ApicurioEditorInterface(envelopeContext, initArgs)
    );
  }
}
