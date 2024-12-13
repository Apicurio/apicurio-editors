import { EditorTheme } from "@kie-tools-core/editor/dist/api";
import { Button } from "@patternfly/react-core/dist/js/components/Button";
import { Switch } from "@patternfly/react-core/dist/js/components/Switch";
import { useState } from "react";
import "./MenuButtons.css";

interface MenuButtonsProps {
  newContent: () => void;
  undo: () => void;
  redo: () => void;
  get: () => Promise<string>;
  setTheme: (theme: EditorTheme) => void;
  validate: () => void;
}

export const MenuButtons = (props: MenuButtonsProps) => {
  const [theme, setTheme] = useState<EditorTheme>(EditorTheme.LIGHT);

  return (
    <div className="menu-buttons">
      <Button className="spacer" variant="primary" onClick={props.newContent}>
        New YAML
      </Button>

      <Button className="spacer" variant="secondary" onClick={props.undo}>
        Undo
      </Button>

      <Button className="spacer" variant="secondary" onClick={props.redo}>
        Redo
      </Button>

      <Button className="spacer" variant="tertiary" onClick={props.validate}>
        Validate
      </Button>

      <Switch
        id="theme"
        label="Dark"
        checked={theme === EditorTheme.DARK}
        onChange={(checked) => {
          setTheme(checked ? EditorTheme.DARK : EditorTheme.LIGHT);
          props.setTheme(checked ? EditorTheme.DARK : EditorTheme.LIGHT);
        }}
      />
    </div>
  );
};
