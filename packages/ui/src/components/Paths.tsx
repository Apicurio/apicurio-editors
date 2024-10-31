import { Button, SimpleList, SimpleListItem } from "@patternfly/react-core";

export function Paths({ paths }: { paths: string[] }) {
  return (
    <>
      {paths.length > 0 && (
        <SimpleList
          className={"pf-v5-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
        >
          {paths.map((p) => (
            <SimpleListItem key={p}>{p}</SimpleListItem>
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
