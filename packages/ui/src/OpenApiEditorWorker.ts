import {
  CommandFactory,
  DefaultSeverityRegistry,
  ICommand,
  Library,
  Oas20Document,
  Oas30Document,
  OasDocument,
  OtCommand,
  OtEngine,
  TraverserDirection,
  VisitorUtil,
} from "@apicurio/data-models";
import { HasProblemVisitor } from "../../visitors/src/has-problems.visitor.ts";
import { FindPathItemsVisitor } from "../../visitors/src/path-items.visitor.ts";
import { FindResponseDefinitionsVisitor } from "../../visitors/src/response-definitions.visitor.ts";
import { FindSchemaDefinitionsVisitor } from "../../visitors/src/schema-definitions.visitor.ts";

import {
  DocumentNavigation,
  EditorModel,
  NavigationDataType,
  NavigationPath,
  NavigationResponse,
} from "./OpenApiEditorModels";

let document: OasDocument;
let otEngine: OtEngine;
let undoableCommandCount = 0;
let redoableCommandCount = 0;

function onCommand(command: ICommand): void {
  const otCmd: OtCommand = new OtCommand();
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
  document.paths.getPathItems().forEach((pathItem) => {
    VisitorUtil.visitNode(pathItem, viz);
  });
  const paths = viz.getSortedPathItems();
  return paths.map((p) => ({
    name: p.getPath(),
    validations: p.getValidationProblems(),
  }));
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
  return responses.map((p) => ({
    name: p.getName(),
    validations: p.getValidationProblems(),
  }));
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
  return responses.map((p) => {
    const viz = new HasProblemVisitor();
    VisitorUtil.visitTree(p, viz, TraverserDirection.down);
    console.log(p.getName(), viz.problemsFound);
    return {
      name: p.getName(),
      validations: p.getValidationProblems(),
    };
  });
}

export function getDocumentNavigation(filter = ""): DocumentNavigation {
  return {
    paths: getPaths(filter),
    responses: getResponses(filter),
    dataTypes: getDataTypes(filter),
  };
}

export async function getDocumentSnapshot(): Promise<EditorModel> {
  try {
    const canUndo = undoableCommandCount > 0;
    const canRedo = redoableCommandCount > 0;
    const vr = await Library.validateDocument(
      document,
      new DefaultSeverityRegistry(),
      []
    );
    const n = vr.find((v) => v.nodePath.toSegments().includes("A1GatewayMpis"));
    if (n) {
      console.log(n.nodePath.resolve(document));
    }
    return {
      document: {
        title: document.info.title,
        version: document.info.version,
        description: document.info.description,
        contactName: document.info.contact?.name,
        contactEmail: document.info.contact?.email,
        contactUrl: document.info.contact?.url,
        licenseName: document.info.license?.name,
        licenseUrl: document.info.license?.url,
        tags: document.tags?.map(({ name, description }) => ({
          name,
          description,
        })),
        servers: document.is3xDocument()
          ? (document as Oas30Document).servers?.map(
              ({ description, url }) => ({
                description,
                url,
              })
            )
          : [],
        securityScheme: [], // TODO
        securityRequirements: document.security?.flatMap((s) =>
          s.getSecurityRequirementNames()
        ),
      },
      navigation: getDocumentNavigation(),
      canUndo,
      canRedo,
    };
  } catch (e) {
    console.error(e);
    throw new Error("Couldn't convert the document");
  }
}

export async function updateDocumentTitle(title: string): Promise<EditorModel> {
  console.log("updateDocumentTitle", { title });
  onCommand(CommandFactory.createChangeTitleCommand(title));
  return getDocumentSnapshot();
}

export async function updateDocumentVersion(
  version: string
): Promise<EditorModel> {
  console.log("updateDocumentVersion", { version });
  onCommand(CommandFactory.createChangeVersionCommand(version));
  return getDocumentSnapshot();
}

export async function updateDocumentDescription(
  description: string
): Promise<EditorModel> {
  console.log("updateDocumentDescription", { description });
  onCommand(CommandFactory.createChangeDescriptionCommand(description));
  return getDocumentSnapshot();
}

export async function updateDocumentContactName(
  name: string
): Promise<EditorModel> {
  console.log("updateDocumentContactName", { name });
  onCommand(
    CommandFactory.createChangeContactCommand(
      name,
      document.info.contact.email,
      document.info.contact.url
    )
  );
  return getDocumentSnapshot();
}

export async function updateDocumentContactEmail(
  email: string
): Promise<EditorModel> {
  console.log("updateDocumentContactEmail", { email });
  onCommand(
    CommandFactory.createChangeContactCommand(
      document.info.contact.name,
      email,
      document.info.contact.url
    )
  );
  return getDocumentSnapshot();
}

export async function updateDocumentContactUrl(
  url: string
): Promise<EditorModel> {
  console.log("updateDocumentContactUrl", { url });
  onCommand(
    CommandFactory.createChangeContactCommand(
      document.info.contact.name,
      document.info.contact.email,
      url
    )
  );
  return getDocumentSnapshot();
}

export async function undoChange(): Promise<EditorModel> {
  if (undoableCommandCount > 0) {
    console.info("[ApiEditorComponent] User wants to 'undo' the last command.");
    const cmd = otEngine!.undoLastLocalCommand();
    // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
    if (cmd !== null) {
      undoableCommandCount--;
      redoableCommandCount++;
    }
  }
  return getDocumentSnapshot();
}

export async function redoChange(): Promise<EditorModel> {
  if (redoableCommandCount > 0) {
    console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
    const cmd = otEngine!.redoLastLocalCommand();
    // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
    if (cmd !== null) {
      undoableCommandCount++;
      redoableCommandCount--;
    }
  }
  return getDocumentSnapshot();
}
