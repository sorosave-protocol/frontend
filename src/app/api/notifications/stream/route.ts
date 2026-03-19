import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/notifications/stream?address=<stellar_address>
 *
 * Server-Sent Events stream for real-time notifications.
 * Emits contribution, payout, and dispute events.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return new Response("Missing address", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial keep-alive comment
      controller.enqueue(encoder.encode(": connected\n\n"));

      // Keep-alive ping every 25 seconds to prevent proxy timeouts
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(pingInterval);
        }
      }, 25000);

      // In a real implementation, subscribe to on-chain events here.
      // This scaffold emits a welcome event so the client can verify the stream works.
      setTimeout(() => {
        try {
          const event = JSON.stringify({
            groupId: null,
            message: "Notifications connected. You will receive updates for contributions, payouts, and disputes.",
          });
          controller.enqueue(encoder.encode(`event: contribution\ndata: ${event}\n\n`));
        } catch {}
      }, 500);

      req.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
