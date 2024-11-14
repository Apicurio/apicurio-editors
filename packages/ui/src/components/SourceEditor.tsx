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
import { Source, SourceType } from "../OpenApiEditorModels.ts";
import { SectionSkeleton } from "./SectionSkeleton.tsx";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export function SourceEditor({
  source,
  onChangeSourceType,
  onSave,
}: {
  source?: Source;
  onChangeSourceType: (source: string, targetSourceType: SourceType) => void;
  onSave: (source: string, sourceType: SourceType) => void;
}) {
  const [height, setHeight] = useState<number>(0);

  const [code, setCode] = useState<string | undefined>(source?.source);
  const [mode, setMode] = useState(source?.type ?? "yaml");

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
    setCode(source?.source);
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
                  onSave(code, mode);
                }
              }}
              isDisabled={isDisabled || source.source === code}
            >
              Save
            </CodeEditorControl>,
            <CodeEditorControl
              key={"undo"}
              icon={<UndoIcon />}
              onClick={() => {
                if (source) {
                  setCode(source.source);
                }
              }}
              aria-label={"Revert changes"}
              tooltipProps={{ content: "Revert changes" }}
              isDisabled={isDisabled || source.source === code}
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
                isSelected={(mode ?? "yaml") === "yaml"}
                onClick={() => {
                  if (code) {
                    setMode("yaml");
                    onChangeSourceType(code, "yaml");
                  }
                }}
                isDisabled={!source}
              />
              <ToggleGroupItem
                text={"JSON"}
                isSelected={mode === "json"}
                onClick={() => {
                  if (code) {
                    setMode("json");
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
          language={source?.type === "json" ? Language.json : Language.yaml}
          height={`${height - 90}px`}
          onEditorDidMount={onEditorDidMount}
          emptyState={<SectionSkeleton count={5} />}
          code={code}
        />
      )}
    </div>
  );
}
