import { CreateShortInput } from "../types/shorts";
export interface ValidationErrorResult {
    message: string;
    missingFields: Record<string, string>;
}
export declare function validateCreateShortInput(input: object): CreateShortInput;
