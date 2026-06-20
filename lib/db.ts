import { supabase } from "@/lib/supabase";
import type { Happening, TimeBucket } from "@/data/happenings";

// Map a DB row to the app's Happening shape.
function rowToHappening(row: any, mine: boolean): Happening {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    neighborhood: row.neighborhood,
    venue: row.venue,
    address: row.address ?? `${row.venue}, ${row.neighborhood}, Mumbai`,
    when: row.when_text ?? "Tonight",
    timeBucket: (row.time_bucket ?? "tonight") as TimeBucket,
    price: row.price ?? "Free",
    emoji: row.emoji ?? "🔥",
    color: row.color ?? "#C8FF00",
    hype: row.hype ?? 1,
    vibe: row.vibe ?? "Chill",
    host: row.host ?? "Local",
    description: row.description ?? "",
    tags: row.tags ?? [],
    mine,
  };
}

export async function fetchSharedHappenings(userId: string): Promise<Happening[]> {
  const { data, error } = await supabase
    .from("happenings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => rowToHappening(r, r.created_by === userId));
}

export async function fetchUserHappenings(
  userId: string
): Promise<{ saved: string[]; going: string[] }> {
  const { data, error } = await supabase
    .from("user_happenings")
    .select("happening_id, kind")
    .eq("user_id", userId);
  if (error) throw error;
  const saved: string[] = [];
  const going: string[] = [];
  for (const row of data ?? []) {
    if (row.kind === "saved") saved.push(row.happening_id);
    else if (row.kind === "going") going.push(row.happening_id);
  }
  return { saved, going };
}

export async function fetchProfile(
  userId: string
): Promise<{ name: string | null; neighborhood: string | null } | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, neighborhood")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function setSaveState(
  userId: string,
  happeningId: string,
  kind: "saved" | "going",
  on: boolean
) {
  if (on) {
    await supabase
      .from("user_happenings")
      .upsert({ user_id: userId, happening_id: happeningId, kind });
  } else {
    await supabase
      .from("user_happenings")
      .delete()
      .match({ user_id: userId, happening_id: happeningId, kind });
  }
}

export async function insertHappening(
  userId: string,
  h: Happening
): Promise<Happening | null> {
  const { data, error } = await supabase
    .from("happenings")
    .insert({
      title: h.title,
      category: h.category,
      neighborhood: h.neighborhood,
      venue: h.venue,
      address: h.address,
      when_text: h.when,
      time_bucket: h.timeBucket,
      price: h.price,
      emoji: h.emoji,
      color: h.color,
      vibe: h.vibe,
      host: h.host,
      description: h.description,
      tags: h.tags,
      hype: h.hype,
      created_by: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data ? rowToHappening(data, true) : null;
}

export async function updateNeighborhood(userId: string, neighborhood: string) {
  await supabase.from("profiles").update({ neighborhood }).eq("id", userId);
}
