import {
  CommandFactory,
  DefaultSeverityRegistry,
  ICommand,
  Library,
  Oas20Document,
  Oas20ResponseDefinition,
  Oas20SchemaDefinition,
  Oas20SecurityDefinitions,
  Oas30Document,
  Oas30ResponseDefinition,
  Oas30SchemaDefinition,
  Oas30SecurityScheme,
  OasDocument,
  OasPathItem,
  OtCommand,
  OtEngine,
  SecurityScheme as DMSecurityScheme,
  VisitorUtil,
} from "@apicurio/data-models";
import { FindPathItemsVisitor } from "../../visitors/src/path-items.visitor.ts";
import { FindResponseDefinitionsVisitor } from "../../visitors/src/response-definitions.visitor.ts";
import { FindSchemaDefinitionsVisitor } from "../../visitors/src/schema-definitions.visitor.ts";

import {
  DocumentNavigation,
  EditorModel,
  NavigationDataType,
  NavigationPath,
  NavigationResponse,
  SelectedNode,
  SelectedNodeType,
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

function getOasPaths(_filter = ""): OasPathItem[] {
  const filter = _filter.toLowerCase();
  const viz = new FindPathItemsVisitor(filter);
  document.paths.getPathItems().forEach((pathItem) => {
    VisitorUtil.visitNode(pathItem, viz);
  });
  return viz.getSortedPathItems();
}

function getNavigationPaths(_filter = ""): NavigationPath[] {
  const filter = _filter.toLowerCase();
  const paths = getOasPaths(filter);
  return paths.map((p) => ({
    name: p.getPath(),
    validations: p.getValidationProblems(),
  }));
}

function getOasResponses(
  _filter = ""
): (Oas20ResponseDefinition | Oas30ResponseDefinition)[] {
  const filter = _filter.toLowerCase();
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
  return viz.getSortedResponseDefinitions();
}

function getNavigationResponses(_filter = ""): NavigationResponse[] {
  const filter = _filter.toLowerCase();
  const responses = getOasResponses(filter);
  return responses.map((p) => ({
    name: p.getName(),
    validations: p.getValidationProblems(),
  }));
}

function getOasDataTypes(
  filter = ""
): (Oas20SchemaDefinition | Oas30SchemaDefinition)[] {
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
  return viz.getSortedSchemaDefinitions();
}
function getNavigationDataTypes(filter = ""): NavigationDataType[] {
  const responses = getOasDataTypes(filter);
  return responses.map((p) => {
    return {
      name: p.getName(),
      validations: p.getValidationProblems(),
    };
  });
}

export function getDocumentNavigation(filter = ""): DocumentNavigation {
  return {
    paths: getNavigationPaths(filter),
    responses: getNavigationResponses(filter),
    dataTypes: getNavigationDataTypes(filter),
  };
}

function securitySchemes(): DMSecurityScheme[] {
  if (document.is2xDocument()) {
    const secdefs: Oas20SecurityDefinitions = (document as Oas20Document)
      .securityDefinitions;
    if (secdefs) {
      return secdefs.getSecuritySchemes().sort((scheme1, scheme2) => {
        return scheme1.getSchemeName().localeCompare(scheme2.getSchemeName());
      });
    }
    return [];
  } else {
    const doc: Oas30Document = document as Oas30Document;
    if (doc.components) {
      const schemes: Oas30SecurityScheme[] =
        doc.components.getSecuritySchemes();
      return schemes.sort((scheme1, scheme2) => {
        return scheme1.getSchemeName().localeCompare(scheme2.getSchemeName());
      });
    }
    return [];
  }
}

function getDocumentSnapshot() {
  return {
    type: "root" as const,
    path: "/" as const,
    node: {
      title: document.info.title,
      version: document.info.version,
      description: document.info.description,
      contactName: document.info.contact?.name,
      contactEmail: document.info.contact?.email,
      contactUrl: document.info.contact?.url,
      licenseName: document.info.license?.name,
      licenseUrl: document.info.license?.url,
      tags:
        document.tags?.map(({ name, description }) => ({
          name,
          description,
        })) ?? [],
      servers: document.is3xDocument()
        ? (document as Oas30Document).servers?.map(({ description, url }) => ({
            description,
            url,
          })) ?? []
        : [],
      securityScheme: securitySchemes().map((s) => ({
        name: s.getSchemeName(),
        description: s.description,
      })),
      securityRequirements:
        document.security?.map((s) => ({
          schemes: s.getSecurityRequirementNames() ?? [],
        })) ?? [],
      source: Library.writeNode(document),
    },
  };
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

export async function getNodeSnapshot(
  selectedNode: SelectedNodeType
): Promise<EditorModel> {
  console.log("getNodeSnapshot", selectedNode);
  try {
    const canUndo = undoableCommandCount > 0;
    const canRedo = redoableCommandCount > 0;
    const validationProblems = await Library.validateDocument(
      document,
      new DefaultSeverityRegistry(),
      []
    );

    const node = ((): SelectedNode => {
      switch (selectedNode.type) {
        case "path":
          return {
            type: "path",
            path: selectedNode.path,
            node: {},
          };
        case "datatype":
          return {
            type: "datatype",
            path: selectedNode.path,
            node: {},
          };
        case "response":
          return {
            type: "response",
            path: selectedNode.path,
            node: {},
          };
        case "root":
          return getDocumentSnapshot();
      }
    })();

    return {
      node,
      navigation: getDocumentNavigation(),
      canUndo,
      canRedo,
      validationProblems,
    };
  } catch (e) {
    console.error(e);
    throw new Error("Couldn't convert the document");
  }
}

export async function getNodeSource(
  selectedNode: SelectedNodeType
): Promise<EditorModel & { source: object }> {
  const source = (() => {
    try {
      switch (selectedNode.type) {
        case "datatype":
          return Library.writeNode(getOasDataTypes(selectedNode.path)[0]);
        case "response":
          return Library.writeNode(getOasResponses(selectedNode.path)[0]);
        case "path": {
          return Library.writeNode(getOasPaths(selectedNode.path)[0]);
        }
        case "root":
          return Library.writeNode(document);
      }
    } catch (e) {
      console.error("getNodeSource", selectedNode, e);
    }
  })();
  return { source, ...(await getNodeSnapshot(selectedNode)) };
}

export async function updateDocumentTitle(title: string): Promise<void> {
  console.log("updateDocumentTitle", { title });
  onCommand(CommandFactory.createChangeTitleCommand(title));
}

export async function updateDocumentVersion(version: string): Promise<void> {
  console.log("updateDocumentVersion", { version });
  onCommand(CommandFactory.createChangeVersionCommand(version));
}

export async function updateDocumentDescription(
  description: string
): Promise<void> {
  console.log("updateDocumentDescription", { description });
  onCommand(CommandFactory.createChangeDescriptionCommand(description));
}

export async function updateDocumentContactName(name: string): Promise<void> {
  console.log("updateDocumentContactName", { name });
  onCommand(
    CommandFactory.createChangeContactCommand(
      name,
      document.info.contact.email,
      document.info.contact.url
    )
  );
}

export async function updateDocumentContactEmail(email: string): Promise<void> {
  console.log("updateDocumentContactEmail", { email });
  onCommand(
    CommandFactory.createChangeContactCommand(
      document.info.contact.name,
      email,
      document.info.contact.url
    )
  );
}

export async function updateDocumentContactUrl(url: string): Promise<void> {
  console.log("updateDocumentContactUrl", { url });
  onCommand(
    CommandFactory.createChangeContactCommand(
      document.info.contact.name,
      document.info.contact.email,
      url
    )
  );
}

export async function undoChange(): Promise<void> {
  if (undoableCommandCount > 0) {
    console.info("[ApiEditorComponent] User wants to 'undo' the last command.");
    const cmd = otEngine!.undoLastLocalCommand();
    // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
    if (cmd !== null) {
      undoableCommandCount--;
      redoableCommandCount++;
    }
  }
}

export async function redoChange(): Promise<void> {
  if (redoableCommandCount > 0) {
    console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
    const cmd = otEngine!.redoLastLocalCommand();
    // TODO if the command is "pending" we need to hold on to the "undo" event until we get the ACK for the command - then we can send the "undo" with the updated contentVersion
    if (cmd !== null) {
      undoableCommandCount++;
      redoableCommandCount--;
    }
  }
}
