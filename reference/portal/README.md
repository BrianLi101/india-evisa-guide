# Portal metadata capture

Observed 18 October 2026 using the user-authorized synthetic U.S. ordinary-passport, 30-day tourist route. No applicant values or session/application identifiers are saved here.

- `src/content/livePortal.ts`: ordered screens, nested section headers, every observed control, visible required markers, HTML limits, conditional branches, exact help and tested validation outcomes.
- `src/content/livePortalChoices.json`: non-placeholder country, gender, religion, education, nationality-acquisition, marital-status, occupation, past-visa, state, DELHI-district and SAARC options, preserving labels and option values.
- `district-labels-2026-10-18.txt`: the 821 initial District options in DOM order (duplicates retained). Values equaled labels. Placeholder was “Select District.” These are not a state-to-district mapping.
- `src/content/visaPurposes.ts`: 62 distinct unfiltered public-registration purpose labels (67 original non-placeholder entries). The U.S. session displayed 55 choices; the exact filter remains unrecorded.
- `src/content/portalObservations.ts`: shared UI observations, including earlier registration/gate data. The HTML metadata remains available even for rows without expandable help.
- `npm run build` produces `public/reference/portal-capture.json` with the complete capture, choice catalogs and scope. No new server/API is involved.

Transcription checksums (32-bit FNV-1a, computed from captured browser data): country option JSON `74e760de`; district labels joined by LF with no trailing LF `46b37b4e`; exit labels joined by LF `073aa878`. Exit labels match the existing arrival registry exactly. Tests compare the saved data with these checksums.

Required markers, HTML required attributes and successful/failed save probes are distinct evidence. Unknown restrictions are not inferred. The photo page was reached after the user authorized the declaration and Continue; no file was uploaded. Later crop, document, review and payment screens were not reached in this session. See `reference/SOURCES.md` for source links and `TODO.md` for remaining gaps.
