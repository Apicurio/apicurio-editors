import {
  EditorApi,
  KogitoEditorChannelApi,
  KogitoEditorEnvelopeContextType,
} from "@kie-tools-core/editor/dist/api";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ApicurioInner } from "./ApicurioInner";

interface Props {
  envelopeContext: KogitoEditorEnvelopeContextType<KogitoEditorChannelApi>;
  onNewEdit: (content: string) => Promise<void>;
}

export const ApicurioEditor = forwardRef<EditorApi, Props>(
  ({ envelopeContext, onNewEdit }, forwardedRef) => {
    const [editorContent, setEditorContent] = useState("");

    const getContent = useCallback(() => {
      return editorContent;
    }, [editorContent]);

    const getPreview = useCallback(() => {
      return editorContent;
    }, [editorContent]);

    const setContent = useCallback((_path: string, content: string) => {
      setEditorContent(content);
    }, []);

    useImperativeHandle(forwardedRef, () => {
      return {
        setContent: (path: string, content: string) =>
          Promise.resolve(setContent(path, content)),
        getContent: () => Promise.resolve(getContent()),
        getPreview: () => Promise.resolve(getPreview()),
        undo: () => Promise.resolve(),
        redo: () => Promise.resolve(),
        validate: () => Promise.resolve([]),
        setTheme: () => Promise.resolve(),
      };
    });

    useEffect(() => {
      envelopeContext.channelApi.notifications.kogitoEditor_ready.send();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = useCallback(
      (value: string) => {
        setEditorContent(value);
        onNewEdit(value);
      },
      [onNewEdit]
    );

    return <ApicurioInner value={editorContent} onChange={onChange} />;
  }
);
