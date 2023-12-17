import type { FieldErrors, FieldValues } from "react-hook-form";

export const getReadableValidationErrorMessage = <T extends FieldValues>(
  errors: FieldErrors<T>,
) => {
  let validationMessage = "";
  for (const [fieldName, value] of Object.entries(errors)) {
    validationMessage += `${fieldName}: ${getErrorMessageFromObjectRecursively(
      value,
    )}\n\n`;
  }

  return validationMessage.trim();
};

export const getErrorMessageFromObjectRecursively = (o: any) => {
  if ("message" in o) {
    return o.message;
  } else {
    let message;
    Object.keys(o).forEach((objKey) => {
      if ("message" in o[objKey]) {
        message = o[objKey].message;
      } else {
        message = getErrorMessageFromObjectRecursively(o[objKey]);
      }
    });
    return message;
  }
};
