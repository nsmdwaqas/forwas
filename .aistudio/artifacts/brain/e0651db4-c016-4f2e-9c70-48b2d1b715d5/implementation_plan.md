# Implementation Plan: "More Than Salaam" — Interactive Book Reader & Unlocked Gift

## 1. Overview & Strict Scope
- **Preserve All Existing Features**: Zero changes to any existing chapters, counting logic, notifications, timelines, or Supabase tracking.
- **100% Untouched Story Text**: Every single word, heading, date, *Now playing* cue, blockquote message, and punctuation mark from `/public/assets/aistudio/more_than_salaam_ee03b9e7.md` (*More Than Salaam: A love story for Shajer*) is preserved verbatim without editing or omitting a single line.
- **Unlock the Floating Gift Button (`SceneHub.tsx`)**:
  - Transform the floating Gift button on the main 4-button Chapter Hub page (`activeCategory === null`) from "Locked" to **Unlocked ("Gift Unlocked • Open Book 📖")** with a warm golden-rose glow and sparkle animation.
  - Clicking the floating gift button opens the dedicated **"More Than Salaam" Book Reader** (`scene === 'book_reader'`).

## 2. Book Structure & Pagination (29 Pages, Verbatim Content)
The complete manuscript is organized into **29 tactile book pages** so each page feels like a real chapter/episode in a novel:
1. **Cover & Dedication**: *More Than Salaam — A love story for Shajer* (`Fifty days before forever · 11 November 2026`)
2. **Before the First Page**: Author's note & reading invitation
3. **Prologue · Two Versions**: The two perspectives & the first *Salaam*
4. **Part One · Salaam — Episode 1**: *The Afternoon of the Invitation*
5. **Episode 2**: *The Decision Before the Knowing*
6. **Episode 3**: *The First Word*
7. **Episode 4**: *Did You Eat?*
8. **Episode 5**: *The Promise*
9. **Episode 6**: *Munnar, Mehndi, and a Voice*
10. **Episode 7**: *Without Any Expectation*
11. **Episode 8**: *Three Rings for Fajr*
12. **Episode 9**: *The Call He Didn't Decline*
13. **Part Two · The Distance Between — Episode 10**: *190 Kilometres*
14. **Episode 11**: *Before We Sleep*
15. **Episode 12**: *Could Be Us*
16. **Episode 13**: *The Storm and the Seal*
17. **Part Three · Beyond Salaam — Episode 14**: *Fifteen More Minutes*
18. **Episode 15**: *Fourteen Seconds*
19. **Episode 16**: *Wake Up, Jaana*
20. **Episode 17**: *The Boy Who Could Not Confess*
21. **Episode 18**: *Sixty-Six Minutes*
22. **Part Four · The Fifty Days — Episode 19**: *Day Fifty*
23. **Interlude**: *Two Screens, One Thread*
24. **Episode 20**: *The Umbrella Episode*
25. **Episode 21**: *Before We Sleep, Again*
26. **Episode 22**: *The Last Week*
27. **Episode 23**: *Qubool Hai*
28. **Episode 24**: *Midnight*
29. **Epilogue · Still Writing & A Letter to Shajer**: *Friday, 1 January 2027* + *A Letter to Shajer (11 November 2026)*

## 3. Custom Romantic Watercolor & K-Drama Storybook Illustrations
We will generate bespoke illustrations using `generate_image` in a **romantic watercolor and soft K-drama storybook art style** and embed them at key moments in the book:
1. **Cover Illustration**: Two hands separated by gentle rain and warm golden light with a delicate red thread of fate (*Naseeb*) and soft cherry/rose blossoms.
2. **Part One (Salaam & Munnar/Fajr)**: Misty green tea hills of Munnar at dawn with a glowing phone screen receiving a morning blessing.
3. **Part Two (190 Kilometres)**: A quiet midnight highway drive between Ambur and Chennai under a starry rose-indigo sky.
4. **Part Four (The Umbrella Scene)**: A K-drama inspired veranda rain scene where he tilts a black umbrella toward her in light green, getting his own shoulder wet.
5. **Qubool Hai & Epilogue**: The bride in two shades of green (deep dark green and pale light green dupatta) with hennaed hands and a subtle red thread under the groom's sherwani cuff.

## 4. Book Reader App Features (`src/components/scenes/SceneBookReader.tsx`)
- **Realistic Page-Turn Animation**:
  - 3D perspective page-flip animation (`rotateY`, spine shadow, and directional slide) when turning forward/backward, plus swipe left/right support on mobile and keyboard arrow navigation.
- **Dual Reading Theme Toggle**:
  - **Warm Cream Book Paper Mode**: Tactile ivory/parchment pages (`#FDF8F2`), warm espresso serif typography, subtle paper grain, and gold-leaf accents.
  - **Rose-Wine Night Mode**: Deep romantic plum-wine glassmorphic pages matching the *For Shajer* nighttime atmosphere.
  - Adjustable font size (`A-` / `A+`) and automatic bookmark persistence in `localStorage` so Shajer can always resume right where she left off.
- **Table of Contents (TOC) Drawer**:
  - Grouped by *Preliminaries*, *Part One · Salaam*, *Part Two · The Distance Between*, *Part Three · Beyond Salaam*, *Part Four · The Fifty Days*, and *Epilogue & Letter*, showing episode titles, dates, and current reading progress. Clicking any entry flips directly to that page.
- **Page Summary & "Now Playing" Companion Card**:
  - A collapsible **Page Summary** sheet/popover on every page offering a gentle 2-sentence synopsis, key date/time badge, and the episode's *"Now playing"* soundtrack note.
- **Quick "Jump To Page" Scrubber & Selector**:
  - Interactive page slider + direct page number picker (`Page X of 29`) at the bottom bar for instant navigation.
