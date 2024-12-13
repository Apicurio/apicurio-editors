import {
  CodeEditor,
  EditorDidMount,
  Language,
} from "@patternfly/react-code-editor";
import { FunctionComponent } from "react";

interface TextInnerProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInner: FunctionComponent<TextInnerProps> = ({
  value,
  onChange,
}) => {
  const onEditorDidMount: EditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 4 });
  };

  return (
    <>
      <CodeEditor
        isLanguageLabelVisible
        code={value}
        onChange={onChange}
        language={Language.json}
        onEditorDidMount={onEditorDidMount}
        height="800px"
      />
    </>
  );
};
