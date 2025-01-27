import { JSONSchema } from "./types";

export function makeStringSchema(
  title: string,
  description?: string,
  options?: {
    defaultValue?: string;
    enum?: string[];
  }
): JSONSchema {
  const schema: JSONSchema = {
    type: "string",
    title,
  };

  if (description) {
    schema.description = description;
  }

  if (options?.defaultValue) {
    schema.default = options.defaultValue;
  }

  if (options?.enum) {
    schema.enum = options.enum;
  }

  return schema;
}

export function makeNumberSchema(
  title: string,
  description?: string,
  options?: {
    defaultValue: number;
  }
): JSONSchema {
  const schema: JSONSchema = {
    type: "number",
    title,
  };

  if (description) {
    schema.description = description;
  }

  if (options?.defaultValue) {
    schema.default = options.defaultValue;
  }

  return schema;
}

export function makeBooleanSchema(
  title: string,
  description?: string,
  options?: {
    defaultValue?: boolean;
    enum?: boolean;
  }
): JSONSchema {
  const schema: JSONSchema = {
    title,
    type: "boolean",
  };

  if (description) {
    schema.description = description;
  }

  if (options?.defaultValue) {
    schema.default = options.defaultValue;
  }

  if (options?.enum) {
    schema.enum = [options.enum];
  }

  return schema;
}

export function makeArraySchema(title: string, items: JSONSchema): JSONSchema {
  return {
    type: "array",
    title,
    items,
  };
}

export function makeObjectSchema(
  title: string,
  options: {
    optionalProperties?: Record<string, JSONSchema>;
    requiredProperties?: Record<string, JSONSchema>;
    additionalProperties?: boolean | JSONSchema;
  }
): JSONSchema {
  let properties: Record<string, JSONSchema> | undefined = undefined;

  if (options.optionalProperties || options.requiredProperties) {
    properties = {};
  }

  if (options.optionalProperties) {
    properties = {
      ...properties,
      ...options.optionalProperties,
    };
  }

  if (options.requiredProperties) {
    properties = {
      ...properties,
      ...options.requiredProperties,
    };
  }

  return {
    type: "object",
    title,
    properties,
    required: options.requiredProperties
      ? Object.keys(options.requiredProperties)
      : undefined,
    additionalProperties: options.additionalProperties,
  };
}

export function makeOneOf(title: string, schemas: JSONSchema[]): JSONSchema {
  return {
    title,
    oneOf: schemas,
  };
}

export function makeAnyOf(title: string, schemas: JSONSchema[]): JSONSchema {
  return {
    title,
    anyOf: schemas,
  };
}
