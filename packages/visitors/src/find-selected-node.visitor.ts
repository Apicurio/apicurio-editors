import {CombinedVisitorAdapter, IDefinition, NodePath, OasPathItem} from "@apicurio/data-models";
import {SelectedNode} from "@apicurio-editors/ui/src";

/**
 * Visitor used to find a selected node parent (it's looking for a PathItem, SchemaDefinition, or ResponseDefinition).
 */
export class FindSelectedNodeVisitor extends CombinedVisitorAdapter {

    public selectedNode: SelectedNode | null = null;

    constructor(private nodePath: NodePath) {
        super();
    }

    visitPathItem(node: OasPathItem): void {
        this.selectedNode = {
            type: "path",
            path: node.getPath(),
            nodePath: this.nodePath.toString()
        };
    }

    visitSchemaDefinition(node: IDefinition) {
        this.selectedNode = {
            type: "datatype",
            name: node.getName(),
            nodePath: this.nodePath.toString()
        };
    }

    visitResponseDefinition(node: IDefinition) {
        this.selectedNode = {
            type: "response",
            name: node.getName(),
            nodePath: this.nodePath.toString()
        };
    }
}
