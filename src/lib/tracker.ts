import { supabase } from './supabase';

/**
 * Tracks chapter visit count in Supabase table 'WSStats'.
 * Runs silently in the background with zero UI display.
 */
export async function trackChapterVisit(chapterName: string): Promise<void> {
  if (!supabase) return;

  try {
    // 1. Fetch current count for this chapter
    const { data, error } = await supabase
      .from('WSStats')
      .select('count')
      .eq('Chapter', chapterName)
      .maybeSingle();

    if (error) {
      // Silently log warning only in development
      console.warn(`[Tracker] Error fetching stats for ${chapterName}:`, error.message);
      return;
    }

    if (data) {
      // 2. Increment count by +1 and update timestamp
      const newCount = (typeof data.count === 'number' ? data.count : 0) + 1;
      const { error: updateError } = await supabase
        .from('WSStats')
        .update({
          count: newCount,
          updated: new Date().toISOString()
        })
        .eq('Chapter', chapterName);

      if (updateError) {
        console.warn(`[Tracker] Error updating stats for ${chapterName}:`, updateError.message);
      }
    } else {
      // 3. Fallback insert if chapter row doesn't exist yet
      await supabase
        .from('WSStats')
        .insert({
          Chapter: chapterName,
          count: 1,
          updated: new Date().toISOString()
        });
    }
  } catch (err) {
    // Fail silently - never disrupt user experience
    console.warn(`[Tracker] Exception tracking ${chapterName}:`, err);
  }
}
