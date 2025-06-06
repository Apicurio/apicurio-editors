import { FunctionComponent } from "react";

/**
 * Properties
 */
export type OpenApiEditorProps = {
    spec: string | object;
    onChange: (spec: object) => void;
};

export const OpenApiEditor: FunctionComponent<OpenApiEditorProps> = (props: OpenApiEditorProps) => {
    return (
        <div>
            To be implemented...
        </div>
    );
};
