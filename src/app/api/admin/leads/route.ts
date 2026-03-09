import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const adminKey = req.headers.get("x-admin-key");
    const expectedKey = process.env.ADMIN_DASHBOARD_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      leads: data,
    });
  } catch (error) {
    console.error("Admin leads fetch error:", error);

    return Response.json(
      {
        ok: false,
        error: "Failed to fetch leads",
      },
      { status: 500 }
    );
  }
}