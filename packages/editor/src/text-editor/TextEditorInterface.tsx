import {
  Editor,
  EditorApi,
  EditorInitArgs,
  EditorTheme,
  KogitoEditorChannelApi,
  KogitoEditorEnvelopeContextType,
} from "@kie-tools-core/editor/dist/api";
import { WorkspaceEdit } from '@kie-tools-core/workspace/dist/api';
import { Notification } from "@kie-tools-core/notifications/dist/api";
import { RefObject, createRef } from "react";
import { TextEditor } from "./TextEditor";

export class TextEditorInterface implements Editor {
  private editorRef: RefObject<EditorApi>;
  public af_isReact = true;
  public af_componentId = "text-editor";
  public af_componentTitle = "Text Editor";

  constructor(
    protected readonly envelopeContext: KogitoEditorEnvelopeContextType<KogitoEditorChannelApi>,
    protected readonly initArgs: EditorInitArgs
  ) {
    this.editorRef = createRef<EditorApi>();
    this.getContent = this.getContent.bind(this);
    this.setContent = this.setContent.bind(this);
    this.getPreview = this.getPreview.bind(this);
    this.sendNewEdit = this.sendNewEdit.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.validate = this.validate.bind(this);
    this.setTheme = this.setTheme.bind(this);
  }

  async getContent(): Promise<string> {
    return this.editorRef.current?.getContent() ?? "";
  }

  async setContent(path: string, content: string): Promise<void> {
    return this.editorRef.current?.setContent(path, content);
  }

  async getPreview(): Promise<string | undefined> {
    return this.editorRef.current?.getPreview();
  }

  async sendNewEdit(content: string): Promise<void> {
    const edit = new WorkspaceEdit(content);
    this.envelopeContext.channelApi.notifications.kogitoWorkspace_newEdit.send(edit);
  }

  async undo(): Promise<void> {
    return this.editorRef.current?.undo();
  }

  async redo(): Promise<void> {
    return this.editorRef.current?.redo();
  }

  async validate(): Promise<Notification[]> {
    return this.editorRef.current?.validate() ?? [];
  }

  async setTheme(theme: EditorTheme): Promise<void> {
    return this.editorRef.current?.setTheme(theme);
  }

  af_componentRoot() {
    return (
      <TextEditor
        ref={this.editorRef}
        envelopeContext={this.envelopeContext}
        onNewEdit={this.sendNewEdit}
      />
    );
  }
}
