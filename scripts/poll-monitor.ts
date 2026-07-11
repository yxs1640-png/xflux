import { PrismaClient } from "@prisma/client";
import { pollMonitorTask } from "../src/lib/monitor-poll";

async function main() {
  const prisma = new PrismaClient();
  const id = process.argv[2];

  if (!id) {
    console.error("Usage: npx tsx scripts/poll-monitor.ts <monitor-id>");
    process.exit(1);
  }

  const result = await pollMonitorTask(id);
  console.log("Poll result:", result);

  const task = await prisma.monitorTask.findUnique({
    where: { id },
    include: { hits: { orderBy: { detectedAt: "desc" }, take: 3 } },
  });

  console.log("Updated state:", {
    lastTweetId: task?.lastTweetId,
    lastCheckAt: task?.lastCheckAt,
    lastError: task?.lastError,
    recentHits: task?.hits.map((h) => ({ id: h.tweetId, text: h.text.slice(0, 80) })),
  });

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
