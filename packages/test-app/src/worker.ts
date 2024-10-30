import { FindPathItemsVisitor } from "@apicurio-editors/visitors/src/path-items.visitor";
import { Library, OasDocument, VisitorUtil } from "@apicurio/data-models";

let document: OasDocument | undefined = undefined;

export function parseOasSchema(schema: string) {
  try {
    document = Library.readDocumentFromJSONString(schema) as OasDocument;
  } catch (e) {
    console.error("parseOasSchema", { e, schema });
    throw new Error("Couldn't parse schema");
  }
}

export function getPaths(filter = ""): string[] {
  const viz: FindPathItemsVisitor = new FindPathItemsVisitor(filter);
  if (document && document.paths) {
    document.paths.getPathItems().forEach((pathItem) => {
      VisitorUtil.visitNode(pathItem, viz);
    });
  }
  const paths = viz.getSortedPathItems();
  return paths.map((p) => p._path);
}
