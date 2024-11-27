import { AllNodeVisitor, Node } from "@apicurio/data-models";

/**
 * Visitor used to search through the data model for validation problems.
 */
export class HasProblemVisitor extends AllNodeVisitor {
  public problemsFound: boolean = false;

  visitNode(node: Node): void {
    // TODO : how to implement this for data-models 2.x? I do not think validation problems are
    //        added to the model anymore. Need to verify.
    // if (node.getValidationProblems().length > 0) {
    //   this.problemsFound = true;
    // }
  }
}
