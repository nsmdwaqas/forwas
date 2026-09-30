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
 * Tracks chapter visit count, device-specific counts (Android, iOS, Windows),
 * and records the last device in Supabase table 'WSStats'.
 * Runs silently in the background with zero UI display.
 */
export async function trackChapterVisit(chapterName: string): Promise<void> {
  if (!supabase) return;

  try {
    const device = getDeviceType();
    const isAndroid = device === 'Android';
    const isIos = device === 'iOS';
    const isWindows = device === 'Windows';

    // 1. Fetch current count and device counts for this chapter
    const { data, error } = await supabase
      .from('WSStats')
      .select('count, Count_Android, Count_ios, Count_win')
      .eq('Chapter', chapterName)
      .maybeSingle();

    if (error) {
      console.warn(`[Tracker] Error fetching stats for ${chapterName}:`, error.message);
      return;
    }

    if (data) {
      // 2. Increment total count by +1
      const newTotalCount = (typeof data.count === 'number' ? data.count : 0) + 1;

      // Prepare update payload
      const updatePayload: Record<string, any> = {
        count: newTotalCount,
        updated: new Date().toISOString(),
        Last_Device: device
      };

      // Increment device-specific columns based on visitor's device
      if (isAndroid) {
        const currentAndroidCount = typeof data.Count_Android === 'number' ? data.Count_Android : 0;
        updatePayload.Count_Android = currentAndroidCount + 1;
      }

      if (isIos) {
        const currentIosCount = typeof data.Count_ios === 'number' ? data.Count_ios : 0;
        updatePayload.Count_ios = currentIosCount + 1;
      }

      if (isWindows) {
        const currentWinCount = typeof data.Count_win === 'number' ? data.Count_win : 0;
        updatePayload.Count_win = currentWinCount + 1;
      }

      const { error: updateError } = await supabase
        .from('WSStats')
        .update(updatePayload)
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
          Last_Device: device,
          Count_Android: isAndroid ? 1 : 0,
          Count_ios: isIos ? 1 : 0,
          Count_win: isWindows ? 1 : 0
        });
    }
  } catch (err) {
    // Fail silently - never disrupt user experience
    console.warn(`[Tracker] Exception tracking ${chapterName}:`, err);
  }
}
