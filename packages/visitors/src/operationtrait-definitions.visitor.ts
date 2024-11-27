import {CombinedVisitorAdapter, AsyncApiOperationTrait} from "@apicurio/data-models";
import {isDefinition} from "./visitor-utils";

/**
 * Visitor used to find operation trait definitions.
 */
export class FindOperationTraitDefinitionsVisitor extends CombinedVisitorAdapter {

    public operationTraitDefinitions: AsyncApiOperationTrait[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    visitOperationTrait(node: AsyncApiOperationTrait) {
        if (isDefinition(node)) {
            this.visitOperationTraitDefinition(node);
        }
    }

    /**
     * Called when a operation trait def is visited.
     * @param node
     */
    visitOperationTraitDefinition(node: AsyncApiOperationTrait): void {
        if (this.acceptThroughFilter(node.mapPropertyName())) {
            this.operationTraitDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the operation trait defs.
     */
    public getSortedOperationTraitDefinitions(): AsyncApiOperationTrait[] {
        return this.operationTraitDefinitions.sort( (operationTraitDefinition1, operationTraitDefinition2) => {
            return operationTraitDefinition1.mapPropertyName().localeCompare(operationTraitDefinition2.mapPropertyName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AsyncApiOperationTrait): string {
        return definition.mapPropertyName();
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
