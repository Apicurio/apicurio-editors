import {
  CommandFactory,
  ICommand,
  Library,
  Oas20Document,
  Oas30Document,
  OasDocument,
  OtCommand,
  OtEngine,
  VisitorUtil,
} from "@apicurio/data-models";
import { FindPathItemsVisitor } from "../../visitors/src/path-items.visitor.ts";
import { FindResponseDefinitionsVisitor } from "../../visitors/src/response-definitions.visitor.ts";
import { FindSchemaDefinitionsVisitor } from "../../visitors/src/schema-definitions.visitor.ts";
import {
  Document,
  DocumentNavigation,
  NavigationDataType,
  NavigationPath,
  NavigationResponse,
} from "./OpenApiEditorMachine.tsx";

let document: OasDocument;
let otEngine: OtEngine;
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

export function getPaths(filter = ""): NavigationPath[] {
  const viz = new FindPathItemsVisitor(filter);
  if (document && document.paths) {
    document.paths.getPathItems().forEach((pathItem) => {
      VisitorUtil.visitNode(pathItem, viz);
    });
  }
  const paths = viz.getSortedPathItems();
  return paths.map((p) => ({ name: p._path, validations: [] }));
}

export function getResponses(filter = ""): NavigationResponse[] {
  const viz = new FindResponseDefinitionsVisitor(filter);
  if (document.is2xDocument() && (document as Oas20Document).responses) {
    (document as Oas20Document).responses.getResponses().forEach((response) => {
      VisitorUtil.visitNode(response, viz);
    });
  } else if (
    document.is3xDocument() &&
    (document as Oas30Document).components
  ) {
    (document as Oas30Document).components
      .getResponseDefinitions()
      .forEach((response) => {
        VisitorUtil.visitNode(response, viz);
      });
  }
  const responses = viz.getSortedResponseDefinitions();
  return responses.map((p) => ({ name: p._name, validations: [] }));
}

export function getDataTypes(filter = ""): NavigationDataType[] {
  const viz = new FindSchemaDefinitionsVisitor(filter);
  if (document.is2xDocument() && (document as Oas20Document).definitions) {
    (document as Oas20Document).definitions
      .getDefinitions()
      .forEach((definition) => {
        VisitorUtil.visitNode(definition, viz);
      });
  } else if (
    document.is3xDocument() &&
    (document as Oas30Document).components
  ) {
    (document as Oas30Document).components
      .getSchemaDefinitions()
      .forEach((definition) => {
        VisitorUtil.visitNode(definition, viz);
      });
  }
  const responses = viz.getSortedSchemaDefinitions();
  return responses.map((p) => ({ name: p._name, validations: [] }));
}

export function getDocumentNavigation(filter = ""): DocumentNavigation {
  return {
    paths: getPaths(filter),
    responses: getResponses(filter),
    dataTypes: getDataTypes(filter),
  };
}

export function getDocumentSnapshot(): Document {
  const title = document.info.title;
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
