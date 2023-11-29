import * as z from "zod";

// Forms
export const newPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});
export type NewPatient = z.infer<typeof newPatientSchema>;

// ----------------- //

// FHIR API validation

// export const patientSchema = z.object({
//   resourceType: z.literal("Patient"),
//   id: z.string(),
// });
export const patientSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  text: z.object({ status: z.string(), div: z.string() }),
  extension: z.array(
    z.union([
      z.object({ url: z.string(), valueCode: z.string() }),
      z.object({
        url: z.string(),
        valueCodeableConcept: z.object({
          coding: z.array(
            z.object({
              system: z.string(),
              code: z.string(),
              display: z.string(),
            }),
          ),
          text: z.string(),
        }),
      }),
      z.object({
        extension: z.array(
          z.union([
            z.object({
              url: z.string(),
              valueCoding: z.object({
                system: z.string(),
                code: z.string(),
                display: z.string(),
              }),
            }),
            z.object({ url: z.string(), valueString: z.string() }),
          ]),
        ),
        url: z.string(),
      }),
      z.object({ url: z.string(), valueString: z.string() }),
      z.object({
        extension: z.array(
          z.union([
            z.object({
              url: z.string(),
              valueIdentifier: z.object({
                system: z.string(),
                value: z.string(),
              }),
            }),
            z.object({ url: z.string(), valueString: z.string() }),
            z.object({ url: z.string(), valueBoolean: z.boolean() }),
          ]),
        ),
        url: z.string(),
      }),
    ]),
  ),
  identifier: z.array(
    z.union([
      z.object({
        use: z.string(),
        type: z.object({
          coding: z.array(z.object({ system: z.string(), code: z.string() })),
        }),
        system: z.string(),
        value: z.string(),
        assigner: z.object({ display: z.string() }),
      }),
      z.object({
        id: z.string(),
        use: z.string(),
        system: z.string(),
        value: z.string(),
        period: z.object({ start: z.string(), end: z.string() }),
      }),
    ]),
  ),
  active: z.boolean(),
  name: z.array(
    z.union([
      z.object({
        use: z.string(),
        family: z.string(),
        given: z.array(z.string()),
        period: z.object({ start: z.string(), end: z.string() }),
      }),
      z.object({
        use: z.string(),
        given: z.array(z.string()),
        period: z.object({ start: z.string(), end: z.string() }),
      }),
    ]),
  ),
  telecom: z.array(
    z.object({
      id: z.string(),
      extension: z.array(
        z.object({ url: z.string(), valueBoolean: z.boolean() }),
      ),
      system: z.string(),
      value: z.string(),
      use: z.string(),
      rank: z.number(),
    }),
  ),
  gender: z.string(),
  birthDate: z.string(),
  deceasedBoolean: z.boolean(),
  address: z.array(
    z.object({
      id: z.string(),
      use: z.string(),
      type: z.string(),
      line: z.array(z.string()),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
  ),
  photo: z.array(z.object({ url: z.string() })),
  contact: z.array(
    z.union([
      z.object({
        id: z.string(),
        extension: z.array(
          z.object({ url: z.string(), valueBoolean: z.boolean() }),
        ),
        relationship: z.array(
          z.object({
            coding: z.array(
              z.object({
                system: z.string(),
                code: z.string(),
                display: z.string(),
              }),
            ),
            text: z.string(),
          }),
        ),
        name: z.object({ text: z.string() }),
        telecom: z.array(z.object({ system: z.string(), value: z.string() })),
      }),
      z.object({
        id: z.string(),
        extension: z.array(
          z.object({ url: z.string(), valueBoolean: z.boolean() }),
        ),
        relationship: z.array(z.object({ text: z.string() })),
        name: z.object({ text: z.string() }),
        telecom: z.array(z.object({ system: z.string(), value: z.string() })),
      }),
    ]),
  ),
  communication: z.array(
    z.object({
      language: z.object({
        coding: z.array(
          z.object({
            system: z.string(),
            code: z.string(),
            display: z.string(),
          }),
        ),
        text: z.string(),
      }),
    }),
  ),
});
export type BasicPatient = z.infer<typeof patientSchema>;

export const allPatientsSchema = z.object({
  resourceType: z.string(),
  type: z.string(),
  total: z.number(),
  link: z.array(z.object({ relation: z.string(), url: z.string() })),
  entry: z.array(
    z.object({
      resource: z.object({
        resourceType: z.string(),
        id: z.string(),
        text: z.object({ status: z.string(), div: z.string() }),
        extension: z.array(
          z.union([
            z.object({ url: z.string(), valueCode: z.string() }),
            z.object({
              url: z.string(),
              valueCodeableConcept: z.object({
                coding: z.array(
                  z.object({
                    system: z.string(),
                    code: z.string(),
                    display: z.string(),
                  }),
                ),
                text: z.string(),
              }),
            }),
            z.object({
              extension: z.array(
                z.union([
                  z.object({
                    url: z.string(),
                    valueCoding: z.object({
                      system: z.string(),
                      code: z.string(),
                      display: z.string(),
                    }),
                  }),
                  z.object({ url: z.string(), valueString: z.string() }),
                ]),
              ),
              url: z.string(),
            }),
            z.object({ url: z.string(), valueString: z.string() }),
            z.object({
              extension: z.array(
                z.union([
                  z.object({
                    url: z.string(),
                    valueIdentifier: z.object({
                      system: z.string(),
                      value: z.string(),
                    }),
                  }),
                  z.object({ url: z.string(), valueString: z.string() }),
                  z.object({ url: z.string(), valueBoolean: z.boolean() }),
                ]),
              ),
              url: z.string(),
            }),
          ]),
        ),
        identifier: z.array(
          z.union([
            z.object({
              use: z.string(),
              type: z.object({
                coding: z.array(
                  z.object({ system: z.string(), code: z.string() }),
                ),
              }),
              system: z.string(),
              value: z.string(),
              assigner: z.object({ display: z.string() }),
            }),
            z.object({
              id: z.string(),
              use: z.string(),
              system: z.string(),
              value: z.string(),
              period: z.object({ start: z.string(), end: z.string() }),
            }),
          ]),
        ),
        active: z.boolean(),
        name: z.array(
          z.union([
            z.object({
              use: z.string(),
              family: z.string(),
              given: z.array(z.string()),
              period: z.object({ start: z.string(), end: z.string() }),
            }),
            z.object({
              use: z.string(),
              given: z.array(z.string()),
              period: z.object({ start: z.string(), end: z.string() }),
            }),
          ]),
        ),
        telecom: z.array(
          z.object({
            id: z.string(),
            extension: z.array(
              z.object({ url: z.string(), valueBoolean: z.boolean() }),
            ),
            system: z.string(),
            value: z.string(),
            use: z.string(),
            rank: z.number(),
          }),
        ),
        gender: z.string(),
        birthDate: z.string(),
        deceasedBoolean: z.boolean(),
        address: z.array(
          z.object({
            id: z.string(),
            use: z.string(),
            type: z.string(),
            line: z.array(z.string()),
            city: z.string(),
            state: z.string(),
            postalCode: z.string(),
            country: z.string(),
          }),
        ),
        contact: z.array(
          z.union([
            z.object({
              id: z.string(),
              extension: z.array(
                z.object({ url: z.string(), valueBoolean: z.boolean() }),
              ),
              relationship: z.array(
                z.object({
                  coding: z.array(
                    z.object({
                      system: z.string(),
                      code: z.string(),
                      display: z.string(),
                    }),
                  ),
                  text: z.string(),
                }),
              ),
              name: z.object({ text: z.string() }),
              telecom: z.array(
                z.object({ system: z.string(), value: z.string() }),
              ),
            }),
            z.object({
              id: z.string(),
              extension: z.array(
                z.object({ url: z.string(), valueBoolean: z.boolean() }),
              ),
              relationship: z.array(z.object({ text: z.string() })),
              name: z.object({ text: z.string() }),
              telecom: z.array(
                z.object({ system: z.string(), value: z.string() }),
              ),
            }),
          ]),
        ),
        communication: z.array(
          z.object({
            language: z.object({
              coding: z.array(
                z.object({
                  system: z.string(),
                  code: z.string(),
                  display: z.string(),
                }),
              ),
              text: z.string(),
            }),
          }),
        ),
      }),
    }),
  ),
});
export type BasicAllPatients = z.infer<typeof allPatientsSchema>;
