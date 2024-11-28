import {CombinedVisitorAdapter, AsyncApiMessageTrait} from "@apicurio/data-models";
import {isDefinition} from "./visitor-utils";

/**
 * Visitor used to find message trait definitions.
 */
export class FindMessageTraitDefinitionsVisitor extends CombinedVisitorAdapter {

    public messageTraitDefinitions: AsyncApiMessageTrait[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    visitMessageTrait(node: AsyncApiMessageTrait) {
        if (isDefinition(node)) {
            this.visitMessageTraitDefinition(node);
        }
    }

    /**
     * Called when a message trait def is visited.
     * @param node
     */
    visitMessageTraitDefinition(node: AsyncApiMessageTrait): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.messageTraitDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the message trait defs.
     */
    public getSortedMessageTraitDefinitions(): AsyncApiMessageTrait[] {
        return this.messageTraitDefinitions.sort( (messageTraitDefinition1, messageTraitDefinition2) => {
            return messageTraitDefinition1.getName().localeCompare(messageTraitDefinition2.getName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AsyncApiMessageTrait): string {
        return definition.getName();
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
