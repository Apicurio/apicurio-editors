import {CombinedVisitorAdapter, SecurityScheme} from "@apicurio/data-models";
import {isDefinition} from "./visitor-utils";

export class FindSecuritySchemesVisitor extends CombinedVisitorAdapter {

    schemes: SecurityScheme[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    visitSecurityScheme(node: SecurityScheme) {
        if (isDefinition(node)) {
            let name: string = node.mapPropertyName();
            if (this.acceptThroughFilter(name)) {
                this.schemes.push(node);
            }
        }
    }

    public getSortedSchemes(): SecurityScheme[] {
        return this.schemes.sort( (def1, def2) => {
            let name1: string = def1.mapPropertyName();
            let name2: string = def2.mapPropertyName();
            return name1.localeCompare(name2);
        });
    }

    /**
     * Returns true if the given name is accepted by the current filter criteria.
     * @param name
     */
    private acceptThroughFilter(name: string): boolean {
        //console.info("Accepting: %s through filter: %s", name, this.filterCriteria);
        if (this.filterCriteria === null || this.filterCriteria === "") {
            return true;
        }
        return name.toLowerCase().indexOf(this.filterCriteria) != -1;
    }

}
