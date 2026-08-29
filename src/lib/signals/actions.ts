"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function refreshSignalFeed(slug: string): Promise<void> {
  revalidateTag(`signal-feed-${slug}`);
  revalidatePath(`/signals/${slug}`);
}

export async function refreshCustomSignalFeed(boardId: string): Promise<void> {
  revalidateTag(`signal-feed-custom-${boardId}`);
  revalidatePath(`/dashboard/signals/${boardId}`);
}
