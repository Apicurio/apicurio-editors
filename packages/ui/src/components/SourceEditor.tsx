import {
  getResizeObserver,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import {
  CodeEditor,
  CodeEditorControl,
  CodeEditorProps,
  Language,
} from "@patternfly/react-code-editor";
import { useLayoutEffect, useRef, useState } from "react";
import { SaveIcon, UndoIcon } from "@patternfly/react-icons";
import YAML from "yaml";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export function SourceEditor({
  source,
  onSave,
}: {
  source: object;
  onSave: (obj: object) => void;
}) {
  const [mode, setMode] = useState<"json" | "yaml">("yaml");
  const [height, setHeight] = useState<number>(0);

  const initialSource =
    mode === "json" ? JSON.stringify(source, null, 2) : YAML.stringify(source);
  const [editorSource, setEditorSource] = useState(initialSource);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);

  useLayoutEffect(() => {
    let observer: ReturnType<typeof getResizeObserver>;
    getResizeObserver(document.body, () => {
      setHeight(0);
      const height = containerRef.current?.offsetHeight ?? 0;
      setHeight(height);
      if (editorRef.current) {
        editorRef.current.render(true);
      }
    });
    return () => {
      if (observer) {
        observer();
      }
    };
  }, []);

  const onEditorDidMount: CodeEditorProps["onEditorDidMount"] = (e) => {
    editorRef.current = e;
  };
  return (
    <div
      className={"pf-v6-u-p-md"}
      style={{
        flex: "1",
        overflowY: "hidden",
      }}
      ref={containerRef}
    >
      {height > 0 && (
        <CodeEditor
          key={height}
          customControls={[
            <CodeEditorControl
              key={"save"}
              icon={<SaveIcon />}
              aria-label="Save changes"
              tooltipProps={{ content: "Save changes" }}
              onClick={() => {
                try {
                  if (mode === "yaml") {
                    onSave(YAML.parse(editorSource));
                  } else if (mode === "json") {
                    onSave(JSON.parse(editorSource));
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              isDisabled={initialSource === editorSource}
            >
              Save
            </CodeEditorControl>,
            <CodeEditorControl
              key={"undo"}
              icon={<UndoIcon />}
              onClick={() => {
                setEditorSource(initialSource);
              }}
              aria-label={"Revert changes"}
              tooltipProps={{ content: "Revert changes" }}
              isDisabled={initialSource === editorSource}
            >
              Revert
            </CodeEditorControl>,
            <ToggleGroup
              isCompact={true}
              style={{ alignSelf: "center" }}
              key={"toggler"}
            >
              <ToggleGroupItem
                text={"YAML"}
                isSelected={mode === "yaml"}
                onClick={() => {
                  setMode("yaml");
                  setEditorSource(YAML.stringify(JSON.parse(editorSource)));
                }}
              />
              <ToggleGroupItem
                text={"JSON"}
                isSelected={mode === "json"}
                onClick={() => {
                  setMode("json");
                  setEditorSource(
                    JSON.stringify(YAML.parse(editorSource), null, 2)
                  );
                }}
              />
            </ToggleGroup>,
          ]}
          isLineNumbersVisible={true}
          isMinimapVisible={true}
          isLanguageLabelVisible={false}
          code={editorSource}
          onChange={setEditorSource}
          language={mode === "json" ? Language.json : Language.yaml}
          height={`${height - 90}px`}
          onEditorDidMount={onEditorDidMount}
        />
      )}
    </div>
  );
}
