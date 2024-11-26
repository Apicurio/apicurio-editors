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

export type Response =
  | {
      statusCode: number;
      description?: string;
      mimeType?: string;
    }
  | {
      ref: string; // TODO
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
  queryParameters: "TODO";
  headerParameters: "TODO";
  cookieParameters: "TODO";
  requestBody?: RequestBody;
  responses: Response[];
  securityRequirements: SecurityRequirement[];
};

export type DocumentPath = {
  node: NodePath;
  summary: string;
  description: string;
  servers: Server[];
  queryParameters: "TODO";
  headerParameters: "TODO";
  cookieParameters: "TODO";
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

export type DocumentDataType = {
  description: string;
  properties: DataTypeProperty[];
};

export type DocumentResponse = {
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
  tags: Tag[];
  servers: Server[];
  securityScheme: SecurityScheme[];
  securityRequirements: SecurityRequirement[];
  paths: DocumentPath[];
};

export type NodeRoot = {
  type: "root";
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
export type SelectedNode = NodeRoot | NodePath | NodeDataType | NodeResponse;

export type Validation = {
  severity: "info" | "warning" | "danger";
  message: string;
  nodePath: string;
  node: SelectedNode;
};

export type EditorModel = {
  documentTitle: string;
  navigation: DocumentNavigation;
  canUndo: boolean;
  canRedo: boolean;
  validationProblems: Validation[];
};

export type SourceType = "yaml" | "json";
export type Source = {
  source: string;
  type: SourceType;
};
