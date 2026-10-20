# Rapport by zip 2 — lookup service

"Rapport by zip" looks up four public sources directly from the browser:
`api.zippopotam.us`, `api.open-meteo.com`, `nominatim.openstreetmap.org`,
and `en.wikipedia.org`.

**"Rapport by zip 2"** (same tab bar, right next to the original) is the
same tool — same data, same ready-to-say lines — with one addition: it can
reach that same lookup data through a small Google Apps Script Web App
instead of calling each site directly. This runs on Google's platform
(`script.google.com`), which IT and leadership have approved for use here,
alongside `sites.google.com` and GitHub.

## Why Apps Script, not Google Sites directly

Google Sites hosts pages; it doesn't run code that can fetch data on a
rep's behalf. The Google product built for that is **Apps Script**,
deployed as a small Web App — that's what `Code.gs` in this folder is. It
lives at `script.google.com`, a sibling product to Sites under the same
Google account, not Sites itself. If your network's current allow-list
only names `sites.google.com` specifically, check with IT that
`script.google.com` is reachable too before relying on this.

## What it does and does not do

- It fetches exactly the URL it's given, limited to the four hosts listed
  above, and returns the response unchanged.
- It refuses any other address.
- It never receives, stores, or logs anything about the customer — the
  only thing sent to it is a zip code, a city name, or a latitude/longitude
  pair, the same as what "Rapport by zip" already sends directly. Never a
  name or account detail.
- It costs nothing and needs no billing-enabled Google Cloud project —
  Apps Script Web Apps run on the free tier for this kind of light use.

## Deploy it (one time, per station — ask your lead or IT)

1. Go to **script.google.com** → **New project**.
2. Delete the placeholder code in the editor and paste in all of `Code.gs`
   from this folder.
3. **Deploy → New deployment**.
4. Type: **Web app**.
5. **Execute as:** Me. **Who has access:** Anyone.
6. Click **Deploy**, and authorize it with your Google account when
   prompted (it's your own script, asking to fetch public URLs).
7. Copy the **Web app URL** it gives you — it ends in `/exec`.
8. In the Objection Playbook, open **Rapport by zip 2**, paste that URL
   into the lookup service address field, click **Save**, then click
   **Check connection** to confirm it works from that station.

Any rep at that station benefits automatically after that — the address is
stored in the browser, so it only needs to be set once per device.

## If it still doesn't connect

**Check connection** reports the exact error. If the service itself can't
be reached, that's a question for IT about what the network currently
allows — this tool can't resolve that further on its own. If connection
succeeds but a specific zip still errors, that zip might be invalid, or one
of the four sources might be temporarily down — the tool names which part
failed under the result.
