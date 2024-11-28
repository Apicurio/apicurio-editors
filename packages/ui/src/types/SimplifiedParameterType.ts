import {SimplifiedType} from "./SimplifiedType.ts";
import {
    ModelTypeUtil,
    NodeUtil,
    OpenApi20Parameter,
    OpenApi30Parameter,
    OpenApiSchema,
    Parameter
} from "@apicurio/data-models";

export class SimplifiedParameterType extends SimplifiedType {
    public static fromParameter(param : Parameter) : SimplifiedParameterType {
        let rval : SimplifiedParameterType = new SimplifiedParameterType();
        let st : SimplifiedType;
        if (ModelTypeUtil.isOpenApi2Model(param)) {
            let param20 : OpenApi20Parameter = <OpenApi20Parameter>param;
            if(NodeUtil.equals(param20.getIn(), "body")) {
                st = SimplifiedType.fromSchema(<OpenApiSchema>param20.getSchema());
            } else {
                st = SimplifiedType.fromParameter(<OpenApi20Parameter>param);
            }
            rval.required = param20.isRequired();
        } else {
            let param30 : OpenApi30Parameter = <OpenApi30Parameter>param;
            st = SimplifiedType.fromSchema(<OpenApiSchema>param30.getSchema());
            rval.required = param30.isRequired();
        }
        rval.type = st.type;
        rval.enum_ = st.enum_;
        rval.of = st.of;
        rval.as = st.as;
        return rval;
    }

    public required : boolean | null = null;

    constructor() {
        super();
    }
}



