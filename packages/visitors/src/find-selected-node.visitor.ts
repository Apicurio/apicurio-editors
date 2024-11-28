import {CombinedVisitorAdapter, NodePath, OpenApiPathItem, OpenApiResponse, Schema} from "@apicurio/data-models";
import {SelectedNode} from "@apicurio-editors/ui/src";
import {isDefinition} from "./visitor-utils";

/**
 * Visitor used to find a selected node parent (it's looking for a PathItem, SchemaDefinition, or ResponseDefinition).
 */
export class FindSelectedNodeVisitor extends CombinedVisitorAdapter {

    public selectedNode: SelectedNode | null = null;

    constructor(private nodePath: NodePath) {
        super();
    }

    visitPathItem(node: OpenApiPathItem): void {
        this.selectedNode = {
            type: "path",
            path: node.mapPropertyName(),
            nodePath: this.nodePath.toString()
        };
    }

    visitSchema(node: Schema) {
        if (isDefinition(node)) {
            this.visitSchemaDefinition(node);
        }
        super.visitSchema(node);
    }

    visitSchemaDefinition(node: Schema) {
        this.selectedNode = {
            type: "datatype",
            name: node.mapPropertyName(),
            nodePath: this.nodePath.toString()
        };
    }

    visitResponse(node: OpenApiResponse) {
        if (isDefinition(node)) {
            this.visitResponseDefinition(node);
        }
    }

    visitResponseDefinition(node: OpenApiResponse) {
        this.selectedNode = {
            type: "response",
            name: node.mapPropertyName(),
            nodePath: this.nodePath.toString()
        };
    }
}
