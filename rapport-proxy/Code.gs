/**
 * Rapport by zip 2 - lookup proxy
 *
 * Purpose: when a station's network blocks one of the public lookup services
 * the Objection Playbook's "Rapport by zip" tool calls directly (zippopotam.us,
 * open-meteo.com, nominatim.openstreetmap.org, en.wikipedia.org - usually seen
 * as an HTTP 403 in the tool), this script re-fetches that exact same URL from
 * Google's servers instead of the rep's browser, and hands the response back.
 * Many networks that block those smaller/less common domains still allow
 * Google's own domains through, since Workspace already needs them.
 *
 * This proxy is a dumb passthrough: it does not add, store, or log anything
 * about the customer. The only input is a public lookup URL the Playbook
 * itself builds (a zip code, a lat/lon pair, a city name) - never a name,
 * address, or anything else about the person on the call. It only forwards
 * requests to the four hosts below; anything else is refused.
 *
 * DEPLOY:
 * 1. Go to script.google.com -> New project.
 * 2. Delete the placeholder code and paste this whole file in.
 * 3. Click Deploy -> New deployment.
 * 4. Type: "Web app".
 * 5. Execute as: Me. Who has access: Anyone.
 * 6. Click Deploy, authorize it with your Google account when prompted.
 * 7. Copy the "Web app URL" it gives you (ends in /exec).
 * 8. In the Objection Playbook, open "Rapport by zip 2", paste that URL into
 *    "Proxy URL", click Save, then click "Test connection".
 *
 * This is a one-time setup per station/network, not per rep. If the proxy
 * URL ever needs to change (e.g. you redeploy it), update it once and every
 * rep using that station picks it up automatically next time they load the
 * page, since it's read from the same stored setting.
 */

var ALLOWED_HOSTS = [
  "api.zippopotam.us",
  "api.open-meteo.com",
  "nominatim.openstreetmap.org",
  "en.wikipedia.org"
];

function doGet(e) {
  var target = e.parameter.url;

  if (!target || !isAllowed_(target)) {
    return jsonOut_({
      __proxyError: true,
      upstreamStatus: 403,
      message: "Missing or disallowed url parameter"
    });
  }

  try {
    var res = UrlFetchApp.fetch(target, {
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "ObjectionPlaybookRapportProxy/1.0 (internal sales tool, no customer data forwarded)"
      }
    });
    var code = res.getResponseCode();
    if (code < 200 || code >= 300) {
      return jsonOut_({
        __proxyError: true,
        upstreamStatus: code,
        message: "Upstream returned HTTP " + code
      });
    }
    // Pass the upstream JSON straight through, unmodified.
    return ContentService.createTextOutput(res.getContentText())
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return jsonOut_({
      __proxyError: true,
      upstreamStatus: 0,
      message: String(err)
    });
  }
}

function isAllowed_(url) {
  for (var i = 0; i < ALLOWED_HOSTS.length; i++) {
    if (url.indexOf("https://" + ALLOWED_HOSTS[i]) === 0) return true;
  }
  return false;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
