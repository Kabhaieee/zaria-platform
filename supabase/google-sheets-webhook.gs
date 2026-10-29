function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date & Time', 'Slug', 'Guest Name', 'Message', 'ID', 'ISO Timestamp']);
    }

    sheet.appendRow([
      payload.readable_time || new Date().toLocaleString('ar-JO'),
      payload.slug || 'omar-ayat',
      payload.guest_name || '',
      payload.message || '',
      payload.id || '',
      payload.created_at || new Date().toISOString()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var slugFilter = (e && e.parameter && e.parameter.slug) ? String(e.parameter.slug).trim() : '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, wishes: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    var wishes = [];

    for (var i = values.length - 1; i >= 0; i--) {
      var row = values[i];
      var rowSlug = String(row[1] || '').trim();
      var guestName = String(row[2] || '').trim();
      var message = String(row[3] || '').trim();
      var id = String(row[4] || ('sheet-' + i)).trim();
      var createdAt = String(row[5] || row[0] || '').trim();

      if (!guestName || !message) continue;
      if (slugFilter && rowSlug !== slugFilter) continue;

      wishes.push({
        id: id,
        slug: rowSlug || slugFilter || 'omar-ayat',
        guest_name: guestName,
        message: message,
        created_at: createdAt
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, wishes: wishes }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, wishes: [], error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
