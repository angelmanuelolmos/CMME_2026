
export type NotUndefinedOrNull = number | boolean | string | object

export function isNumber(value:NotUndefinedOrNull):boolean
{
    return (typeof value) == "number"  || value.constructor.name == "Number";
}

export function isString(value:NotUndefinedOrNull):boolean
{
    return typeof value === "string";
}

export function isInstance(value:NotUndefinedOrNull, cls:any):boolean
{
    return value instanceof cls;
}

export function isBoolean(value: unknown):boolean
{
    return typeof value === "boolean";
}