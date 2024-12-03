export type NavigationPath = Extract<SelectedNode, { type: "path" }>;
export type NavigationDataType = Extract<SelectedNode, { type: "datatype" }>;
export type NavigationResponse = Extract<SelectedNode, { type: "response" }>;

export type DocumentNavigation = {
  paths: NavigationPath[];
  dataTypes: NavigationDataType[];
  responses: NavigationResponse[];
};

export type RequestBody = {
  description?: string;
  isRequired: boolean;
  mediaTypes: string;
};

export type OperationResponse = {
  statusCode: number;
  description?: string;
  mimeType?: string;
};

export const Operations = [
  "get" as const,
  "put" as const,
  "post" as const,
  "delete" as const,
  "options" as const,
  "head" as const,
  "patch" as const,
  "trace" as const,
];

export type Operation = {
  summary: string;
  description: string;
  id: string;
  tags: string[];
  servers: Server[];
  pathParameters: DataTypeProperty[];
  queryParameters: DataTypeProperty[];
  headerParameters: DataTypeProperty[];
  cookieParameters: DataTypeProperty[];
  requestBody?: RequestBody;
  responses: OperationResponse[];
  securityRequirements: SecurityRequirement[];
};

export type Path = {
  node: NodePath;
  summary: string;
  description: string;
  servers: Server[];
  pathParameters: DataTypeProperty[];
  queryParameters: DataTypeProperty[];
  headerParameters: DataTypeProperty[];
  cookieParameters: DataTypeProperty[];
  operations: {
    get?: Operation;
    put?: Operation;
    post?: Operation;
    delete?: Operation;
    options?: Operation;
    head?: Operation;
    patch?: Operation;
    trace?: Operation;
  };
};

export type DataTypeProperty = {
  name: string;
  description?: string;
  required: boolean;
  type: string;
};

export type DataType = {
  description: string;
  properties: DataTypeProperty[];
};

export type Response = {
  description: string;
};

export type Tag = {
  name: string;
  description: string;
};

export type Server = {
  url: string;
  description: string;
};

export type SecurityScheme = {
  name: string;
  description: string;
};

export type SecurityRequirement = {
  schemes: string[];
};

export type Document = {
  title: string;
  version: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactUrl: string;
  licenseName: string;
  licenseUrl: string;
};

export type Tags = {
  tags: Tag[];
};

export type Paths = {
  paths: Path[];
};

export type Servers = {
  servers: Server[];
};

export type SecuritySchemes = {
  securityScheme: SecurityScheme[];
};

export type SecurityRequirements = {
  securityRequirements: SecurityRequirement[];
};

export type NodeRoot = {
  type: "root";
};
export type NodePaths = {
  type: "paths";
};
export type NodeDataTypes = {
  type: "datatypes";
};
export type NodeResponses = {
  type: "responses";
};
export type NodePath = {
  type: "path";
  path: string;
  nodePath: string;
};
export type NodeDataType = {
  type: "datatype";
  name: string;
  nodePath: string;
};
export type NodeResponse = {
  type: "response";
  name: string;
  nodePath: string;
};

export type SelectedNode =
  | NodeRoot
  | NodePaths
  | NodeDataTypes
  | NodeResponses
  | NodePath
  | NodeDataType
  | NodeResponse;

export type Validation = {
  severity: "info" | "warning" | "danger";
  message: string;
  nodePath: string;
  node: SelectedNode;
};

export type EditorModel = {
  documentTitle: string;
  canUndo: boolean;
  canRedo: boolean;
  navigation: {
    paths: NavigationPath[];
    responses: NavigationResponse[];
    dataTypes: NavigationDataType[];
  };
};

export type SourceType = "yaml" | "json";
export type Source = {
  source: string;
  type: SourceType;
};
