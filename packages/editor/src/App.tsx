import {
  ChannelType,
  EditorEnvelopeLocator,
  EditorTheme,
  EnvelopeContentType,
  EnvelopeMapping,
} from "@kie-tools-core/editor/dist/api";
import { EmbeddedEditorFile } from "@kie-tools-core/editor/dist/channel";
import {
  EmbeddedEditor,
  useEditorRef,
  useStateControlSubscription,
} from "@kie-tools-core/editor/dist/embedded";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  Masthead,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Page,
  PageToggleButton,
} from "@patternfly/react-core";
import { BarsIcon } from "@patternfly/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { MenuButtons } from "./components/MenuButtons";

export const App = () => {
  const [file, setFile] = useState<
    | {
        path: string;
        content: string;
      }
    | undefined
  >(undefined);
  const [apicurioEmbeddedEditorFile, setApicurioEmbeddedEditorFile] =
    useState<EmbeddedEditorFile>();
  const [textEmbeddedEditorFile, setTextEmbeddedEditorFile] =
    useState<EmbeddedEditorFile>();
  const { editor: apicurioEditor, editorRef: apicurioEditorRef } =
    useEditorRef();
  const { editor: textEditor, editorRef: textEditorRef } = useEditorRef();
  const lastContent = useRef<string>();

  const apicurioEditorEnvelopeLocator = useMemo(
    () =>
      new EditorEnvelopeLocator(window.location.origin, [
        new EnvelopeMapping({
          type: "apicurio",
          filePathGlob: "**/**(.+(apicurio|camel)).+(yml|yaml)",
          resourcesPathPrefix: "",
          envelopeContent: {
            type: EnvelopeContentType.PATH,
            path: "src/apicurio-editor/envelope/apicurio-editor-envelope.html",
          },
        }),
      ]),
    []
  );

  const textEditorEnvelopeLocator = useMemo(
    () =>
      new EditorEnvelopeLocator(window.location.origin, [
        new EnvelopeMapping({
          type: "text",
          filePathGlob: "**/**(.+(apicurio|camel)).+(yml|yaml)",
          resourcesPathPrefix: "",
          envelopeContent: {
            type: EnvelopeContentType.PATH,
            path: "src/text-editor/envelope/text-editor-envelope.html",
          },
        }),
      ]),
    []
  );

  useEffect(() => {
    onNewContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUndo = useCallback(async () => {
    apicurioEditor?.undo();
  }, [apicurioEditor]);

  const onRedo = useCallback(async () => {
    apicurioEditor?.redo();
  }, [apicurioEditor]);

  const onGetContent = useCallback(
    async () => apicurioEditor?.getContent() ?? "",
    [apicurioEditor]
  );

  const onSetTheme = useCallback(
    async (theme: EditorTheme) => {
      apicurioEditor?.setTheme(theme);
    },
    [apicurioEditor]
  );

  const onValidate = useCallback(async () => {
    if (!apicurioEditor) {
      return;
    }

    const notifications = await apicurioEditor.validate();
    window.alert(JSON.stringify(notifications, undefined, 2));
  }, [apicurioEditor]);

  const onSetContent = useCallback((_path: string, content: string) => {
    const fileName = "new-document.apicurio.yaml";
    const extension = "yaml";

    setApicurioEmbeddedEditorFile({
      fileName: fileName,
      fileExtension: extension,
      getFileContents: async () => content,
      isReadOnly: false,
    });

    setTextEmbeddedEditorFile({
      fileName: fileName,
      fileExtension: extension,
      getFileContents: async () => content,
      isReadOnly: false,
    });
  }, []);

  const onNewContent = useCallback(() => {
    onSetContent(
      "new-document.apicurio.yml",
      `{
  "openapi": "3.0.3",
  "info": {
    "title": "Sample API"
  }
}`
    );
  }, [onSetContent]);

  useStateControlSubscription(
    apicurioEditor,
    useCallback(
      async (_isDirty) => {
        if (!apicurioEditor) {
          return;
        }

        const content = await apicurioEditor.getContent();
        setFile((prevState) => ({
          ...prevState!,
          content,
        }));
      },
      [apicurioEditor]
    )
  );

  useStateControlSubscription(
    textEditor,
    useCallback(
      async (_isDirty) => {
        if (!textEditor) {
          return;
        }

        const content = await textEditor.getContent();
        setFile((prevState) => ({
          ...prevState!,
          content,
        }));
      },
      [textEditor]
    )
  );

  const updateEditors = useCallback(
    async (f: { path: string; content: string }) => {
      if (!textEditor || !apicurioEditor) {
        return;
      }

      await apicurioEditor.setContent(f.path, f.content);
      await textEditor.setContent(f.path, f.content);
    },
    [apicurioEditor, textEditor]
  );

  useEffect(() => {
    if (file?.content === undefined || file.content === lastContent.current) {
      return;
    }

    lastContent.current = file.content;
    updateEditors(file);
  }, [file, updateEditors]);

  const masthead = (
    <Masthead>
      <MastheadMain style={{ gridColumn: "1 / -1" }}>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen
            id="vertical-nav-toggle"
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>

        <MastheadContent style={{ width: "100%" }}>
          <MenuButtons
            newContent={onNewContent}
            undo={onUndo}
            redo={onRedo}
            get={onGetContent}
            setTheme={onSetTheme}
            validate={onValidate}
          />
        </MastheadContent>
      </MastheadMain>
    </Masthead>
  );

  return (
    <Page masthead={masthead} isContentFilled>
      {apicurioEmbeddedEditorFile && (
        <Drawer isExpanded isInline>
          <DrawerContent
            panelContent={
              <DrawerPanelContent isResizable defaultSize="70%">
                <DrawerPanelBody style={{ padding: 0 }}>
                  <div className="editor-container">
                    {apicurioEmbeddedEditorFile && (
                      <EmbeddedEditor
                        ref={apicurioEditorRef}
                        file={apicurioEmbeddedEditorFile}
                        channelType={ChannelType.ONLINE}
                        editorEnvelopeLocator={apicurioEditorEnvelopeLocator}
                        locale="en"
                      />
                    )}
                  </div>
                </DrawerPanelBody>
              </DrawerPanelContent>
            }
          >
            <DrawerContentBody>
              <div className="editor-container">
                {textEmbeddedEditorFile && (
                  <EmbeddedEditor
                    ref={textEditorRef}
                    file={textEmbeddedEditorFile}
                    channelType={ChannelType.ONLINE}
                    editorEnvelopeLocator={textEditorEnvelopeLocator}
                    locale="en"
                  />
                )}
              </div>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}
    </Page>
  );
};
