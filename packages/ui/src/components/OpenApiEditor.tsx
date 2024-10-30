import { Paths, PathsProps } from "./Paths.tsx";

type OpenApiEditorProps = {} & PathsProps;

export function OpenApiEditor({ getPaths }: OpenApiEditorProps) {
  return (
    <div>
      Editor
      <Paths getPaths={getPaths} />
    </div>
  );
}
