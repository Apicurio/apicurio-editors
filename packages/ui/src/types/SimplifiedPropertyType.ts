import {SimplifiedType} from "./SimplifiedType.ts";
import {NodeUtil, OpenApiSchema, Schema} from "@apicurio/data-models";

export class SimplifiedPropertyType extends SimplifiedType {
    public static fromPropertySchema(schema : Schema) : SimplifiedPropertyType {
        let s : OpenApiSchema = <OpenApiSchema><any>schema;
        let rval : SimplifiedPropertyType = new SimplifiedPropertyType();
        let propName : string = schema.mapPropertyName() || schema.parentPropertyName();
        let required : Array<string> = <Array<string>><any>NodeUtil.getProperty(s.parent(), "required");
        let st : SimplifiedType = SimplifiedType.fromSchema(<OpenApiSchema><any>schema);
        rval.type = st.type;
        rval.enum_ = st.enum_;
        rval.of = st.of;
        rval.as = st.as;
        rval.required = false;
        if(NodeUtil.isDefined(required) && /* size */(<number>required.length) > 0 && required.indexOf(propName) !== -1) {
            rval.required = true;
        }
        return rval;
    }

    public required : boolean | null = null;

    constructor() {
        super();
    }
}



