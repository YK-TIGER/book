const SHEET_NAME = "예약자명단";

/**
 * 예약 목록 조회
 */
function doGet() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const values = sheet
    .getRange(2, 1, lastRow - 1, 4)
    .getValues();

  return ContentService
    .createTextOutput(JSON.stringify(values))
    .setMimeType(ContentService.MimeType.JSON);

}


/**
 * 예약 저장
 */
function doPost(e) {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  const data = JSON.parse(e.postData.contents);

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {

    // 같은 시간 예약
    if (rows[i][0] == data.time) {

      return ContentService
        .createTextOutput("duplicate_time");

    }

    // 같은 학번 예약
    if (rows[i][2] == data.student) {

      return ContentService
        .createTextOutput("duplicate_student");

    }

  }

  sheet.appendRow([
    data.time,
    data.name,
    data.student,
    data.people
  ]);

  return ContentService
    .createTextOutput("success");

}
