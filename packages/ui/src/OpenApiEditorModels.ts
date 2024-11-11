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
};

export type SelectedNode =
  | {
      type: "root";
      node: DocumentRoot;
    }
  | {
      type: "path";
      path: string;
      node: DocumentPath;
    }
  | {
      type: "datatype";
      path: string;
      node: DocumentDataType;
    }
  | {
      type: "response";
      path: string;
      node: DocumentResponse;
    };

export type SelectedNodeType =
  | {
      type: "root";
    }
  | {
      type: "path";
      path: string;
    }
  | {
      type: "datatype";
      path: string;
    }
  | {
      type: "response";
      path: string;
    };

export type EditorModel = {
  node: SelectedNode;
  navigation: DocumentNavigation;
  canUndo: boolean;
  canRedo: boolean;
  validationProblems: ValidationProblem[];
};
