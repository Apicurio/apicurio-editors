import {
    AsyncApiSchema, ModelTypeUtil,
    NodeUtil,
    OpenApi20Items,
    OpenApi20Parameter, OpenApi20Schema, OpenApi30Schema, OpenApi31Schema,
    OpenApiSchema,
    Referenceable, Schema
} from "@apicurio/data-models";

const getType = (schema: Schema): string => {
    if (ModelTypeUtil.isOpenApi2Model(schema)) {
        return (<OpenApi20Schema>schema).getType();
    }
    if (ModelTypeUtil.isOpenApi30Model(schema)) {
        return (<OpenApi30Schema>schema).getType();
    }
    if (ModelTypeUtil.isOpenApi31Model(schema)) {
        return (<OpenApi31Schema>schema).getType().asString();
    }
    if (ModelTypeUtil.isAsyncApiModel(schema)) {
        return (<AsyncApiSchema>schema).getType();
    }
    return "";
};

const getItems = (schema: Schema): any => {
    if (ModelTypeUtil.isOpenApi2Model(schema)) {
        return (<OpenApi20Schema>schema).getItems();
    }
    if (ModelTypeUtil.isOpenApi30Model(schema)) {
        return (<OpenApi30Schema>schema).getItems();
    }
    if (ModelTypeUtil.isOpenApi31Model(schema)) {
        return (<OpenApi31Schema>schema).getItems()
    }
    if (ModelTypeUtil.isAsyncApiModel(schema)) {
        return (<AsyncApiSchema>schema).getItems();
    }
    return "";
};

const get$ref = (schema: Schema): any => {
    return (<Referenceable><any>schema).get$ref();
};

export class SimplifiedType {
    static __static_initialized : boolean = false;
    static __static_initialize() { if(!SimplifiedType.__static_initialized) { SimplifiedType.__static_initialized = true; SimplifiedType.__static_initializer_0(); } }

    static VALID_TYPES : Array<string>; public static VALID_TYPES_$LI$() : Array<string> { SimplifiedType.__static_initialize(); if(SimplifiedType.VALID_TYPES == null) SimplifiedType.VALID_TYPES = <any>([]); return SimplifiedType.VALID_TYPES; };

    static __static_initializer_0() {
        /* add */(SimplifiedType.VALID_TYPES_$LI$().push("string")>0);
        /* add */(SimplifiedType.VALID_TYPES_$LI$().push("number")>0);
        /* add */(SimplifiedType.VALID_TYPES_$LI$().push("integer")>0);
        /* add */(SimplifiedType.VALID_TYPES_$LI$().push("boolean")>0);
    }

    public static fromParameter(param : OpenApi20Parameter) : SimplifiedType {
        let rval : SimplifiedType = new SimplifiedType();
        if(NodeUtil.isDefined(param) && NodeUtil.isDefined(param.getEnum()) && /* size */(<number>param.getEnum().length) >= 0) {
            rval.enum_ = <any>(param.getEnum().slice(0));
        }
        if(NodeUtil.isDefined(param) && NodeUtil.isDefined(param.getType()) && !NodeUtil.equals(param.getType(), "array") && !NodeUtil.equals(param.getType(), "object")) {
            rval.type = param.getType();
            if(NodeUtil.isDefined(param.getFormat())) {
                rval.as = param.getFormat();
            }
        }
        if(NodeUtil.isDefined(param) && NodeUtil.equals(param.getType(), "array") && NodeUtil.isDefined(param.getItems())) {
            rval.type = "array";
            rval.of = SimplifiedType.fromItems(param.getItems());
        }
        return rval;
    }

    public static fromItems(items : OpenApi20Items) : SimplifiedType {
        let rval : SimplifiedType = new SimplifiedType();
        if(NodeUtil.isDefined(items) && NodeUtil.isDefined(items.getEnum()) && /* size */(<number>items.getEnum().length) >= 0) {
            rval.enum_ = <any>(items.getEnum().slice(0));
        }
        if(NodeUtil.isDefined(items) && NodeUtil.isDefined(items.getType()) && !NodeUtil.equals(items.getType(), "array") && !NodeUtil.equals(items.getType(), "object")) {
            rval.type = items.getType();
            if(NodeUtil.isDefined(items.getFormat())) {
                rval.as = items.getFormat();
            }
        }
        if(NodeUtil.isDefined(items) && NodeUtil.equals(items.getType(), "array") && NodeUtil.isDefined(items.getItems())) {
            rval.type = "array";
            rval.of = SimplifiedType.fromItems(items.getItems());
        }
        return rval;
    }

    public static fromSchema(schema : OpenApiSchema) : SimplifiedType {
        let rval : SimplifiedType = new SimplifiedType();
        if(NodeUtil.isDefined(schema) && NodeUtil.isDefined(get$ref(schema))) {
            rval.type = (<Referenceable><any>schema).get$ref();
        }
        if(NodeUtil.isDefined(schema) && NodeUtil.isDefined(schema.getEnum()) && /* size */(<number>schema.getEnum().length) >= 0) {
            rval.enum_ = <any>(schema.getEnum().slice(0));
        }
        if(NodeUtil.isDefined(schema) && NodeUtil.isDefined(getType(schema)) && !NodeUtil.equals(getType(schema), "array") && !NodeUtil.equals(getType(schema), "object")) {
            rval.type = getType(schema);
            if(NodeUtil.isDefined(schema.getFormat())) {
                rval.as = schema.getFormat();
            }
        }
        if(NodeUtil.isDefined(schema) && NodeUtil.equals(getType(schema), "array") && NodeUtil.isDefined(getItems(schema))) {
            rval.type = "array";
            rval.of = SimplifiedType.fromSchema(getItems(schema));
        }
        return rval;
    }

    public static fromAsyncApiSchema(schema : AsyncApiSchema) : SimplifiedType {
        let rval : SimplifiedType = new SimplifiedType();
        if(NodeUtil.isDefined(schema) && NodeUtil.isDefined(get$ref(schema))) {
            rval.type = get$ref(schema);
        }
        if(NodeUtil.isDefined(schema) && NodeUtil.isDefined(schema.getEnum()) && /* size */(<number>schema.getEnum().length) >= 0) {
            rval.enum_ = <any>(schema.getEnum().slice(0));
        }
        if(NodeUtil.isDefined(schema) && NodeUtil.isDefined(getType(schema)) && !NodeUtil.equals(getType(schema), "array") && !NodeUtil.equals(getType(schema), "object")) {
            rval.type = getType(schema);
            if(NodeUtil.isDefined(schema.getFormat())) {
                rval.as = schema.getFormat();
            }
        }
        if(NodeUtil.isDefined(schema) && NodeUtil.equals(getType(schema), "array") && NodeUtil.isDefined(getItems(schema))) {
            rval.type = "array";
            rval.of = SimplifiedType.fromSchema(getItems(schema));
        }
        return rval;
    }

    public type : string | null = null;
    public enum_ : Array<any> = [];
    public of : SimplifiedType | null = null;
    public as : string | null = null;

    public isSimpleType() : boolean {
        return SimplifiedType.VALID_TYPES_$LI$().indexOf(this.type!) !== -1;
    }

    public isFileType() : boolean {
        return NodeUtil.equals(this.type!, "file");
    }

    public isEnum() : boolean {
        return NodeUtil.isDefined(this.enum_) && /* size */(<number>this.enum_!.length) >= 0;
    }

    public isArray() : boolean {
        return NodeUtil.equals(this.type!, "array");
    }

    public isRef() : boolean {
        return NodeUtil.isDefined(this.type) && this.type!.indexOf("#/") === 0;
    }

    constructor() {
    }
}

SimplifiedType.VALID_TYPES_$LI$();

SimplifiedType.__static_initialize();
