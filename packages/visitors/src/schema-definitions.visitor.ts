import {CombinedVisitorAdapter, Schema} from "@apicurio/data-models";
import {isDefinition} from "./visitor-utils";

/**
 * Visitor used to find schema definitions.
 */
export class FindSchemaDefinitionsVisitor extends CombinedVisitorAdapter {

    schemaDefinitions: (Schema)[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string|((node:Schema) => boolean)) {
        super();
    }

    visitSchema(node: Schema) {
        if (isDefinition(node)) {
            if (this.acceptThroughFilter(node)) {
                this.schemaDefinitions.push(node);
            }
        }
    }

    /**
     * Sorts and returns the schemas.
     */
    public getSortedSchemas(): (Schema)[] {
        return this.schemaDefinitions.sort( (def1, def2) => {
            let name1: string = FindSchemaDefinitionsVisitor.definitionName(def1);
            let name2: string = FindSchemaDefinitionsVisitor.definitionName(def2);
            return name1.localeCompare(name2);
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: Schema): string {
        return definition.mapPropertyName();
    }

    /**
     * Returns true if the given node is accepted by the current filter criteria.
     * @param node
     */
    private acceptThroughFilter(node: Schema): boolean {
        //console.info("Accepting: %s through filter: %s", name, this.filterCriteria);
        if (this.filterCriteria === null) {
            return true;
        }
        const name: string = node.mapPropertyName();
        if (typeof this.filterCriteria == "string") {
            return name.toLowerCase().indexOf(this.filterCriteria) != -1;
        } else {
            return this.filterCriteria(node);
        }
    }

}
