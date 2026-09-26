import teamData from "../JSON/team.json";
import { resolveMedia } from "./catalog";

/* team.json with member photos resolved to bundled asset URLs (paths are relative to src/assets). */
const team = {
  ...teamData,
  members: teamData.members.map((member) => ({ ...member, image: resolveMedia(member.image) })),
};

export default team;
