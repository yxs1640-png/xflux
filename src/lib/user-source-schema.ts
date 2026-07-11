import { z } from "zod";
import { USER_SOURCE_IDS, type UserSourceId } from "./user-source-config";

const userSourceEnum = z.enum(USER_SOURCE_IDS as [UserSourceId, ...UserSourceId[]]);

export const userSourceSchema = z.object({
  userSource: userSourceEnum.optional(),
  userSourceDetail: z.string().max(200).optional(),
});

export function normalizeUserSourceFields(data: {
  userSource?: UserSourceId;
  userSourceDetail?: string;
}) {
  if (!data.userSource) {
    return { userSource: null, userSourceDetail: null };
  }

  return {
    userSource: data.userSource,
    userSourceDetail:
      data.userSource === "other" ? data.userSourceDetail?.trim() || null : null,
  };
}
