import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Sparkles,
  Sun,
  Moon,
  X,
  Compass,
  Music,
  Heart,
  Bookmark,
  Maximize2,
  Type,
  ArrowLeft,
  FileText
} from 'lucide-react';
import {
  MORE_THAN_SALAAM_PAGES,
  BOOK_IMAGES,
  BookPageData
} from '../../data/moreThanSalaamBook';

interface SceneBookReaderProps {
  onBack: () => void;
}

type ReaderTheme = 'paper' | 'night';
type FontSizeLevel = 'sm' | 'md' | 'lg';

const STORAGE_PAGE_KEY = 'for_shajer_book_page_v1';
const STORAGE_THEME_KEY = 'for_shajer_book_theme_v1';
const STORAGE_FONT_KEY = 'for_shajer_book_font_v1';
const STORAGE_BOOKMARKS_KEY = 'for_shajer_book_bookmarks_v1';

// Helper to render inline italics (*text*) while keeping every character untouched
function renderInlineFormattedText(text: string): React.ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic font-serif">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

interface VerbatimMarkdownBlockProps {
  rawMarkdown: string;
  theme: ReaderTheme;
  fontSize: FontSizeLevel;
  isCoverPage: boolean;
}

function VerbatimMarkdownRenderer({
  rawMarkdown,
  theme,
  fontSize,
  isCoverPage
}: VerbatimMarkdownBlockProps) {
  const isPaper = theme === 'paper';

  const bodySizeClass =
    fontSize === 'sm'
      ? 'text-[14px] sm:text-[15px] leading-[1.8]'
      : fontSize === 'lg'
      ? 'text-[17px] sm:text-[19px] leading-[1.95]'
      : 'text-[15.5px] sm:text-[17px] leading-[1.88]';

  // Parse rawMarkdown line-by-line preserving 100% of the original text
  const blocks = useMemo(() => {
    const lines = rawMarkdown.split('\n');
    const result: Array<
      | { type: 'h1'; text: string }
      | { type: 'h2'; text: string }
      | { type: 'h3'; text: string }
      | { type: 'blockquote'; lines: string[] }
      | { type: 'italic_line'; text: string }
      | { type: 'paragraph'; text: string }
    > = [];

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '') {
        i++;
        continue;
      }

      if (line.startsWith('# ')) {
        result.push({ type: 'h1', text: line.slice(2) });
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        result.push({ type: 'h2', text: line.slice(3) });
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        result.push({ type: 'h3', text: line.slice(4) });
        i++;
        continue;
      }

      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2));
          i++;
        }
        result.push({ type: 'blockquote', lines: quoteLines });
        continue;
      }

      if (
        trimmed.startsWith('*') &&
        trimmed.endsWith('*') &&
        trimmed.length > 2 &&
        !trimmed.slice(1, -1).includes('*')
      ) {
        result.push({ type: 'italic_line', text: trimmed.slice(1, -1) });
        i++;
        continue;
      }

      // Collect consecutive non-blank normal lines (e.g. "For Shajer,\nwho turned...")
      const paraLines: string[] = [line];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('> ') &&
        !(
          lines[i].trim().startsWith('*') &&
          lines[i].trim().endsWith('*') &&
          lines[i].trim().length > 2
        )
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      result.push({ type: 'paragraph', text: paraLines.join('\n') });
    }

    return result;
  }, [rawMarkdown]);

  let seenFirstParagraph = false;

  return (
    <div className={isCoverPage ? 'text-center py-4 sm:py-6 space-y-5' : 'space-y-4 sm:space-y-5'}>
      {blocks.map((block, index) => {
        if (block.type === 'h1') {
          return (
            <div
              key={index}
              className={`pt-2 pb-3 ${
                isCoverPage ? 'text-center' : 'text-center border-b pb-4 mb-4'
              } ${isPaper ? 'border-[#D9C3B0]/70' : 'border-white/15'}`}
            >
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span
                  className={`h-[1px] w-6 sm:w-10 ${
                    isPaper ? 'bg-[#9E5A63]/50' : 'bg-gold-light/50'
                  }`}
                />
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    isPaper ? 'text-[#9E5A63]' : 'text-gold-light'
                  }`}
                />
                <span
                  className={`h-[1px] w-6 sm:w-10 ${
                    isPaper ? 'bg-[#9E5A63]/50' : 'bg-gold-light/50'
                  }`}
                />
              </div>
              <h1
                className={`font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide ${
                  isPaper ? 'text-[#5C1D2E]' : 'text-white shimmer-text'
                }`}
              >
                {block.text}
              </h1>
            </div>
          );
        }

        if (block.type === 'h2') {
          return (
            <div key={index} className="pt-2 pb-1 text-center sm:text-left">
              <h2
                className={`font-heading text-xl sm:text-2xl md:text-[26px] font-semibold leading-snug ${
                  isPaper ? 'text-[#6B2436]' : 'text-gold-light'
                }`}
              >
                {block.text}
              </h2>
            </div>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={index}
              className={`font-heading italic text-lg sm:text-xl ${
                isPaper ? 'text-[#7D4350]' : 'text-rose-200/90'
              }`}
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === 'italic_line') {
          const hasNowPlaying = block.text.toLowerCase().includes('now playing:');
          return (
            <div
              key={index}
              className={`my-2.5 ${
                isCoverPage ? 'text-center' : 'text-center sm:text-left'
              }`}
            >
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-serif italic ${
                  isPaper
                    ? 'bg-[#EFE3D4]/85 text-[#6A3845] border border-[#DCC8B4]'
                    : 'bg-white/10 text-rose-200 border border-white/15'
                }`}
              >
                {hasNowPlaying && (
                  <Music
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
                    }`}
                  />
                )}
                <span>{block.text}</span>
              </div>
            </div>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <div
              key={index}
              className={`my-4 pl-4 pr-4 py-3.5 rounded-2xl border-l-4 transition-all ${
                isPaper
                  ? 'bg-[#F3E8DA]/90 border-l-[#8C3B4D] border border-[#E2D0BC] text-[#3B2328] shadow-xs'
                  : 'bg-rose-950/45 border-l-gold-light border border-rose-300/25 text-rose-100 shadow-md'
              }`}
            >
              <div className="space-y-1.5 font-serif text-[14.5px] sm:text-[16px] leading-relaxed">
                {block.lines.map((qLine, qIdx) => (
                  <p key={qIdx} className="whitespace-pre-wrap">
                    {renderInlineFormattedText(qLine)}
                  </p>
                ))}
              </div>
            </div>
          );
        }

        // Standard paragraph
        const isFirstPara = !isCoverPage && !seenFirstParagraph;
        if (isFirstPara) {
          seenFirstParagraph = true;
        }

        return (
          <p
            key={index}
            className={`font-serif whitespace-pre-line ${bodySizeClass} ${
              isPaper ? 'text-[#2C1E1B]' : 'text-white/90'
            } ${
              isCoverPage
                ? 'text-center font-medium max-w-md mx-auto'
                : 'text-left'
            }`}
          >
            {renderInlineFormattedText(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export function SceneBookReader({ onBack }: SceneBookReaderProps) {
  const totalPages = MORE_THAN_SALAAM_PAGES.length;

  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const saved = localStorage.getItem(STORAGE_PAGE_KEY);
    const parsed = saved ? parseInt(saved, 10) : 1;
    return parsed >= 1 && parsed <= totalPages ? parsed : 1;
  });

  const [direction, setDirection] = useState<number>(1);
  const [theme, setTheme] = useState<ReaderTheme>(() => {
    if (typeof window === 'undefined') return 'paper';
    const saved = localStorage.getItem(STORAGE_THEME_KEY) as ReaderTheme | null;
    return saved === 'night' || saved === 'paper' ? saved : 'paper';
  });

  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    if (typeof window === 'undefined') return 'md';
    const saved = localStorage.getItem(STORAGE_FONT_KEY) as FontSizeLevel | null;
    return saved === 'sm' || saved === 'md' || saved === 'lg' ? saved : 'md';
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [jumpInput, setJumpInput] = useState<string>(String(currentPage));
  const [zoomImage, setZoomImage] = useState<{ src: string; caption?: string } | null>(null);

  const pageScrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const pageData: BookPageData =
    MORE_THAN_SALAAM_PAGES[currentPage - 1] || MORE_THAN_SALAAM_PAGES[0];

  const isPaper = theme === 'paper';
  const isBookmarked = bookmarks.includes(currentPage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PAGE_KEY, String(currentPage));
    } catch {
      // ignore storage errors
    }
    setJumpInput(String(currentPage));
    if (pageScrollRef.current) {
      pageScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FONT_KEY, fontSize);
    } catch {
      // ignore
    }
  }, [fontSize]);

  const hapticTap = (style: 'page' | 'light' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (style === 'page') {
        navigator.vibrate([12, 25, 10]);
      } else {
        navigator.vibrate(10);
      }
    }
  };

  const goToPage = (targetPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, targetPage));
    if (clamped === currentPage) return;
    hapticTap('page');
    setDirection(clamped > currentPage ? 1 : -1);
    setCurrentPage(clamped);
  };

  const goNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const toggleBookmark = () => {
    hapticTap('light');
    setBookmarks((prev) => {
      const next = prev.includes(currentPage)
        ? prev.filter((p) => p !== currentPage)
        : [...prev, currentPage].sort((a, b) => a - b);
      try {
        localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const cycleFontSize = () => {
    hapticTap('light');
    setFontSize((prev) => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'));
  };

  // Keyboard Left/Right navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTocOpen || isJumpOpen || zoomImage) return;
      if (e.key === 'ArrowRight') {
        goNextPage();
      } else if (e.key === 'ArrowLeft') {
        goPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Touch swipe left/right to flip pages like a real book
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Only trigger horizontal page flip if horizontal swipe dominates vertical scroll
    if (Math.abs(deltaX) > 68 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
      if (deltaX < 0 && currentPage < totalPages) {
        goNextPage();
      } else if (deltaX > 0 && currentPage > 1) {
        goPrevPage();
      }
    }
  };

  // Group pages by Part for Table of Contents
  const tocGroups = useMemo(() => {
    const groups: Array<{ part: string; items: BookPageData[] }> = [];
    for (const p of MORE_THAN_SALAAM_PAGES) {
      const existing = groups.find((g) => g.part === p.part);
      if (existing) {
        existing.items.push(p);
      } else {
        groups.push({ part: p.part, items: [p] });
      }
    }
    return groups;
  }, []);

  // 3D Realistic Book Page Flip Variants
  const pageFlipVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 28 : -28,
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.97
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -28 : 28,
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.97
    })
  };

  const currentIllustration = pageData.imageKey
    ? BOOK_IMAGES[pageData.imageKey]
    : null;

  const progressPercent = Math.round((currentPage / totalPages) * 100);

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-4xl mx-auto h-[96dvh] max-h-[96dvh] px-1.5 sm:px-4 py-1 sm:py-2 select-none">
      {/* ========================================================
          TOP READER BAR: Back, Title, TOC, Summary, Theme, Font
         ======================================================== */}
      <div
        className={`w-full rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 mb-2 flex items-center justify-between gap-2 backdrop-blur-xl border transition-colors shrink-0 ${
          isPaper
            ? 'bg-[#FAF3E8]/95 border-[#DECBB6] text-[#3B2328] shadow-md'
            : 'bg-[#1D0A1A]/90 border-white/20 text-white shadow-lg'
        }`}
      >
        {/* Left: Back to Hub + TOC Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              hapticTap('light');
              onBack();
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              isPaper
                ? 'bg-[#EFE3D3] hover:bg-[#E5D4BE] text-[#4A2530]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Return to Our Chapter"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Chapters</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticTap('light');
              setIsTocOpen(true);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              isPaper
                ? 'bg-[#8C3B4D] text-white hover:bg-[#732D3D] shadow-xs'
                : 'bg-rose-500/30 border border-rose-300/40 text-rose-100 hover:bg-rose-500/40'
            }`}
            title="Table of Contents"
          >
            <List className="w-3.5 h-3.5" />
            <span>Contents</span>
          </button>
        </div>

        {/* Center: Book Title & Part Pill */}
        <div className="hidden md:flex flex-col items-center text-center truncate px-2">
          <span
            className={`font-heading text-xs uppercase tracking-[0.2em] font-semibold ${
              isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
            }`}
          >
            More Than Salaam
          </span>
          <span
            className={`text-[11px] truncate max-w-[240px] ${
              isPaper ? 'text-[#6E4F54]' : 'text-white/70'
            }`}
          >
            {pageData.part}
          </span>
        </div>

        {/* Right: Page Summary, Bookmark, Font Size, Paper/Night Mode */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Page Summary Toggle */}
          <button
            type="button"
            onClick={() => {
              hapticTap('light');
              setIsSummaryOpen((prev) => !prev);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1 transition-all cursor-pointer ${
              isSummaryOpen
                ? isPaper
                  ? 'bg-[#6B2436] text-white'
                  : 'bg-gold-light text-[#2A0E24] font-semibold'
                : isPaper
                ? 'bg-[#EFE3D3] hover:bg-[#E5D4BE] text-[#4A2530]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="View Page Summary"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Summary</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            type="button"
            onClick={toggleBookmark}
            className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-rose-500 text-white shadow-xs'
                : isPaper
                ? 'bg-[#EFE3D3] hover:bg-[#E5D4BE] text-[#4A2530]'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
            title={isBookmarked ? 'Bookmarked Page' : 'Bookmark this Page'}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
          </button>

          {/* Font Size Cycle */}
          <button
            type="button"
            onClick={cycleFontSize}
            className={`px-2 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-0.5 transition-all cursor-pointer ${
              isPaper
                ? 'bg-[#EFE3D3] hover:bg-[#E5D4BE] text-[#4A2530]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Change Text Size"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase">{fontSize}</span>
          </button>

          {/* Paper / Night Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              hapticTap('light');
              setTheme((prev) => (prev === 'paper' ? 'night' : 'paper'));
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1 transition-all cursor-pointer ${
              isPaper
                ? 'bg-[#2C1E26] text-[#F9E8D2] hover:bg-[#3D2935]'
                : 'bg-[#FAF3E8] text-[#4A2530] hover:bg-white'
            }`}
            title="Switch between Warm Book Paper and Rose-Wine Night Mode"
          >
            {isPaper ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">Night</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Paper</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          MAIN 3D BOOK PAGE VIEWPORT
         ======================================================== */}
      <div
        className="relative flex-1 w-full min-h-0 flex items-stretch justify-center overflow-hidden"
        style={{ perspective: '1600px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: 'spring', stiffness: 180, damping: 26 },
              x: { type: 'spring', stiffness: 200, damping: 28 },
              opacity: { duration: 0.22 }
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border transition-colors duration-300 ${
              isPaper
                ? 'bg-gradient-to-br from-[#FDF9F3] via-[#FAF2E6] to-[#F3E6D4] border-[#DEC9B2] shadow-[0_18px_50px_rgba(40,15,25,0.35),inset_14px_0_28px_rgba(130,85,60,0.08)]'
                : 'bg-gradient-to-br from-[#230B1E]/95 via-[#1B0717]/95 to-[#130411]/95 border-rose-200/20 shadow-[0_18px_50px_rgba(0,0,0,0.65),inset_14px_0_28px_rgba(255,255,255,0.03)] backdrop-blur-xl'
            }`}
          >
            {/* Book Spine Left Shadow Accent */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-3 sm:w-5 pointer-events-none z-20 ${
                isPaper
                  ? 'bg-gradient-to-r from-[#8C584C]/18 via-[#8C584C]/5 to-transparent'
                  : 'bg-gradient-to-r from-black/50 via-black/15 to-transparent'
              }`}
            />

            {/* Running Book Header inside the Page */}
            <div
              className={`px-4 sm:px-8 pt-3 pb-2 border-b flex items-center justify-between text-[11px] sm:text-xs shrink-0 ${
                isPaper
                  ? 'border-[#E6D5C3] text-[#7A545C]'
                  : 'border-white/10 text-rose-200/70'
              }`}
            >
              <span className="font-heading italic truncate max-w-[65%]">
                {pageData.part} — {pageData.title}
              </span>
              <span className="font-mono font-semibold shrink-0">
                Page {pageData.pageNumber} of {totalPages}
              </span>
            </div>

            {/* Collapsible Page Summary Banner */}
            <AnimatePresence>
              {isSummaryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`overflow-hidden border-b shrink-0 ${
                    isPaper
                      ? 'bg-[#F3E5D3] border-[#DEC9B2] text-[#3B2328]'
                      : 'bg-rose-950/70 border-rose-300/25 text-white'
                  }`}
                >
                  <div className="px-4 sm:px-8 py-3 flex flex-col gap-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                          isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Page {pageData.pageNumber} Summary • {pageData.subtitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSummaryOpen(false)}
                        className="p-1 opacity-70 hover:opacity-100 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p
                      className={`text-xs sm:text-sm font-sans leading-relaxed ${
                        isPaper ? 'text-[#4A2C32]' : 'text-rose-100/90'
                      }`}
                    >
                      {pageData.summary}
                    </p>
                    {pageData.nowPlaying && (
                      <div
                        className={`text-[11px] italic flex items-center gap-1.5 mt-0.5 ${
                          isPaper ? 'text-[#7A4450]' : 'text-gold-light/90'
                        }`}
                      >
                        <Music className="w-3 h-3" />
                        <span>Soundtrack: {pageData.nowPlaying}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Book Page Content */}
            <div
              ref={pageScrollRef}
              className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-10 md:px-14 py-5 sm:py-7 custom-scrollbar scroll-smooth touch-pan-y overscroll-contain select-text"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="max-w-2xl mx-auto">
                {/* Storybook Illustration Showcase (if this page has an illustration) */}
                {currentIllustration && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`mb-6 rounded-2xl overflow-hidden border shadow-lg group cursor-pointer ${
                      isPaper
                        ? 'border-[#D8C0A8] bg-[#F5E9DA]'
                        : 'border-white/20 bg-black/40'
                    }`}
                    onClick={() =>
                      setZoomImage({
                        src: currentIllustration,
                        caption: pageData.imageCaption || pageData.title
                      })
                    }
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={currentIllustration}
                        alt={pageData.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[10px] font-sans inline-flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3" />
                        <span>Tap to Enlarge</span>
                      </div>
                    </div>
                    {pageData.imageCaption && (
                      <div
                        className={`px-4 py-2 text-center text-xs font-serif italic ${
                          isPaper ? 'text-[#633640]' : 'text-rose-200/90'
                        }`}
                      >
                        {pageData.imageCaption}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 100% Untouched Verbatim Story Text */}
                <VerbatimMarkdownRenderer
                  rawMarkdown={pageData.rawMarkdown}
                  theme={theme}
                  fontSize={fontSize}
                  isCoverPage={currentPage === 1}
                />

                {/* Bottom of Page Turn Prompt */}
                <div
                  className={`mt-8 pt-5 border-t flex items-center justify-between gap-3 ${
                    isPaper ? 'border-[#E5D4C0]' : 'border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={goPrevPage}
                    disabled={currentPage <= 1}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      isPaper
                        ? 'bg-[#EFE3D3] hover:bg-[#E4D2BC] text-[#4A2530]'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Page</span>
                  </button>

                  <span
                    className={`font-serif italic text-xs ${
                      isPaper ? 'text-[#8C5B63]' : 'text-white/50'
                    }`}
                  >
                    — {currentPage} —
                  </span>

                  {currentPage < totalPages ? (
                    <button
                      type="button"
                      onClick={goNextPage}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isPaper
                          ? 'bg-[#8C3B4D] hover:bg-[#732D3D] text-white'
                          : 'bg-rose-500/35 hover:bg-rose-500/50 border border-rose-300/40 text-white'
                      }`}
                    >
                      <span>Turn Page</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onBack}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPaper
                          ? 'bg-[#8C3B4D] hover:bg-[#732D3D] text-white'
                          : 'bg-gold-light/30 border border-gold-light/50 text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Back to Our Chapter</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================================
          BOTTOM READER BAR: Prev/Next Page, Scrubber, Jump To
         ======================================================== */}
      <div
        className={`w-full rounded-2xl px-3 py-2 sm:px-5 sm:py-2.5 mt-2 flex items-center justify-between gap-2 sm:gap-4 backdrop-blur-xl border transition-colors shrink-0 ${
          isPaper
            ? 'bg-[#FAF3E8]/95 border-[#DECBB6] text-[#3B2328] shadow-md'
            : 'bg-[#1D0A1A]/90 border-white/20 text-white shadow-lg'
        }`}
      >
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={goPrevPage}
          disabled={currentPage <= 1}
          className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            isPaper
              ? 'bg-[#EFE3D3] hover:bg-[#E4D2BC] text-[#4A2530]'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Interactive Page Slider & Progress */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs">
            <span className="font-medium truncate max-w-[170px] sm:max-w-[280px]">
              {pageData.title}
            </span>
            <button
              type="button"
              onClick={() => {
                hapticTap('light');
                setIsJumpOpen(true);
              }}
              className={`font-mono font-semibold underline decoration-dotted underline-offset-2 inline-flex items-center gap-1 cursor-pointer ${
                isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
              }`}
              title="Jump to any page"
            >
              <Compass className="w-3 h-3" />
              <span>
                Page {currentPage}/{totalPages} ({progressPercent}%) • Jump to
              </span>
            </button>
          </div>

          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            aria-label="Book page scrubber"
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#8C3B4D]"
            style={{
              background: isPaper
                ? `linear-gradient(to right, #8C3B4D ${progressPercent}%, #E2D0BC ${progressPercent}%)`
                : `linear-gradient(to right, #E8B4C8 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`
            }}
          />
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={goNextPage}
          disabled={currentPage >= totalPages}
          className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            isPaper
              ? 'bg-[#8C3B4D] hover:bg-[#732D3D] text-white'
              : 'bg-rose-500/35 hover:bg-rose-500/50 text-white border border-rose-300/40'
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* ========================================================
          TABLE OF CONTENTS (TOC) MODAL DRAWER
         ======================================================== */}
      <AnimatePresence>
        {isTocOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setIsTocOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl max-h-[85vh] rounded-3xl border overflow-hidden flex flex-col shadow-2xl ${
                isPaper
                  ? 'bg-[#FAF3E8] border-[#DEC9B2] text-[#3B2328]'
                  : 'bg-[#1E0B1A] border-white/20 text-white'
              }`}
            >
              {/* Modal Header */}
              <div
                className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
                  isPaper ? 'border-[#E5D4C0]' : 'border-white/15'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen
                    className={`w-5 h-5 ${
                      isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
                    }`}
                  />
                  <div className="text-left">
                    <h2 className="font-heading text-lg sm:text-xl font-semibold">
                      Table of Contents
                    </h2>
                    <p
                      className={`text-xs ${
                        isPaper ? 'text-[#7A545C]' : 'text-white/65'
                      }`}
                    >
                      More Than Salaam • {totalPages} Pages
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTocOpen(false)}
                  className="p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bookmarked Pages Quick Filter */}
              {bookmarks.length > 0 && (
                <div
                  className={`px-5 py-2.5 border-b flex items-center gap-2 flex-wrap text-xs shrink-0 ${
                    isPaper
                      ? 'bg-[#F3E5D3] border-[#E5D4C0]'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <span className="font-semibold inline-flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 fill-current text-rose-500" />
                    Bookmarks:
                  </span>
                  {bookmarks.map((bm) => (
                    <button
                      key={bm}
                      type="button"
                      onClick={() => {
                        goToPage(bm);
                        setIsTocOpen(false);
                      }}
                      className={`px-2.5 py-0.5 rounded-full font-mono font-medium cursor-pointer ${
                        isPaper
                          ? 'bg-[#8C3B4D] text-white'
                          : 'bg-rose-500/30 border border-rose-300/40 text-white'
                      }`}
                    >
                      Page {bm}
                    </button>
                  ))}
                </div>
              )}

              {/* Chapter List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar text-left">
                {tocGroups.map((group) => (
                  <div key={group.part} className="space-y-2">
                    <h3
                      className={`font-heading text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold px-1 ${
                        isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
                      }`}
                    >
                      {group.part}
                    </h3>
                    <div className="space-y-1.5">
                      {group.items.map((item) => {
                        const isActive = item.pageNumber === currentPage;
                        return (
                          <button
                            key={item.pageNumber}
                            type="button"
                            onClick={() => {
                              goToPage(item.pageNumber);
                              setIsTocOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                              isActive
                                ? isPaper
                                  ? 'bg-[#8C3B4D] text-white border-[#8C3B4D] shadow-sm'
                                  : 'bg-rose-500/30 border-gold-light/60 text-white shadow-md'
                                : isPaper
                                ? 'bg-[#F5E9DA]/70 hover:bg-[#EFE0CC] border-[#E5D4C0] text-[#3B2328]'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-semibold text-sm sm:text-base truncate">
                                  {item.title}
                                </span>
                                {item.imageKey && (
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${
                                      isActive
                                        ? 'bg-white/20 text-white'
                                        : isPaper
                                        ? 'bg-[#E2CEB8] text-[#5C2332]'
                                        : 'bg-gold-light/20 text-gold-light'
                                    }`}
                                  >
                                    Illustrated
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs truncate mt-0.5 ${
                                  isActive
                                    ? 'text-white/85'
                                    : isPaper
                                    ? 'text-[#7A545C]'
                                    : 'text-white/60'
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            </div>
                            <span
                              className={`font-mono text-xs px-2.5 py-1 rounded-xl shrink-0 ${
                                isActive
                                  ? 'bg-black/20 text-white font-bold'
                                  : isPaper
                                  ? 'bg-[#E6D5C3] text-[#4A2530]'
                                  : 'bg-white/10 text-white/80'
                              }`}
                            >
                              p. {item.pageNumber}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          JUMP TO PAGE MODAL
         ======================================================== */}
      <AnimatePresence>
        {isJumpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsJumpOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 shadow-2xl ${
                isPaper
                  ? 'bg-[#FAF3E8] border-[#DEC9B2] text-[#3B2328]'
                  : 'bg-[#1E0B1A] border-white/20 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass
                    className={`w-5 h-5 ${
                      isPaper ? 'text-[#8C3B4D]' : 'text-gold-light'
                    }`}
                  />
                  <h3 className="font-heading text-lg font-semibold">
                    Jump to Page
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsJumpOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const num = parseInt(jumpInput, 10);
                  if (!isNaN(num)) {
                    goToPage(num);
                    setIsJumpOpen(false);
                  }
                }}
                className="flex items-center gap-2 mb-4"
              >
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border font-mono text-base focus:outline-none ${
                    isPaper
                      ? 'bg-white border-[#D5BEA5] text-[#3B2328]'
                      : 'bg-black/40 border-white/20 text-white'
                  }`}
                  placeholder={`1 - ${totalPages}`}
                />
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm cursor-pointer ${
                    isPaper
                      ? 'bg-[#8C3B4D] text-white hover:bg-[#732D3D]'
                      : 'bg-gold-light text-[#230B1E] font-semibold'
                  }`}
                >
                  Go
                </button>
              </form>

              {/* Quick Part Landmarks */}
              <div className="text-left space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider opacity-70 block mb-2">
                  Quick Landmarks
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Cover & Dedication', page: 1 },
                    { label: 'Part One · Salaam', page: 4 },
                    { label: 'Part Two · Distance', page: 13 },
                    { label: 'Part Three · Beyond', page: 17 },
                    { label: 'Part Four · Fifty Days', page: 22 },
                    { label: 'The Umbrella Scene', page: 24 },
                    { label: 'Qubool Hai', page: 27 },
                    { label: 'A Letter to Shajer', page: 30 }
                  ].map((lm) => (
                    <button
                      key={lm.page}
                      type="button"
                      onClick={() => {
                        goToPage(lm.page);
                        setIsJumpOpen(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between border transition-all cursor-pointer ${
                        isPaper
                          ? 'bg-[#F3E5D3] hover:bg-[#E7D4BC] border-[#DFC9B2] text-[#4A2530]'
                          : 'bg-white/5 hover:bg-white/15 border-white/10 text-white'
                      }`}
                    >
                      <span className="truncate">{lm.label}</span>
                      <span className="font-mono opacity-75 ml-1">p.{lm.page}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          ILLUSTRATION LIGHTBOX MODAL
         ======================================================== */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4"
            onClick={() => setZoomImage(null)}
          >
            <div className="relative max-w-3xl w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="absolute -top-11 right-0 p-2 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={zoomImage.src}
                alt={zoomImage.caption || 'Story illustration'}
                className="w-full max-h-[78vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              {zoomImage.caption && (
                <p className="mt-3 text-sm font-serif italic text-rose-100 text-center">
                  {zoomImage.caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
