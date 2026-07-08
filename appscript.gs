const SHEET_NAME = "Reservations";

function doGet() {

  const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

  const values = sheet
      .getRange(2,1,Math.max(sheet.getLastRow()-1,0),3)
      .getValues();

  return ContentService
      .createTextOutput(JSON.stringify(values))
      .setMimeType(ContentService.MimeType.JSON);

}

function doPost(e){

  const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

  const data = JSON.parse(e.postData.contents);

  const rows = sheet.getDataRange().getValues();

  for(let i=1;i<rows.length;i++){

    if(rows[i][0] == data.time){

      return ContentService
          .createTextOutput("duplicate");

    }

  }

  sheet.appendRow([
    data.time,
    data.name,
    data.student
  ]);

  return ContentService
      .createTextOutput("success");

}
