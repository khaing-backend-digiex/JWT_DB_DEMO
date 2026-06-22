import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constant/http-status.enum";

export interface ValidationRule {
    name?: string;
    type?: string;
    isRequired?: boolean;
    isEnum?: boolean;
    enums?: any[];
    isArray?: boolean;
}

export type ValidationSchema = Record<string, string | ValidationRule>;

export const validateBodyMiddleware = (schema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        for (const key in schema) {
            const values = body[key];
            const rule = schema[key];
            const isRequired = typeof rule === 'string' ? true : (rule!.isRequired !== false);
            const fieldName = typeof rule === 'string' ? rule : (rule!.name || key);

            if (values === undefined || values === null || values === "") {
                if (isRequired) {
                    return res.status(HttpStatus.BAD_REQUEST).json({ error: "Missing required field " + fieldName });
                }
                continue;
            }

            if (typeof rule !== 'string') {
                if (rule!.type && getTypeOrArray(values) !== rule!.type) {
                    return res.status(HttpStatus.INVALID_INPUT).json({ error: "Invalid field type " + fieldName });
                }

                if (rule!.isArray && !Array.isArray(values)) {
                    return res.status(HttpStatus.INVALID_INPUT).json({ error: "Field must be an array: " + fieldName });
                }

                if (rule!.isEnum && rule!.enums && !rule!.enums.includes(values)) {
                    return res.status(HttpStatus.INVALID_INPUT).json({ error: "Invalid field value " + fieldName });
                }
            } else {

                if (typeof values !== "string") {
                    return res.status(HttpStatus.INVALID_INPUT).json({ error: "Invalid field type " + fieldName });
                }
            }
        }

        next();
    };
};
export const validateQueryMiddleware = (schema: Record<string, any>) => {
    return (req: any, res: any, next: any) => {
        const query = req.query;
        for (const key in schema) {
            const value = query[key];
            const field = schema[key];
            if (field.isRequired && (value === undefined || value === null)
            ) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Missing required field " + key });
            }
            if (value === undefined) {
                continue;
            }
            if (field.type === "number") {
                const parsed = Number(value);

                if (Number.isNaN(parsed)) {
                    return res.status(HttpStatus.INVALID_INPUT).json({ error: "Invalid field type " + key + ", expected number" });
                }
            }
            if (field.enumType) {
                const enumValues = Object.values(field.enumType);
                if (!enumValues.includes(value)) {
                    return res.status(HttpStatus.INVALID_INPUT).json({ error: "Invalid enum value for " + key });
                }
            }
        }
        next();
    }
}


const getTypeOrArray = (value: any): string => {
    return Array.isArray(value) ? "array" : typeof value;
};