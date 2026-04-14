"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateShortInput = validateCreateShortInput;
const shorts_1 = require("../types/shorts");
const logger_1 = require("../logger");
function validateCreateShortInput(input) {
    const validated = shorts_1.createShortInput.safeParse(input);
    logger_1.logger.info({ validated }, "Validated input");
    if (validated.success) {
        return validated.data;
    }
    // Process the validation errors
    const errorResult = formatZodError(validated.error);
    throw new Error(JSON.stringify({
        message: errorResult.message,
        missingFields: errorResult.missingFields,
    }));
}
function formatZodError(error) {
    const missingFields = {};
    // Extract all the errors into a human-readable format
    error.errors.forEach((err) => {
        const path = err.path.join(".");
        missingFields[path] = err.message;
    });
    // Create a human-readable message
    const errorPaths = Object.keys(missingFields);
    let message = `Validation failed for ${errorPaths.length} field(s): `;
    message += errorPaths.join(", ");
    return {
        message,
        missingFields,
    };
}
