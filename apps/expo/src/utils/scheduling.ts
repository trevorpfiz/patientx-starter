import type { CareTeamBundle } from "@acme/shared/src/validators/care-team";
import type { PractitionerBundle } from "@acme/shared/src/validators/practitioner";

export interface PractitionerInfo {
  name: string;
  role: string;
}

// using /CareTeam
function mapPractitionerIdsToNames(
  careTeamData: CareTeamBundle,
): Map<string, PractitionerInfo> {
  const practitionerMap = new Map<string, PractitionerInfo>();
  careTeamData?.entry?.forEach((entry) => {
    entry.resource.participant.forEach((participant) => {
      const parts = participant.member.reference.split("/");
      const id = parts.length >= 2 ? parts[1] : undefined;

      if (id === undefined) {
        // If id is undefined, skip this iteration
        return;
      }

      let name = participant.member.display;

      // Ensure there is a comma between the name and title if not already present
      if (!name.includes(",")) {
        name = name.replace(/(\sMD|\sPhD|\sDO|\sRN|\sDVM|\sDDS|\DPM)/, ",$1");
      }

      const displayRole = participant.role
        .map((role) => role.coding.map((coding) => coding.display).join(", "))
        .join("; ");

      practitionerMap.set(id, { name, role: displayRole });
    });
  });
  return practitionerMap;
}

// using /Practitioner
function mapPractitionerDetails(
  practitionerData: PractitionerBundle,
): Map<string, PractitionerInfo> {
  const practitionerMap = new Map<string, PractitionerInfo>();

  practitionerData?.entry?.forEach((entry) => {
    const practitioner = entry.resource;
    const id = practitioner.id;

    // Use the 'text' field for the name if available, else default to "Unknown"
    const name =
      practitioner.name?.map((name) => name.text).join(", ") || "Unknown";

    // If there is a qualification, use it to infer role, else default to "Unknown Role"
    const role =
      practitioner.qualification?.map((qual) => qual.code?.text).join(", ") ??
      "Unknown Role";

    practitionerMap.set(id, { name, role });
  });

  return practitionerMap;
}

export { mapPractitionerIdsToNames, mapPractitionerDetails };
