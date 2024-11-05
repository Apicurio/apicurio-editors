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
  securityRequirements: string[];
};

export type EditorModel = {
  document: Document;
  navigation: DocumentNavigation;
  canUndo: boolean;
  canRedo: boolean;
};
