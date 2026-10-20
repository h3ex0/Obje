/**
 * Rapport by zip 2 - lookup service
 *
 * A small Google Apps Script Web App that fetches the same four public
 * lookup sources "Rapport by zip" already uses directly - zippopotam.us,
 * open-meteo.com, nominatim.openstreetmap.org, en.wikipedia.org - and hands
 * the response back as JSON. It runs on Google's platform, which IT and
 * leadership have approved for this use.
 *
 * It does not add, store, or log anything about the customer. The only
 * input is a public lookup URL the Playbook itself builds from a zip code,
 * a city name, or a latitude/longitude pair - never a name, address, or
 * anything else about the person on the call. It only fetches the four
 * hosts listed below; any other address is refused.
 *
 * DEPLOY (one time, per station - ask your lead or IT):
 * 1. Go to script.google.com -> New project.
 * 2. Delete the placeholder code and paste this whole file in.
 * 3. Click Deploy -> New deployment.
 * 4. Type: "Web app".
 * 5. Execute as: Me. Who has access: Anyone.
 * 6. Click Deploy, and authorize it with your Google account when prompted.
 * 7. Copy the "Web app URL" it gives you (ends in /exec).
 * 8. In the Objection Playbook, open "Rapport by zip 2" and paste that URL
 *    into the lookup service address field, click Save, then click
 *    "Check connection".
 *
 * Every rep at that station picks this up automatically afterward, since
 * the address is saved in the browser - this only needs doing once per
 * station, not once per rep or per shift.
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
      __lookupError: true,
      upstreamStatus: 403,
      message: "Missing or disallowed url parameter"
    });
  }

  try {
    var res = UrlFetchApp.fetch(target, {
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "ObjectionPlaybookLookupService/1.0 (internal sales tool, no customer data sent)"
      }
    });
    var code = res.getResponseCode();
    if (code < 200 || code >= 300) {
      return jsonOut_({
        __lookupError: true,
        upstreamStatus: code,
        message: "Upstream returned HTTP " + code
      });
    }
    // Pass the upstream JSON straight through, unmodified.
    return ContentService.createTextOutput(res.getContentText())
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return jsonOut_({
      __lookupError: true,
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
