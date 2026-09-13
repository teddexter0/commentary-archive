# Commentary Archive

A calm, private-first reading memory: drop links or screenshots, let the app extract the useful words, and come back to what mattered.

## What it does

- Accepts up to 30 article links in one capture
- Reads articles, builds concise relevance/resonance notes, and auto-sorts them
- Uses Chrome's on-device Summarizer when available, with a deterministic fallback elsewhere
- Extracts text from multiple screenshots with bundled on-device OCR
- Includes the previously discussed Tech and Life reading library with highlights
- Organises material into Life, God, Tech, History, and Science, with nested topics
- Searches, filters, resurfaces, exports, and restores the full archive
- Works locally and offline; optional Supabase sign-in syncs private data across devices

## Run locally

Serve the `dist` folder with any static web server, then open it in a modern browser.

## Optional cross-device sync

1. Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL editor.
2. In Supabase, enable the email authentication method you want to use.
3. Put the project URL and **publishable/anon key** in `dist/config.js`.

Never put the database password or Supabase service-role key in this browser app. Row-level security keeps each signed-in person's records and captures private.

Without Supabase configuration, Commentary Archive remains fully usable and stores data in IndexedDB on the current device. Download JSON backups periodically.

MIT licensed.
