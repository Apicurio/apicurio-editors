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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SaveIcon, UndoIcon } from "@patternfly/react-icons";
import { editor } from "monaco-editor";
import { SourceType } from "../OpenApiEditorModels.ts";
import { SectionSkeleton } from "./SectionSkeleton.tsx";
import { useDarkMode } from "./isDarkMode.ts";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export function SourceEditor({
  source,
  type,
  onChangeSourceType,
  onSave,
}: {
  source?: string;
  type: SourceType;
  onChangeSourceType: (source: string, targetSourceType: SourceType) => void;
  onSave: (source: string, sourceType: SourceType) => void;
}) {
  const [height, setHeight] = useState<number>(0);
  const darkMode = useDarkMode();

  const [code, setCode] = useState<string | undefined>(source);

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

  useEffect(() => {
    setCode(source);
    editorRef.current?.setValue(source ?? "");
  }, [source]);

  const onEditorDidMount: CodeEditorProps["onEditorDidMount"] = (e) => {
    editorRef.current = e;
  };

  const isDisabled = source === undefined;

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
                if (code) {
                  onSave(code, type);
                }
              }}
              isDisabled={isDisabled || source === code}
            >
              Save
            </CodeEditorControl>,
            <CodeEditorControl
              key={"undo"}
              icon={<UndoIcon />}
              onClick={() => {
                if (source) {
                  setCode(source);
                }
              }}
              aria-label={"Revert changes"}
              tooltipProps={{ content: "Revert changes" }}
              isDisabled={isDisabled || source === code}
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
                isSelected={(type ?? "yaml") === "yaml"}
                onClick={() => {
                  if (code) {
                    onChangeSourceType(code, "yaml");
                  }
                }}
                isDisabled={!source}
              />
              <ToggleGroupItem
                text={"JSON"}
                isSelected={type === "json"}
                onClick={() => {
                  if (code) {
                    onChangeSourceType(code, "json");
                  }
                }}
                isDisabled={!source}
              />
            </ToggleGroup>,
          ]}
          isLineNumbersVisible={true}
          isMinimapVisible={(code?.length ?? 0) < 1_000_000}
          isLanguageLabelVisible={false}
          onChange={(code) => setCode(code)}
          language={type === "json" ? Language.json : Language.yaml}
          height={`${height - 130}px`}
          onEditorDidMount={onEditorDidMount}
          emptyState={<SectionSkeleton count={5} />}
          isDarkTheme={darkMode}
          code={code}
        />
      )}
    </div>
  );
}
