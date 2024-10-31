import { Skeleton } from "@patternfly/react-core";
import { useMachine } from "@xstate/react";
import { fromPromise } from "xstate";
import { documentTitleMachine } from "./DocumentTitleMachine.tsx";
import { InlineEdit } from "./InlineEdit.tsx";

export type DocumentTitleProps = {
  getDocumentTitle: () => Promise<string | undefined>;
  editDocumentTitle: (title: string) => Promise<void>;
};

export function DocumentTitle({
  getDocumentTitle,
  editDocumentTitle,
}: DocumentTitleProps) {
  const [state, send] = useMachine(
    documentTitleMachine.provide({
      actors: {
        getTitle: fromPromise(() => getDocumentTitle()),
        editTitle: fromPromise(({ input }) => editDocumentTitle(input)),
      },
    })
  );

  switch (state.value) {
    case "loading":
      return <Skeleton width={"300px"} />;
    case "idle":
    case "editing":
      return (
        <InlineEdit
          onChange={(title) => send({ type: "EDIT", title })}
          value={state.context.title}
          validator={(value) => {
            if (!value || value.length === 0) {
              return { status: "error", errMessages: ["Title can't be empty"] };
            }
            return { status: "default", errMessages: [] };
          }}
        />
      );
  }
}
