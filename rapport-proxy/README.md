# Rapport by zip 2 — lookup proxy

"Rapport by zip" calls four public services directly from the browser:
`api.zippopotam.us`, `api.open-meteo.com`, `nominatim.openstreetmap.org`,
and `en.wikipedia.org`. If one of those is blocked at a particular station's
network, the tool shows an HTTP 403 (or "couldn't reach the lookup service")
there, while it works fine elsewhere — that's a network policy blocking a
specific domain, not a bug in the tool, and it can vary station to station.

**"Rapport by zip 2"** (same tab bar, right next to the original) is the
same tool, but it can route every one of those lookups through this proxy
instead of calling the blocked domain directly. The proxy runs on Google's
own servers and is reached at a `script.google.com` address — a domain most
networks that already use Google Workspace don't block.

## Why not Google Sites?

Google Sites can't run server-side code, so it can't actually re-fetch a
blocked API on a rep's behalf — it would just be another page making the
same blocked request from the same blocked network. The Google product
that *can* do this is **Apps Script**, deployed as a small Web App. That's
what `Code.gs` in this folder is. (It lives at `script.google.com`, a
sibling of Sites under the same Google account — not Sites itself.)

## What it does and does not do

- It is a dumb passthrough: given a URL to one of the four allowed hosts
  above, it fetches that exact URL from Google's servers and returns the
  response, unchanged.
- It refuses to fetch any host outside that allow-list.
- It never receives, stores, or logs anything about the customer — the only
  thing sent to it is a zip code, a city name, or a latitude/longitude pair
  (whatever the Playbook itself would have sent directly), never a name or
  account detail.
- It costs nothing and needs no billing-enabled Google Cloud project — Apps
  Script Web Apps run on the free tier for this kind of light use.

## Deploy it (one time, per station or network — not per rep)

1. Go to **script.google.com** → **New project**.
2. Delete the placeholder code in the editor and paste in all of `Code.gs`
   from this folder.
3. **Deploy → New deployment**.
4. Type: **Web app**.
5. **Execute as:** Me. **Who has access:** Anyone.
6. Click **Deploy**, and authorize it with your Google account when
   prompted (it's your own script, asking to fetch public URLs).
7. Copy the **Web app URL** it gives you — it ends in `/exec`.
8. In the Objection Playbook, open the **Rapport by zip 2** tab, paste that
   URL into **Proxy URL**, click **Save**, then click **Test connection** to
   confirm it actually works from that station.

Any rep at that station then benefits automatically — the proxy URL is
stored in the browser, so it only needs to be set once per device, not once
per person per shift.

## If it still fails

- **Test connection** reports the exact error. If it says the proxy itself
  couldn't be reached, `script.google.com` may also be blocked at that
  station — at that point this is a question for IT about what the network
  actually allows, not something the tool can route around further.
- If Test connection succeeds but a specific zip still errors, that zip
  might be invalid, or one specific upstream service (not all four) might
  be down — the tool reports which piece failed under the result.
