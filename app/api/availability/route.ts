import { ensureSchema } from "@/lib/db";
import { getAvailableSlots, isBookableDate } from "@/lib/availability";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";

  if (!isBookableDate(date)) {
    return Response.json({ date, slots: [] });
  }

  try {
    await ensureSchema();
    const slots = await getAvailableSlots(date);
    return Response.json({ date, slots });
  } catch (err) {
    console.error("Availability lookup failed:", err);
    return Response.json(
      { date, slots: [], error: "Impossible de récupérer les créneaux." },
      { status: 503 }
    );
  }
}
