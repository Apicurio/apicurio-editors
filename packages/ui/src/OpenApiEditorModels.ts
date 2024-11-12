export type NavigationPath = Extract<SelectedNodeType, { type: "path" }>;
export type NavigationDataType = Extract<
  SelectedNodeType,
  { type: "datatype" }
>;
export type NavigationResponse = Extract<
  SelectedNodeType,
  { type: "response" }
>;

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
      response: string; // TODO
    };

export type Operation = {
  summary: string;
  description: string;
  id: string;
  tags: Tag[];
  servers: Server[];
  queryParameters: "TODO";
  headerParameters: "TODO";
  cookieParameters: "TODO";
  requestBody?: RequestBody;
  responses: Response[];
  securityRequirements: SecurityRequirement[];
};

export type DocumentPath = {
  summary: string;
  description: string;
  servers: Server[];
  queryParameters: "TODO";
  headerParameters: "TODO";
  cookieParameters: "TODO";
  operations: Operation[];
};

export type DocumentDataType = {};

export type DocumentResponse = {};

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

export type DocumentRoot = {
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
};

export type SelectedNode =
  | {
      type: "root";
      node: DocumentRoot;
    }
  | {
      type: "path";
      path: string;
      nodePath: string[];
      node: DocumentPath;
    }
  | {
      type: "datatype";
      name: string;
      nodePath: string[];
      node: DocumentDataType;
    }
  | {
      type: "response";
      name: string;
      nodePath: string[];
      node: DocumentResponse;
    };

export type SelectedNodeType =
  | {
      type: "root";
    }
  | {
      type: "path";
      path: string;
      nodePath: string[];
    }
  | {
      type: "datatype";
      name: string;
      nodePath: string[];
    }
  | {
      type: "response";
      name: string;
      nodePath: string[];
    };

export type Validation = {
  severity: "info" | "warning" | "danger";
  message: string;
  nodePath: string[];
  node: SelectedNodeType;
};

export type EditorModel = {
  node: SelectedNode;
  navigation: DocumentNavigation;
  canUndo: boolean;
  canRedo: boolean;
  validationProblems: Validation[];
};
