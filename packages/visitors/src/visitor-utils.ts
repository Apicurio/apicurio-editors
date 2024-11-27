import {Node} from "@apicurio/data-models";
import {
    DefinitionDetectionVisitor
} from "@apicurio/data-models/src/io/apicurio/datamodels/visitors/DefinitionDetectionVisitor";

export const isDefinition = (node: Node): boolean => {
    if (node === null || node.parent() === null) {
        return false;
    }
    const dvis: DefinitionDetectionVisitor = new DefinitionDetectionVisitor();
    node.parent().accept(dvis);
    return dvis.isDefinitionParent;
};
