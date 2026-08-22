import { z } from "zod";
import { USER_SOURCE_IDS, type UserSourceId } from "./user-source-config";

const userSourceEnum = z.enum(USER_SOURCE_IDS as [UserSourceId, ...UserSourceId[]]);

export const userSourceSchema = z.object({
  userSource: userSourceEnum.optional(),
  userSourceDetail: z.string().max(200).optional(),
  /** gclid/gbraid/wbraid from ad click — stored for google_search attribution */
  googleAdsClickId: z.string().max(200).optional(),
});

export function normalizeUserSourceFields(data: {
  userSource?: UserSourceId;
  userSourceDetail?: string;
  googleAdsClickId?: string;
}) {
  if (!data.userSource) {
    return { userSource: null, userSourceDetail: null };
  }

  const clickId = data.googleAdsClickId?.trim() || null;

  let signupSourceDetail: string | null = null;
  if (data.userSource === "other") {
    signupSourceDetail = data.userSourceDetail?.trim() || null;
  } else if (data.userSource === "google_search" && clickId) {
    signupSourceDetail = clickId;
  }

  return {
    userSource: data.userSource,
    userSourceDetail: signupSourceDetail,
  };
}
