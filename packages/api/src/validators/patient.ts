import { z } from "zod";

import { createUnionSchemaWithOperationOutcome } from "./operation-outcome";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const textSchema = z.object({
  status: z.string(),
  div: z.string(),
});

const extensionSchema = z
  .object({
    url: z.string(),
    // The value could be different types; you may need to adjust based on your data
    valueCode: z.string().optional(),
    valueCodeableConcept: z
      .object({
        coding: z.array(codingSchema).optional(),
        text: z.string().optional(),
      })
      .optional(),
    valueString: z.string().optional(),
    valueBoolean: z.boolean().optional(),
    valueIdentifier: z
      .object({
        system: z.string().optional(),
        value: z.string().optional(),
      })
      .optional(),
  })
  .optional();

const identifierSchema = z.object({
  use: z.string().optional(),
  type: z
    .object({
      coding: z.array(codingSchema),
    })
    .optional(),
  system: z.string().optional(),
  value: z.string(),
  assigner: z
    .object({
      display: z.string(),
    })
    .optional(),
  period: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

const nameSchema = z.object({
  use: z.string().optional(),
  family: z.string().optional(),
  given: z.array(z.string()).optional(),
  period: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

const telecomSchema = z.object({
  system: z.string(),
  value: z.string(),
  use: z.string().optional(),
  rank: z.number().optional(),
});

const addressSchema = z.object({
  use: z.string().optional(),
  type: z.string().optional(),
  line: z.array(z.string()).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

const contactSchema = z.object({
  relationship: z.array(
    z.object({
      coding: z.array(codingSchema),
      text: z.string().optional(),
    }),
  ),
  name: z
    .object({
      text: z.string(),
    })
    .optional(),
  telecom: z.array(telecomSchema).optional(),
});

const communicationSchema = z.object({
  language: z.object({
    coding: z.array(codingSchema),
    text: z.string().optional(),
  }),
});

// TODO - check with generated code
const patientResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  text: textSchema,
  extension: z.array(extensionSchema).optional(),
  identifier: z.array(identifierSchema).optional(),
  active: z.boolean().optional(),
  name: z.array(nameSchema).optional(),
  telecom: z.array(telecomSchema).optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  deceasedBoolean: z.boolean().optional(),
  address: z.array(addressSchema).optional(),
  contact: z.array(contactSchema).optional(),
  communication: z.array(communicationSchema).optional(),
});

const entrySchema = z.object({
  resource: patientResourceSchema,
});

export const patientBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

export const readPatientResponseSchema = createUnionSchemaWithOperationOutcome(
  patientResourceSchema,
);

export const searchPatientResponseSchema =
  createUnionSchemaWithOperationOutcome(patientBundleSchema);

// Usage: Validate data with responseSchema.parse(yourDataObject)
