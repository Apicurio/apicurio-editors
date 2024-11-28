import {CombinedVisitorAdapter, OpenApiParameter, OpenApiPathItem, Operation} from "@apicurio/data-models";

const getParameter = (from: OpenApiPathItem, _in: string, _name: string): OpenApiParameter => {
  if (!from) {
    return null;
  }
  const allParams: OpenApiParameter[] = from.getParameters() || [];
  for (const parameter of allParams) {
    const name: string = parameter.mapPropertyName() || parameter.parentPropertyName();
    if (parameter.getIn() === _in && name === _name) {
      return parameter;
    }
  }
  return null;
};

export class DetectOverrideVisitor extends CombinedVisitorAdapter {
  public overriddenParam: OpenApiParameter = null;

  constructor(private param: OpenApiParameter) {
    super();
  }

  visitOperation(node: Operation) {
    this.overriddenParam = getParameter(
      <OpenApiPathItem>node.parent(),
      this.param.getIn(),
      this.param.getName(),
    ) as OpenApiParameter;
  }
}
