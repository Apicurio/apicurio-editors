import { CombinedAllNodeVisitor, Node } from "@apicurio/data-models";

/**
 * Visitor used to search through the data model for validation problems.
 */
export class HasProblemVisitor extends CombinedAllNodeVisitor {
  public problemsFound: boolean = false;

  visitNode(node: Node): void {
    if (node._validationProblems.length > 0) {
      this.problemsFound = true;
    }
  }
}
