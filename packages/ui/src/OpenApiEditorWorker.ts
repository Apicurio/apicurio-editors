import {
  CommandFactory,
  ICommand,
  Library,
  OasDocument,
  OtCommand,
  OtEngine,
  VisitorUtil,
} from "@apicurio/data-models";
import { FindPathItemsVisitor } from "../../visitors/src/path-items.visitor.ts";
import { Document, DocumentNavigation, Path } from "./OpenApiEditorMachine.tsx";

let document: OasDocument | undefined = undefined;
let otEngine: OtEngine | undefined = undefined;
let undoableCommandCount = 0;
let redoableCommandCount = 0;

function onCommand(command: ICommand): void {
  let otCmd: OtCommand = new OtCommand();
  otCmd.command = command;
  otCmd.contentVersion = Date.now();

  otEngine!.executeCommand(otCmd, true);

  otEngine!.finalizeCommand(otCmd.contentVersion, otCmd.contentVersion);

  document = otEngine!.getCurrentDocument() as OasDocument;

  undoableCommandCount++;
  redoableCommandCount = 0;
}

export function parseOasSchema(schema: string) {
  try {
    document = Library.readDocumentFromJSONString(schema) as OasDocument;
    otEngine = new OtEngine(document);
    undoableCommandCount = 0;
    redoableCommandCount = 0;
  } catch (e) {
    console.error("parseOasSchema", { e, schema });
    throw new Error("Couldn't parse schema");
  }
}

export function getPaths(filter = ""): Path[] {
  const viz: FindPathItemsVisitor = new FindPathItemsVisitor(filter);
  if (document && document.paths) {
    document.paths.getPathItems().forEach((pathItem) => {
      VisitorUtil.visitNode(pathItem, viz);
    });
  }
  const paths = viz.getSortedPathItems();
  return paths.map((p) => ({ name: p._path, validations: [] }));
}

export function getDocumentNavigation(filter = ""): DocumentNavigation {
  return {
    paths: getPaths(filter),
    responses: [],
    dataTypes: [],
  };
}

export function getDocumentSnapshot(): Document {
  const title = document!.info.title;
  const canUndo = undoableCommandCount > 0;
  const canRedo = redoableCommandCount > 0;
  return {
    title,
    navigation: getDocumentNavigation(),
    canUndo,
    canRedo,
  };
}

export function editDocumentTitle(title: string): Document {
  console.log("setDocumentTitle", { title });
  onCommand(CommandFactory.createChangeTitleCommand(title));
  return getDocumentSnapshot();
}

export function undoChange(): Document {
  if (undoableCommandCount > 0) {
    console.info("[ApiEditorComponent] User wants to 'undo' the last command.");
    let cmd = otEngine!.undoLastLocalCommand();
    // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
    if (cmd !== null) {
      undoableCommandCount--;
      redoableCommandCount++;
    }
  }
  return getDocumentSnapshot();
}

export function redoChange(): Document {
  if (redoableCommandCount > 0) {
    console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
    let cmd = otEngine!.redoLastLocalCommand();
    // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
    if (cmd !== null) {
      undoableCommandCount++;
      redoableCommandCount--;
    }
  }
  return getDocumentSnapshot();
}
