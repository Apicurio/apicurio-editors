import {
  CombinedVisitorAdapter,
  OasOperation,
  OasParameter,
  OasPathItem,
} from "@apicurio/data-models";

export class DetectOverrideVisitor extends CombinedVisitorAdapter {
  public overriddenParam: OasParameter = null;

  constructor(private param: OasParameter) {
    super();
  }

  public visitOperation(node: OasOperation): void {
    this.overriddenParam = (<OasPathItem>node.parent()).getParameter(
      this.param.in,
      this.param.name,
    ) as OasParameter;
  }
}
