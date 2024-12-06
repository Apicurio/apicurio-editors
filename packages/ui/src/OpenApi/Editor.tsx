import {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { NodeHeader } from "../components/NodeHeader.tsx";
import {
  Bullseye,
  Modal,
  ModalBody,
  ModalHeader,
  PageGroup,
  Spinner,
} from "@patternfly/react-core";
import classes from "../OpenApiEditor.module.css";
import { ValidationMessages } from "../components/ValidationMessages.tsx";
import { Overview } from "./overview/Overview.tsx";
import { Paths } from "./paths/Paths.tsx";
import { Path } from "./path/Path.tsx";
import { DataTypeDesigner } from "./dataType/DataTypeDesigner.tsx";
import { ResponseDesigner } from "./response/ResponseDesigner.tsx";
import { CodeEditor } from "./code/CodeEditor.tsx";
import {
  OpenApiEditorMachineContext,
  OpenApiEditorRef,
} from "../OpenApiEditor.tsx";

export type EditorProps = {
  spec: string;
  enableDesigner?: boolean;
  enableSource: boolean;
  getSourceAsYaml: () => Promise<string>;
  getSourceAsJson: () => Promise<string>;
};

export const Editor = forwardRef<OpenApiEditorRef, EditorProps>(function Editor(
  { spec, enableDesigner, enableSource, getSourceAsYaml, getSourceAsJson },
  ref,
) {
  const {
    isSavingSlowly,
    currentNode,
    mode,
    canUndo,
    canRedo,
    canGoBack,
    canGoForward,
    view,
  } = OpenApiEditorMachineContext.useSelector((state) => ({
    isSavingSlowly: state.matches({ editor: "slowSaving" }),
    mode: state.matches({ view: "code" })
      ? ("code" as const)
      : state.matches({ view: "validation" })
        ? ("hidden" as const)
        : ("design" as const),
    currentNode: state.context.currentNode,
    canUndo: state.context.canUndo,
    canRedo: state.context.canRedo,
    canGoBack: state.context.historyPosition > 0,
    canGoForward:
      state.context.historyPosition < state.context.history.length - 1,
    view: (() => {
      switch (true) {
        case state.matches({ view: "validation" }):
          return "validation" as const;
        case state.matches({ view: "overview" }):
          return "overview" as const;
        case state.matches({ view: "paths" }):
          return "paths" as const;
        case state.matches({ view: "path" }):
          return "path" as const;
        case state.matches({ view: "dataType" }):
          return "dataType" as const;
        case state.matches({ view: "response" }):
          return "response" as const;
        case state.matches({ view: "code" }):
          return "code" as const;
      }
    })(),
  }));

  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const contentRef = createRef<HTMLDivElement>();

  const prevSpec = useRef(spec);
  useEffect(() => {
    if (prevSpec.current !== spec) {
      actorRef.send({ type: "NEW_SPEC", spec });
      prevSpec.current = spec;
    }
  }, [actorRef, spec]);

  useImperativeHandle(ref, () => {
    return {
      updateDocument: (spec: string) => {
        actorRef.send({ type: "NEW_SPEC", spec });
      },
      getDocumentAsYaml: () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            actorRef.send({ type: "START_SAVING" });
            const source = await getSourceAsYaml();
            actorRef.send({ type: "END_SAVING" });
            resolve(source);
          }, 0);
        });
      },
      getDocumentAsJson: () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            actorRef.send({ type: "START_SAVING" });
            const source = await getSourceAsJson();
            actorRef.send({ type: "END_SAVING" });
            resolve(source);
          }, 0);
        });
      },
    };
  }, [actorRef, getSourceAsJson, getSourceAsYaml]);

  return (
    <>
      <NodeHeader
        canUndo={canUndo}
        canRedo={canRedo}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        enableDesigner={enableDesigner}
        enableSource={enableSource}
        contentRef={contentRef}
        mode={mode}
        currentNode={currentNode}
        onViewChange={(view) => {
          switch (view) {
            case "design":
              actorRef.send({ type: "GO_TO_DESIGNER_VIEW" });
              break;
            case "code":
              actorRef.send({ type: "GO_TO_CODE_VIEW" });
              break;
            case "hidden":
              break;
          }
        }}
        onUndo={() => {
          actorRef.send({ type: "UNDO" });
        }}
        onRedo={() => {
          actorRef.send({ type: "REDO" });
        }}
        onBack={() => {
          actorRef.send({ type: "BACK" });
        }}
        onForward={() => {
          actorRef.send({ type: "FORWARD" });
        }}
      />
      <PageGroup
        aria-label={"Editor content"}
        ref={contentRef}
        className={classes.editor}
        data-apicurio-editor
      >
        {(() => {
          switch (view) {
            case "validation":
              return <ValidationMessages />;
            case "overview":
              return <Overview />;
            case "paths":
              return <Paths />;
            case "path":
              return <Path />;
            case "dataType":
              return <DataTypeDesigner />;
            case "response":
              return <ResponseDesigner />;
            case "code":
              return <CodeEditor />;
          }
        })()}
      </PageGroup>
      <Modal
        isOpen={isSavingSlowly}
        aria-labelledby="modal-title"
        aria-describedby="modal-box-body"
        disableFocusTrap={true}
        variant={"small"}
        appendTo={() => document.getElementById("editor-container")!}
      >
        <ModalHeader title="Saving in progress..." labelId="modal-title" />
        <ModalBody id="modal-box-body">
          <Bullseye>
            <Spinner size={"xl"} />
          </Bullseye>
        </ModalBody>
      </Modal>
    </>
  );
});
