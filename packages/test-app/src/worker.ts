import { FindPathItemsVisitor } from "@apicurio-editors/visitors/src/path-items.visitor";
import { Library, OasDocument, VisitorUtil } from "@apicurio/data-models";

let document: OasDocument | undefined = undefined;

export function parseOasSchema(schema: string) {
  console.log("parseOasSchema");
  try {
    document = Library.readDocumentFromJSONString(schema) as OasDocument;
  } catch (e) {
    console.error("parseOasSchema", { e, schema });
    throw new Error("Couldn't parse schema");
  }
}

export function getPaths(filter = ""): string[] {
  console.log("getPaths", { filter });
  const viz: FindPathItemsVisitor = new FindPathItemsVisitor(filter);
  if (document && document.paths) {
    document.paths.getPathItems().forEach((pathItem) => {
      VisitorUtil.visitNode(pathItem, viz);
    });
  }
  const paths = viz.getSortedPathItems();
  return paths.map((p) => p._path);
}

export function getDocumentTitle(): string | undefined {
  const title = document?.info.title;
  console.log("getDocumentTitle", { title });
  return title;
}

export function editDocumentTitle(title: string) {
  console.log("setDocumentTitle", { title });
  if (document) {
    document.info.title = title;
  }
}
