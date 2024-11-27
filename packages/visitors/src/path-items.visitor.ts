import {CombinedVisitorAdapter, OpenApiPathItem} from "@apicurio/data-models";

/**
 * Visitor used to find path items.
 */
export class FindPathItemsVisitor extends CombinedVisitorAdapter {

    public pathItems: OpenApiPathItem[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a path item is visited.
     * @param node
     */
    visitPathItem(node: OpenApiPathItem): void {
        if (this.acceptThroughFilter(node.mapPropertyName())) {
            this.pathItems.push(node);
        }
    }

    /**
     * Sorts and returns the path items.
     */
    public getSortedPathItems(): OpenApiPathItem[] {
        return this.pathItems.sort( (pathItem1, pathItem2) => {
            return pathItem1.mapPropertyName().localeCompare(pathItem2.mapPropertyName());
        });
    }

    /**
     * Returns true if the given name is accepted by the current filter criteria.
     * @param name
     * @return
     */
    private acceptThroughFilter(name: string): boolean {
        if (this.filterCriteria === null) {
            return true;
        }
        return name.toLowerCase().indexOf(this.filterCriteria) != -1;
    }

}
