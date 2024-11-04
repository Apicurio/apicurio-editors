import { Button, SimpleList, SimpleListItem } from "@patternfly/react-core";
import { Path } from "../OpenApiEditorMachine.tsx";

export function Paths({ paths }: { paths: Path[] }) {
  return (
    <>
      {paths.length > 0 && (
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
        >
          {paths.map((p) => (
            <SimpleListItem key={p.name}>{p.name}</SimpleListItem>
          ))}
        </SimpleList>
      )}
      {paths.length === 0 && (
        <p>
          No paths have been created.{" "}
          <Button variant={"link"}>Add a path</Button>
        </p>
      )}
    </>
  );
}
