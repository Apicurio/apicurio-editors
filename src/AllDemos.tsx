import React from "react";

import { OpenApiEditorDemo } from "./demos/OpenApiEditorDemo.tsx";


export type Demo = {
    name: string;
    description: string | React.ReactNode;
    component: React.ReactNode;
}

export type Demos = {
    [key: string]: Demo[];
}

export const ALL_DEMOS: Demos = {
    "Editors": [
        {
            name: "OpenAPI Editor",
            description: "A visual editor for OpenAPI specifications.",
            component: <OpenApiEditorDemo/>
        },
    ]
};
