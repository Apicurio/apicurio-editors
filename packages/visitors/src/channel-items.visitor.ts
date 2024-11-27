import {CombinedVisitorAdapter, AsyncApiChannelItem} from "@apicurio/data-models";

/**
 * Visitor used to find path items.
 */
export class FindChannelItemsVisitor extends CombinedVisitorAdapter {

    public channelItems: AsyncApiChannelItem[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a channel item is visited.
     * @param node
     */
    visitChannelItem(node: AsyncApiChannelItem): void {
        if (this.acceptThroughFilter(node["name"])) {
            this.channelItems.push(node);
        }
    }

    /**
     * Sorts and returns the channel items.
     */
    public getSortedChannelItems(): AsyncApiChannelItem[] {
        return this.channelItems.sort( (channelItem1, channelItem2) => {
            return channelItem1.mapPropertyName().localeCompare(channelItem2.mapPropertyName());
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
