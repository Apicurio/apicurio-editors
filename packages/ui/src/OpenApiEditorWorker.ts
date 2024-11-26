import * as DM from "@apicurio/data-models";
import { Oas20Operation } from "@apicurio/data-models";
import { FindPathItemsVisitor } from "../../visitors/src/path-items.visitor.ts";
import { FindResponseDefinitionsVisitor } from "../../visitors/src/response-definitions.visitor.ts";
import { FindSchemaDefinitionsVisitor } from "../../visitors/src/schema-definitions.visitor.ts";
import YAML from "yaml";

import {
  DataTypeProperty,
  Document,
  DocumentDataType,
  DocumentNavigation,
  DocumentPath,
  DocumentResponse,
  EditorModel,
  NavigationDataType,
  NavigationPath,
  NavigationResponse,
  NodeDataType,
  NodePath,
  NodeResponse,
  Operation,
  SelectedNode,
  Server,
  Source,
  SourceType,
  Validation,
} from "./OpenApiEditorModels";
import { FindSelectedNodeVisitor } from "../../visitors/src/find-selected-node.visitor.ts";

let document: DM.OasDocument;
let otEngine: DM.OtEngine;
let undoableCommandCount = 0;
let redoableCommandCount = 0;

function onCommand(command: DM.ICommand): void {
  const otCmd: DM.OtCommand = new DM.OtCommand();
  otCmd.command = command;
  otCmd.contentVersion = Date.now();

  otEngine!.executeCommand(otCmd, true);

  otEngine!.finalizeCommand(otCmd.contentVersion, otCmd.contentVersion);

  document = otEngine!.getCurrentDocument() as DM.OasDocument;

  undoableCommandCount++;
  redoableCommandCount = 0;
}

function findSelectedNode(problem: DM.ValidationProblem): SelectedNode {
  const node = problem.nodePath.resolve(document);

  // no node found?  weird, return the root
  if (node === null) {
    return {
      type: "root",
    };
  }

  const viz: FindSelectedNodeVisitor = new FindSelectedNodeVisitor(
    problem.nodePath
  );
  DM.VisitorUtil.visitTree(node, viz, DM.TraverserDirection.up);
  return (
    viz.selectedNode || {
      type: "root",
    }
  );
}

function getOasPaths(_filter = ""): DM.OasPathItem[] {
  const filter = _filter.toLowerCase();
  const viz = new FindPathItemsVisitor(filter);
  document.paths.getPathItems().forEach((pathItem) => {
    DM.VisitorUtil.visitNode(pathItem, viz);
  });
  return viz.getSortedPathItems();
}

function getNavigationPaths(_filter = ""): NavigationPath[] {
  const filter = _filter.toLowerCase();
  const paths = getOasPaths(filter);
  return paths.map((p) => ({
    type: "path",
    path: p.getPath(),
    nodePath: DM.Library.createNodePath(p).toString(),
  }));
}

function getOasResponses(
  _filter = ""
): (DM.Oas20ResponseDefinition | DM.Oas30ResponseDefinition)[] {
  const filter = _filter.toLowerCase();
  const viz = new FindResponseDefinitionsVisitor(filter);
  if (document.is2xDocument() && (document as DM.Oas20Document).responses) {
    (document as DM.Oas20Document).responses
      .getResponses()
      .forEach((response) => {
        DM.VisitorUtil.visitNode(response, viz);
      });
  } else if (
    document.is3xDocument() &&
    (document as DM.Oas30Document).components
  ) {
    (document as DM.Oas30Document).components
      .getResponseDefinitions()
      .forEach((response) => {
        DM.VisitorUtil.visitNode(response, viz);
      });
  }
  return viz.getSortedResponseDefinitions();
}

function getNavigationResponses(_filter = ""): NavigationResponse[] {
  const filter = _filter.toLowerCase();
  const responses = getOasResponses(filter);
  return responses.map((p) => ({
    type: "response",
    name: p.getName(),
    nodePath: DM.Library.createNodePath(p).toString(),
  }));
}

function resolveNode(nodePath: string): DM.Node {
  const np = new DM.NodePath(nodePath);
  return np.resolve(document);
}

function getOasDataTypes(
  filter = ""
): (DM.Oas20SchemaDefinition | DM.Oas30SchemaDefinition)[] {
  const viz = new FindSchemaDefinitionsVisitor(filter);
  if (document.is2xDocument() && (document as DM.Oas20Document).definitions) {
    (document as DM.Oas20Document).definitions
      .getDefinitions()
      .forEach((definition) => {
        DM.VisitorUtil.visitNode(definition, viz);
      });
  } else if (
    document.is3xDocument() &&
    (document as DM.Oas30Document).components
  ) {
    (document as DM.Oas30Document).components
      .getSchemaDefinitions()
      .forEach((definition) => {
        DM.VisitorUtil.visitNode(definition, viz);
      });
  }
  return viz.getSortedSchemaDefinitions();
}
function getNavigationDataTypes(filter = ""): NavigationDataType[] {
  const responses = getOasDataTypes(filter);
  return responses.map((p) => {
    return {
      type: "datatype",
      name: p.getName(),
      nodePath: DM.Library.createNodePath(p).toString(),
    };
  });
}

export async function getDocumentNavigation(
  filter = ""
): Promise<DocumentNavigation> {
  return {
    paths: getNavigationPaths(filter),
    responses: getNavigationResponses(filter),
    dataTypes: getNavigationDataTypes(filter),
  };
}

function securitySchemes(): DM.SecurityScheme[] {
  if (document.is2xDocument()) {
    const secdefs: DM.Oas20SecurityDefinitions = (document as DM.Oas20Document)
      .securityDefinitions;
    if (secdefs) {
      return secdefs.getSecuritySchemes().sort((scheme1, scheme2) => {
        return scheme1.getSchemeName().localeCompare(scheme2.getSchemeName());
      });
    }
    return [];
  } else {
    const doc: DM.Oas30Document = document as DM.Oas30Document;
    if (doc.components) {
      const schemes: DM.Oas30SecurityScheme[] =
        doc.components.getSecuritySchemes();
      return schemes.sort((scheme1, scheme2) => {
        return scheme1.getSchemeName().localeCompare(scheme2.getSchemeName());
      });
    }
    return [];
  }
}

export async function parseOpenApi(schema: string) {
  console.log("parseOpenApi", { schema });
  try {
    document = DM.Library.readDocumentFromJSONString(schema) as DM.OasDocument;
    otEngine = new DM.OtEngine(document);
    undoableCommandCount = 0;
    redoableCommandCount = 0;
  } catch (e) {
    console.error("parseDM.OasSchema", { e, schema });
    throw new Error("Couldn't parse schema");
  }
}

function oasOperationToOperation(
  operation?: DM.Operation
): Operation | undefined {
  if (operation) {
    return {
      summary: operation.summary,
      description: operation.description,
      id: operation.operationId,
      tags: (operation as Oas20Operation).tags,
      servers: [],
      queryParameters: "TODO",
      headerParameters: "TODO",
      cookieParameters: "TODO",
      requestBody: undefined,
      responses: [],
      securityRequirements: [],
    };
  }
}

function oasNodeToPath(_path: DM.Node): DocumentPath {
  if (document.is3xDocument()) {
    const path = _path as DM.Oas30PathItem;
    const summary = path.summary;
    const description = path.description;
    const servers: Server[] = [];
    const operations = {
      get: oasOperationToOperation(path.get),
      put: oasOperationToOperation(path.put),
      post: oasOperationToOperation(path.post),
      delete: oasOperationToOperation(path.delete),
      options: oasOperationToOperation(path.options),
      head: oasOperationToOperation(path.head),
      patch: oasOperationToOperation(path.patch),
      trace: oasOperationToOperation(path["trace"]),
    };
    return {
      node: {
        type: "path",
        path: path.getPath(),
        nodePath: DM.Library.createNodePath(_path).toString(),
      },
      summary,
      description,
      servers,
      operations,
      queryParameters: "TODO",
      headerParameters: "TODO",
      cookieParameters: "TODO",
    };
  } else {
    const path = _path as DM.Oas20PathItem;
    const operations = {
      get: oasOperationToOperation(path.get),
      put: oasOperationToOperation(path.put),
      post: oasOperationToOperation(path.post),
      delete: oasOperationToOperation(path.delete),
      options: oasOperationToOperation(path.options),
      head: oasOperationToOperation(path.head),
      patch: oasOperationToOperation(path.patch),
      trace: undefined,
    };
    return {
      node: {
        type: "path",
        path: path.getPath(),
        nodePath: DM.Library.createNodePath(_path).toString(),
      },
      summary: "",
      description: "",
      servers: [],
      operations,
      queryParameters: "TODO",
      headerParameters: "TODO",
      cookieParameters: "TODO",
    };
  }
}

export async function getPathSnapshot(node: NodePath): Promise<DocumentPath> {
  const path = resolveNode(node.nodePath);
  return oasNodeToPath(path);
}

export async function getDataTypeSnapshot(
  node: NodeDataType
): Promise<DocumentDataType> {
  const schema = resolveNode(node.nodePath) as DM.OasSchema;

  const description = schema.description;
  const properties: DataTypeProperty[] = schema.getProperties().map((_p) => {
    const p = _p as DM.Oas30Schema.Oas30PropertySchema;
    function isRequired() {
      const required = schema.required;
      if (required && required.length > 0) {
        return required.indexOf(p.getPropertyName()) != -1;
      }
      return false;
    }
    function typeToString() {
      const st = DM.SimplifiedPropertyType.fromPropertySchema(
        p
      ) as DM.SimplifiedType;
      if (st.isRef()) {
        return st.type.substr(st.type.lastIndexOf("/") + 1);
      } else if (st.isArray()) {
        if (st.of && st.of.as) {
          return "Array of: " + st.of.type + " as " + st.of.as;
        }
        if (st.of && st.of.isSimpleType()) {
          return "Array of: " + st.of.type;
        }
        if (st.of && st.of.isRef()) {
          return (
            "Array of: " + st.of.type.substr(st.of.type.lastIndexOf("/") + 1)
          );
        }
        return "Array";
      } else if (st.isEnum()) {
        return `Enum (${st.enum_.length} items)`;
      } else if (st.isSimpleType()) {
        if (st.as) {
          return st.type + " as " + st.as;
        } else {
          return st.type;
        }
      } else {
        return "No Type";
      }
    }
    return {
      name: p.getPropertyName(),
      description: p.description,
      required: isRequired(),
      type: typeToString(),
    };
  });

  console.log("getDataTypeSnapshot", { description, properties });
  return {
    description,
    properties,
  };
}

export async function getResponseSnapshot(
  node: NodeResponse
): Promise<DocumentResponse> {
  const response = resolveNode(node.nodePath);

  if (document.is3xDocument()) {
    const schemaOas30 = response as DM.Oas30ResponseDefinition;
    const description = schemaOas30.description;
    return {
      description,
    };
  } else {
    return {
      description: "",
    };
  }
}

export async function getDocumentSnapshot(): Promise<Document> {
  console.log("getDocumentSnapshot");
  return {
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
      ? (document as DM.Oas30Document).servers?.map(({ description, url }) => ({
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
    paths: getOasPaths().map(oasNodeToPath),
  };
}

export async function getNodeSource(
  selectedNode: SelectedNode,
  sourceType: SourceType
): Promise<Source> {
  console.log("getNodeSource", { selectedNode });
  const source = ((): object => {
    try {
      switch (selectedNode.type) {
        case "datatype":
        case "response":
        case "path":
          return DM.Library.writeNode(resolveNode(selectedNode.nodePath));
        case "root":
          return DM.Library.writeNode(document);
      }
    } catch (e) {
      console.error("getNodeSource", selectedNode, e);
    }
    return {};
  })();
  return {
    source:
      sourceType === "yaml" ? YAML.stringify(source) : JSON.stringify(source),
    type: sourceType,
  };
}

export async function convertSource(
  source: string,
  targetType: SourceType
): Promise<Source> {
  console.log("convertSource", { source, targetType });
  switch (targetType) {
    case "yaml":
      return {
        source: YAML.stringify(JSON.parse(source)),
        type: targetType,
      };
    case "json":
      return {
        source: JSON.stringify(YAML.parse(source), null, 2),
        type: targetType,
      };
  }
}

export async function getEditorState(filter: string): Promise<EditorModel> {
  console.log("getEditorState", { filter });
  try {
    const canUndo = undoableCommandCount > 0;
    const canRedo = redoableCommandCount > 0;
    const validationProblems = await DM.Library.validateDocument(
      document,
      new DM.DefaultSeverityRegistry(),
      []
    );

    return {
      documentTitle: document.info.title,
      navigation: await getDocumentNavigation(filter),
      canUndo,
      canRedo,
      validationProblems: validationProblems.map((v): Validation => {
        const severity = (() => {
          switch (v.severity) {
            case DM.ValidationProblemSeverity.ignore:
            case DM.ValidationProblemSeverity.low:
              return "info";
            case DM.ValidationProblemSeverity.medium:
              return "warning";
            case DM.ValidationProblemSeverity.high:
              return "danger";
          }
        })();
        const nodePath = v.nodePath.toString();
        const node = findSelectedNode(v);
        return {
          severity,
          message: v.message,
          nodePath,
          node,
        };
      }),
    };
  } catch (e) {
    console.error(e);
    throw new Error("Couldn't convert the document");
  }
}

export async function updateDocumentTitle(title: string): Promise<void> {
  console.log("updateDocumentTitle", { title });
  onCommand(DM.CommandFactory.createChangeTitleCommand(title));
}

export async function updateDocumentVersion(version: string): Promise<void> {
  console.log("updateDocumentVersion", { version });
  onCommand(DM.CommandFactory.createChangeVersionCommand(version));
}

export async function updateDocumentDescription(
  description: string
): Promise<void> {
  console.log("updateDocumentDescription", { description });
  onCommand(DM.CommandFactory.createChangeDescriptionCommand(description));
}

export async function updateDocumentContactName(name: string): Promise<void> {
  console.log("updateDocumentContactName", { name });
  onCommand(
    DM.CommandFactory.createChangeContactCommand(
      name,
      document.info.contact.email,
      document.info.contact.url
    )
  );
}

export async function updateDocumentContactEmail(email: string): Promise<void> {
  console.log("updateDocumentContactEmail", { email });
  onCommand(
    DM.CommandFactory.createChangeContactCommand(
      document.info.contact.name,
      email,
      document.info.contact.url
    )
  );
}

export async function updateDocumentContactUrl(url: string): Promise<void> {
  console.log("updateDocumentContactUrl", { url });
  onCommand(
    DM.CommandFactory.createChangeContactCommand(
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
