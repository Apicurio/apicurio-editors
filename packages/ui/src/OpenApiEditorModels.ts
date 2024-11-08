import { ValidationProblem } from "@apicurio/data-models";

export type NavigationPath = {
  name: string;
  validations: ValidationProblem[];
};

export type NavigationDataType = {
  name: string;
  validations: ValidationProblem[];
};

export type NavigationResponse = {
  name: string;
  validations: ValidationProblem[];
};

export type DocumentNavigation = {
  paths: NavigationPath[];
  dataTypes: NavigationDataType[];
  responses: NavigationResponse[];
};

export type DocumentPath = {};

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
  source: string;
};

export type SelectedNode =
  | {
      type: "path";
      path: string;
      node: DocumentPath;
      source: string;
    }
  | {
      type: "datatype";
      path: string;
      node: DocumentDataType;
      source: string;
    }
  | {
      type: "response";
      path: string;
      node: DocumentResponse;
      source: string;
    };

export type EditorModel = {
  documentRoot: DocumentRoot;
  selectedNode?: SelectedNode;
  navigation: DocumentNavigation;
  canUndo: boolean;
  canRedo: boolean;
  validationProblems: ValidationProblem[];
};
