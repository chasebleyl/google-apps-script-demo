
n checkFiles() {
  // Select current spreadsheet that we will work with
  var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get all the active data from the sheet
  var data = currentSpreadsheet.getSheetValues(1,1,-1,-1);

  // Select ART/PNG folder for lesson we are currently in
  var lessonFolder = DriveApp.getFolderById(id);
  var folders = lessonFolder.getFoldersByName("ART");
  var artFolder = folders.next();
  folders = artFolder.getFoldersByName("PNG");
  var pngFolder = folders.next();
  
  // Iterate over the data we received
  data.forEach(function (row) {
    // Convert numbers to strings for comparison
    row[0] = row[0].toString();
    
    // Check if there is an image present for this row
    var imagePresent = false;
    if (row[2] == "yes") {
      imagePresent = true;
    }
    
    // If image is present, check that image with matching ID is in folder
    if (imagePresent) {
      var imageFileExists = false;
      var files = pngFolder.getFilesByName(row[0]+".png");
      while (files.hasNext()) {
        var file = files.next();
        if(file.getName() == (row[0]+".png")) {
          Logger.log(file.getName());
          imageFileExists = true;
        }
      }
      // If image is not present, send an email to project owner
      if (!imageFileExists) {
        MailApp.sendEmail(email, "You are missing a file!", "Image file " + row[0] +".png is missing from the PNG folder. Please add it and notify your project manager.");
      }
    }
  });
  
  // Alert user that we have finished checking files
  var ui = SpreadsheetApp.getUi();
  ui.alert("We finished processing rows.");
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var mainMenu = ui.createMenu("File Checker");
  mainMenu.addItem("Check Files", "checkFiles");
  mainMenu.addToUi();
}


