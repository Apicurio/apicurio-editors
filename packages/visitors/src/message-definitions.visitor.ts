import {AsyncApiMessage, CombinedVisitorAdapter} from "@apicurio/data-models";

/**
 * Visitor used to find message definitions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  tions.
 */
export class FindMessageDefinitionsVisitor extends CombinedVisitorAdapter {

    public messageDefinitions: AsyncApiMessage[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a message def is visited.
     * @param node
     */
    visitMessage(node: AsyncApiMessage): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.messageDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the message defs.
     */
    public getSortedMessageDefinitions(): AsyncApiMessage[] {
        return this.messageDefinitions.sort( (messageDefinition1, messageDefinition2) => {
            return messageDefinition1.getName().localeCompare(messageDefinition2.getName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AsyncApiMessage): string {
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
