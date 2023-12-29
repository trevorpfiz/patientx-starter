import type { CareTeamBundle } from "@acme/shared/src/validators/care-team";

function mapPractitionerIdsToNames(careTeamData: CareTeamBundle) {
  const practitionerMap = new Map();
  careTeamData?.entry?.forEach((entry) => {
    entry.resource.participant.forEach((participant) => {
      const id = participant.member.reference.split("/")[1]; // Extracts ID from "Practitioner/ID"
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

export { mapPractitionerIdsToNames };
