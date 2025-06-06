import { FunctionComponent, useState } from "react";
import { Card, CardBody } from "@patternfly/react-core";
import { OpenApiEditor } from "../../lib/editors";

export const OpenApiEditorDemo: FunctionComponent<any> = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <Card ouiaId="OpenApiEditorDemo">
                <CardBody>
                    <OpenApiEditor spec={{}} onChange={(newSpec) => alert(newSpec)} />
                </CardBody>
            </Card>
        </div>
    );
};
