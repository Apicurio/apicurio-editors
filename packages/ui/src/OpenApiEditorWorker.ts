import * as DM from "@apicurio/data-models";
import {
  ModelTypeUtil,
  NodePathUtil,
  OpenApiOperation,
  OpenApiParameter,
  OpenApiPathItem,
  TraverserDirection,
  VisitorUtil,
} from "@apicurio/data-models";
import { FindPathItemsVisitor } from "../../visitors/src/path-items.visitor.ts";
import { FindResponseDefinitionsVisitor } from "../../visitors/src/response-definitions.visitor.ts";
import { FindSchemaDefinitionsVisitor } from "../../visitors/src/schema-definitions.visitor.ts";
import YAML from "yaml";

import {
  DataType,
  DataTypeProperty,
  Document,
  DocumentNavigation,
  EditorModel,
  NavigationDataType,
  NavigationPath,
  NavigationResponse,
  NodeDataType,
  NodePath,
  NodeResponse,
  Operation,
  Path,
  Paths,
  Response,
  SecurityRequirements,
  SecuritySchemes,
  SelectedNode,
  Server,
  Servers,
  Source,
  SourceType,
  Tags,
  Validation,
} from "./OpenApiEditorModels";
import { FindSelectedNodeVisitor } from "../../visitors/src/find-selected-node.visitor.ts";
import { keyBy, merge, values } from "lodash";
import { SimplifiedType } from "./types/SimplifiedType.ts";
import { SimplifiedPropertyType } from "./types/SimplifiedPropertyType.ts";
import { FindSecuritySchemesVisitor } from "../../visitors/src/security-schemes.visitor.ts";

let document: DM.Document;

class CommandStack {
  commands: DM.ICommand[] = [];
  commandIndex: number = 0; // Points to the most recently executed command

  public executeCommand(command: DM.ICommand): void {
    command.execute(document);
    if (this.commands.length !== 0) {
      this.commands = this.commands.slice(0, this.commandIndex + 1);
    }
    this.commands.push(command);
    this.commandIndex = this.commands.length - 1;
  }

  public undoCommand(): boolean {
    if (this.commandIndex >= 0) {
      const commandToUndo: DM.ICommand = this.commands[this.commandIndex];
      commandToUndo.undo(document);
      this.commandIndex--;
      return true;
    }
    return false;
  }

  public redoCommand(): boolean {
    if (this.commandIndex < this.commands.length) {
      const commandToRedo: DM.ICommand = this.commands[this.commandIndex + 1];
      commandToRedo.execute(document);
      this.commandIndex++;
      return true;
    }
    return false;
  }

  public getUndoableCommandCount(): number {
    return this.commandIndex;
  }

  public getRedoableCommandCount(): number {
    return this.commands.length - (this.commandIndex + 1);
  }
}

let commandStack: CommandStack = new CommandStack();

function onCommand(command: DM.ICommand): void {
  commandStack.executeCommand(command);
}

function findSelectedNode(problem: DM.ValidationProblem): SelectedNode {
  const node = NodePathUtil.resolveNodePath(problem.nodePath, document);

  // no node found?  weird, return the root
  if (node === null) {
    return {
      type: "root",
    };
  }

  const viz: FindSelectedNodeVisitor = new FindSelectedNodeVisitor(
    problem.nodePath,
  );
  DM.VisitorUtil.visitTree(node, viz, DM.TraverserDirection.up);
  return (
    viz.selectedNode || {
      type: "root",
    }
  );
}

function simplifiedTypeToString(st: SimplifiedType): string {
  if (!st) {
    return "No Type";
  }
  if (st.isRef()) {
    return st.type!.substr(st.type!.lastIndexOf("/") + 1);
  } else if (st.isArray()) {
    if (st.of && st.of.as) {
      return "Array of: " + st.of.type + " as " + st.of.as;
    }
    if (st.of && st.of.isSimpleType()) {
      return "Array of: " + st.of.type;
    }
    if (st.of && st.of.isRef()) {
      return (
        "Array of: " + st.of.type!.substr(st.of.type!.lastIndexOf("/") + 1)
      );
    }
    return "Array";
  } else if (st.isEnum()) {
    return `Enum (${st.enum_.length} items)`;
  } else if (st.isSimpleType()) {
    if (st.as) {
      return st.type + " as " + st.as;
    } else {
      return st.type!;
    }
  } else {
    return "No Type";
  }
}

function parameterToTypeToString(p: DM.OpenApiParameter): string {
  try {
    const st = SimplifiedPropertyType.fromSchema(
      p.getSchema() as DM.OpenApi30Schema,
    );
    return simplifiedTypeToString(st);
  } catch (e) {
    console.error("propertySchemaToTypeToString", e);
  }
  return "Unknown type";
}

function propertySchemaToTypeToString(p: DM.Schema) {
  try {
    const st = SimplifiedPropertyType.fromPropertySchema(p);
    return simplifiedTypeToString(st);
  } catch (e) {
    console.error("propertySchemaToTypeToString", e);
  }
  return "Unknown type";
}

function getPaths(_filter = ""): DM.OpenApiPathItem[] {
  const filter = _filter.toLowerCase();
  const viz = new FindPathItemsVisitor(filter);
  // TODO optimize this by only visiting the path items
  VisitorUtil.visitTree(document, viz, TraverserDirection.down);
  return viz.getSortedPathItems();
}

function getNavigationPaths(_filter = ""): NavigationPath[] {
  const filter = _filter.toLowerCase();
  const paths = getPaths(filter);
  return paths.map((p) => ({
    type: "path",
    path: p.mapPropertyName(),
    nodePath: DM.Library.createNodePath(p).toString(),
  }));
}

function getResponses(
  _filter = "",
): (DM.OpenApi20Response | DM.OpenApi30Response)[] {
  const filter = _filter.toLowerCase();
  const viz = new FindResponseDefinitionsVisitor(filter);
  VisitorUtil.visitTree(document, viz, TraverserDirection.down);
  return viz.getSortedResponses();
}

function getNavigationResponses(_filter = ""): NavigationResponse[] {
  const filter = _filter.toLowerCase();
  const responses = getResponses(filter);
  return responses.map((node) => ({
    type: "response",
    name: node.mapPropertyName() || node.parentPropertyName(),
    nodePath: DM.Library.createNodePath(node).toString(),
  }));
}

function resolveNode(nodePath: string): DM.Node {
  const np = NodePathUtil.parseNodePath(nodePath);
  return NodePathUtil.resolveNodePath(np, document);
}

function getDataTypes(filter = ""): DM.Schema[] {
  const viz = new FindSchemaDefinitionsVisitor(filter);
  VisitorUtil.visitTree(document, viz, TraverserDirection.down);
  return viz.getSortedSchemas();
}
function getNavigationDataTypes(filter = ""): NavigationDataType[] {
  const responses = getDataTypes(filter);
  return responses.map((p) => {
    return {
      type: "datatype",
      name: p.mapPropertyName() || p.parentPropertyName(),
      nodePath: DM.Library.createNodePath(p).toString(),
    };
  });
}

export async function getDocumentNavigation(
  filter = "",
): Promise<DocumentNavigation> {
  return {
    paths: getNavigationPaths(filter),
    responses: getNavigationResponses(filter),
    dataTypes: getNavigationDataTypes(filter),
  };
}

function securitySchemes(): DM.SecurityScheme[] {
  const viz = new FindSecuritySchemesVisitor("");
  VisitorUtil.visitTree(document, viz, TraverserDirection.down);
  return viz.getSortedSchemes();
}

export async function parseOpenApi(schema: string) {
  console.log("parseOpenApi", { schema });
  try {
    document = DM.Library.readDocumentFromJSONString(
      schema,
    ) as DM.OpenApiDocument;
    commandStack = new CommandStack();
  } catch (e) {
    console.error("parseDM.OpenApiSchema", { e, schema });
    throw new Error("Couldn't parse schema");
  }
}

function oasParameterToDataTypeProperty(
  p: DM.OpenApiParameter,
): DataTypeProperty {
  return {
    required: p.isRequired(),
    type: parameterToTypeToString(p),
    name: p.getName(),
    description: p.getDescription(),
  };
}

function getParametersIn(
  from: OpenApiPathItem | OpenApiOperation,
  where: "path" | "query" | "header" | "cookie",
): OpenApiParameter[] {
  return (from.getParameters() || []).filter(
    (param) => param.getIn() === where,
  );
}

function getParameters(
  where: "path" | "query" | "header" | "cookie",
  path: DM.OpenApiPathItem,
  operation?: DM.Operation,
): DataTypeProperty[] {
  try {
    const pathParams = getParametersIn(path, where).map<DataTypeProperty>(
      oasParameterToDataTypeProperty,
    );
    const operationParams = operation
      ? getParametersIn(
          operation as DM.OpenApiOperation,
          where,
        ).map<DataTypeProperty>(oasParameterToDataTypeProperty)
      : [];
    const merged = merge(
      keyBy(pathParams, "name"),
      keyBy(operationParams, "name"),
    );
    return values(merged);
  } catch (e) {
    console.error("getParameters", { e, path, operation });
  }
  return [];
}

function oasOperationToOperation(
  parent: DM.OpenApiPathItem,
  operation?: DM.OpenApi20Operation | DM.OpenApi30Operation,
): Operation | undefined {
  if (operation) {
    return {
      summary: operation.getSummary(),
      description: operation.getDescription(),
      id: operation.getOperationId(),
      tags: operation.getTags() ?? [],
      servers: [],
      pathParameters: getParameters("path", parent, operation),
      queryParameters: getParameters("query", parent, operation),
      headerParameters: getParameters("header", parent, operation),
      cookieParameters: getParameters("cookie", parent, operation),
      requestBody: undefined,
      responses: operation
        .getResponses()
        .getItems()
        .map((r) => ({
          statusCode: parseInt(
            r.mapPropertyName() || r.parentPropertyName(),
            10,
          ),
          description: r.getDescription(),
          mimeType: "TODO",
        })),
      securityRequirements: [],
    };
  }
}

function oasNodeToPath(_path: DM.Node): Path {
  if (ModelTypeUtil.isOpenApi3Model(document)) {
    const path = _path as DM.OpenApi30PathItem;
    const summary = path.getSummary();
    const description = path.getDescription();
    const servers: Server[] = [];
    const operations = {
      get: oasOperationToOperation(
        path,
        path.getGet() as DM.OpenApi30Operation,
      ),
      put: oasOperationToOperation(
        path,
        path.getPut() as DM.OpenApi30Operation,
      ),
      post: oasOperationToOperation(
        path,
        path.getPost() as DM.OpenApi30Operation,
      ),
      delete: oasOperationToOperation(
        path,
        path.getDelete() as DM.OpenApi30Operation,
      ),
      options: oasOperationToOperation(
        path,
        path.getOptions() as DM.OpenApi30Operation,
      ),
      head: oasOperationToOperation(
        path,
        path.getHead() as DM.OpenApi30Operation,
      ),
      patch: oasOperationToOperation(
        path,
        path.getPatch() as DM.OpenApi30Operation,
      ),
      trace: oasOperationToOperation(
        path,
        path.getTrace() as DM.OpenApi30Operation,
      ),
    };
    return {
      node: {
        type: "path",
        path: path.mapPropertyName() || path.parentPropertyName(),
        nodePath: DM.Library.createNodePath(_path).toString(),
      },
      summary,
      description,
      servers,
      operations,
      pathParameters: getParameters("path", path),
      queryParameters: getParameters("query", path),
      headerParameters: getParameters("header", path),
      cookieParameters: getParameters("cookie", path),
    };
  } else {
    const path = _path as DM.OpenApi20PathItem;
    const operations = {
      get: oasOperationToOperation(
        path,
        path.getGet() as DM.OpenApi20Operation,
      ),
      put: oasOperationToOperation(
        path,
        path.getPut() as DM.OpenApi20Operation,
      ),
      post: oasOperationToOperation(
        path,
        path.getPost() as DM.OpenApi20Operation,
      ),
      delete: oasOperationToOperation(
        path,
        path.getDelete() as DM.OpenApi20Operation,
      ),
      options: oasOperationToOperation(
        path,
        path.getOptions() as DM.OpenApi20Operation,
      ),
      head: oasOperationToOperation(
        path,
        path.getHead() as DM.OpenApi20Operation,
      ),
      patch: oasOperationToOperation(
        path,
        path.getPatch() as DM.OpenApi20Operation,
      ),
      trace: undefined,
    };
    return {
      node: {
        type: "path",
        path: path.mapPropertyName() || path.parentPropertyName(),
        nodePath: DM.Library.createNodePath(_path).toString(),
      },
      summary: "",
      description: "",
      servers: [],
      operations,
      pathParameters: getParameters("path", path),
      queryParameters: getParameters("query", path),
      headerParameters: getParameters("header", path),
      cookieParameters: getParameters("cookie", path),
    };
  }
}

function getValidationProblems(): Validation[] {
  const _validationProblems = DM.Library.validate(
    document,
    new DM.DefaultSeverityRegistry(),
  );
  const validationProblems = _validationProblems.map((v): Validation => {
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
  });
  return validationProblems;
}

export async function getPathSnapshot(node: NodePath): Promise<Path> {
  const path = resolveNode(node.nodePath);
  return oasNodeToPath(path);
}

export async function getDataTypeSnapshot(
  node: NodeDataType,
): Promise<DataType> {
  try {
    const schema = resolveNode(node.nodePath) as DM.OpenApiSchema;

    const description = schema.getDescription();
    const _properties = Object.values(schema.getProperties() ?? {});
    const properties: DataTypeProperty[] = _properties.map((_p: unknown) => {
      const p = _p as DM.OpenApi30Schema;

      function isRequired() {
        const required = schema.getRequired();
        if (required && required.length > 0) {
          return (
            required.indexOf(p.mapPropertyName() || p.parentPropertyName()) !=
            -1
          );
        }
        return false;
      }

      return {
        name: p.mapPropertyName() || p.parentPropertyName(),
        description: p.getDescription(),
        required: isRequired(),
        type: propertySchemaToTypeToString(p),
      };
    });

    console.log("getDataTypeSnapshot", { description, properties });
    return {
      description,
      properties,
    };
  } catch (error) {
    console.error("getDataTypeSnapshot() error: ", error);
    throw new Error("getDataTypeSnapshot failed");
  }
}

export async function getResponseSnapshot(
  node: NodeResponse,
): Promise<Response> {
  const response = resolveNode(node.nodePath);

  if (ModelTypeUtil.isOpenApi3Model(document)) {
    const resp30 = response as DM.OpenApi30Response;
    const description = resp30.getDescription();
    return {
      description,
    };
  } else {
    return {
      description: "",
    };
  }
}

export async function getTagsSnapshot(): Promise<Tags> {
  return {
    tags:
      (document as DM.OpenApiDocument).getTags()?.map((tag) => ({
        name: tag.getName(),
        description: tag.getDescription(),
      })) ?? [],
  };
}

export async function getServersSnapshot(): Promise<Servers> {
  return {
    servers: ModelTypeUtil.isOpenApi3Model(document)
      ? ((document as DM.OpenApi30Document).getServers()?.map((server) => ({
          description: server.getDescription(),
          url: server.getUrl(),
        })) ?? [])
      : [],
  };
}

export async function getSecuritySchemesSnapshot(): Promise<SecuritySchemes> {
  return {
    securityScheme: securitySchemes().map((s) => ({
      name: s.mapPropertyName() || s.parentPropertyName(),
      description: s.getDescription(),
    })),
  };
}

export async function getSecurityRequirementsSnapshot(): Promise<SecurityRequirements> {
  return {
    securityRequirements:
      (document as DM.OpenApiDocument).getSecurity()?.map((s) => ({
        schemes: Object.getOwnPropertyNames(s) ?? [],
      })) ?? [],
  };
}

export async function getPathsSnapshot(): Promise<Paths> {
  return {
    paths: getPaths().map(oasNodeToPath),
  };
}

export async function getDocumentSnapshot(): Promise<Document> {
  console.log("getDocumentSnapshot");
  try {
    return {
      title: document.getInfo()?.getTitle(),
      version: document.getInfo()?.getVersion(),
      description: document.getInfo()?.getDescription(),
      contactName: document.getInfo()?.getContact()?.getName(),
      contactEmail: document.getInfo()?.getContact()?.getEmail(),
      contactUrl: document.getInfo()?.getContact()?.getUrl(),
      licenseName: document.getInfo()?.getLicense()?.getName(),
      licenseUrl: document.getInfo()?.getLicense()?.getUrl(),
    };
  } catch (e) {
    console.error("getDocumentSnapshot() error: ", e);
    throw new Error("getDocumentSnapshot failed");
  }
}

export async function getNodeSource(
  selectedNode: SelectedNode,
  sourceType: SourceType,
): Promise<Source> {
  console.log("getNodeSource", { selectedNode });
  const source = ((): object => {
    try {
      switch (selectedNode.type) {
        case "datatype":
        case "response":
        case "path":
          return DM.Library.writeNode(resolveNode(selectedNode.nodePath));
        case "paths":
          return DM.Library.writeNode(
            (document as DM.OpenApiDocument).getPaths(),
          );
        case "root":
          return DM.Library.writeNode(document.getInfo());
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
  targetType: SourceType,
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

export async function getEditorState(): Promise<EditorModel> {
  console.log("getEditorState");
  try {
    const canUndo = commandStack.getUndoableCommandCount() > 0;
    const canRedo = commandStack.getRedoableCommandCount() > 0;

    return {
      documentTitle: document.getInfo()?.getTitle(),
      canUndo,
      canRedo,
      navigation: {
        paths: getNavigationPaths(),
        dataTypes: getNavigationDataTypes(),
        responses: getNavigationResponses(),
      },
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
  description: string,
): Promise<void> {
  console.log("updateDocumentDescription", { description });
  onCommand(DM.CommandFactory.createChangeDescriptionCommand(description));
}

export async function updateDocumentContactName(name: string): Promise<void> {
  console.log("updateDocumentContactName", { name });
  onCommand(
    new DM.ChangeContactCommand(
      name,
      document.getInfo()?.getContact()?.getEmail(),
      document.getInfo()?.getContact()?.getUrl(),
    ),
  );
}

export async function updateDocumentContactEmail(email: string): Promise<void> {
  console.log("updateDocumentContactEmail", { email });
  onCommand(
    new DM.ChangeContactCommand(
      document.getInfo()?.getContact()?.getName(),
      email,
      document.getInfo()?.getContact()?.getUrl(),
    ),
  );
}

export async function updateDocumentContactUrl(url: string): Promise<void> {
  console.log("updateDocumentContactUrl", { url });
  onCommand(
    new DM.ChangeContactCommand(
      document.getInfo()?.getContact()?.getName(),
      document.getInfo()?.getContact()?.getEmail(),
      url,
    ),
  );
}

export async function undoChange(): Promise<void> {
  console.info("[ApiEditorComponent] User wants to 'undo' the last command.");
  commandStack.undoCommand();
}

export async function redoChange(): Promise<void> {
  console.info("[ApiEditorComponent] User wants to 'redo' the last command.");
  commandStack.redoCommand();
}
