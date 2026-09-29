import { supabase } from './supabase';

/**
 * Detects the client device category: iOS, Android, Windows, macOS, or Linux/Other.
 */
export function getDeviceType(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'Unknown';
  }

  const ua = navigator.userAgent || '';
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

  // 1. iOS (iPhone, iPad, iPod, or iPadOS reporting as MacIntel with multi-touch)
  if (/iPhone|iPod/.test(ua) || /iPad/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'iOS';
  }

  // 2. Android
  if (/Android/i.test(ua)) {
    return 'Android';
  }

  // 3. Windows
  if (/Windows/i.test(ua) || /Win/i.test(platform)) {
    return 'Windows';
  }

  // 4. macOS
  if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) {
    return 'macOS';
  }

  // 5. Linux
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) {
    return 'Linux';
  }

  return 'Other';
}

/**
 * Tracks chapter visit count and records the last device in Supabase table 'WSStats'.
 * Runs silently in the background with zero UI display.
 */
export async function trackChapterVisit(chapterName: string): Promise<void> {
  if (!supabase) return;

  try {
    const device = getDeviceType();

    // 1. Fetch current count for this chapter
    const { data, error } = await supabase
      .from('WSStats')
      .select('count')
      .eq('Chapter', chapterName)
      .maybeSingle();

    if (error) {
      console.warn(`[Tracker] Error fetching stats for ${chapterName}:`, error.message);
      return;
    }

    if (data) {
      // 2. Increment count by +1, update timestamp and Last_Device
      const newCount = (typeof data.count === 'number' ? data.count : 0) + 1;
      const { error: updateError } = await supabase
        .from('WSStats')
        .update({
          count: newCount,
          updated: new Date().toISOString(),
          Last_Device: device
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
          updated: new Date().toISOString(),
          Last_Device: device
        });
    }
  } catch (err) {
    // Fail silently - never disrupt user experience
    console.warn(`[Tracker] Exception tracking ${chapterName}:`, err);
  }
}
