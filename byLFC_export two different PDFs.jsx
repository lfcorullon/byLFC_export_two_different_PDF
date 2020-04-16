//DESCRIPTION: Export two different PDFs
//=============================================================
//  Script by Luis Felipe Corullón
//  Contato: lf@corullon.com.br
//  Site: http://scripts.corullon.com.br
//=============================================================

//IF NO DOCUMENTS ARE OPEN, ALERT AND EXIT SCRIPT EXECUTION
if (app.documents.length == 0 || app.documents[0].visible == false) {
    alert("You must run this script with a document open." , "No document open" , true);
    exit();
    }
else {
    //IF ANY DOCUMENTS ARE OPEN, SET THE CURRENT ONE AS MYFILE VARIABLE
    var myFile = app.activeDocument;
    //CALLING THE FUNCTION TO CHECK IF THE DOC IS ALREADY SAVED
    checkSave(myFile);

    //STORE EVERY PDF PRESET NAME IN AN ARRAY
    var myPresets = app.pdfExportPresets.everyItem().name;
    //ADD AN EMPTY ITEM IN THE BEGINNING OF THE ARRAY
    myPresets.unshift("");
     
     //CREATE A NEW DIALOG WINDOW
    var myWin = new Window('dialog', 'PDF Export Presets');
    //ADD A NEW GROUP TO THE NEW WINDOW
    var g = myWin.add("group");
    //SET THE G GROUP ORIENTATION AS ROW (HORIZONTAL)
    g.orientation = "row";
    
    //ADD A NEW GROUP TO THE G GROUP (ORIENTATION COLUMN - VERTICAL -, ALIGNMENT LEFT AND CHILDREN ALIGNED TO THE RIGHT, SPACING 16)
    var g1 = g.add("group");
    g1.orientation = "column";
    g1.alignment = "left";
    g1.alignChildren = "right";
    g1.spacing = 16;
    //ADD SOME STATIC TEXTS TO THE GROUP G1
    g1.add('statictext' , undefined , "Select the PDF preset #1");
    g1.add('statictext' , undefined , "Select the PDF preset #2");
    g1.add('statictext' , undefined , "Page range");
    
    //ADD A NEW GROUP TO THE G GROUP (ORIENTATION COLUMN - VERTICAL -, ALIGNMENT RIGHT AND CHILDREN ALIGNED TO THE LEFT)
    var g2 = g.add("group");
    g2.orientation = "column";
    g2.alignment = "right";
    g2.alignChildren = "left";
    
    //STORE SOME VARIABLES ADDING THEM TO THE G2 GROUP
    //DROPDOWN LIST WITH ALL PDF PRESETS
    var myPDFExport1 = g2.add('dropdownlist' , [0,0,200,20] , myPresets);
    //SET THE FIRST ITEM AS SELECTED
    myPDFExport1.selection = 0;
    //DROPDOWN LIST WITH ALL PDF PRESETS
    var myPDFExport2 = g2.add('dropdownlist' , [0,0,200,20] , myPresets);
    //SET THE FIRST ITEM AS SELECTED
    myPDFExport2.selection = 0;
    //EDIT TEXT FIELD TO ENTER THE PAGE RANGE
    var myPageRange = g2.add('edittext' , [0,0,200,20] , "");
    
    //ADD A NEW GROUP TO THE DIALOG WINDOW (GROUP ALIGNMENT TO THE RIGHT)
    var g4 = myWin.add("group");
    g4.alignment = "right";
    //ADD OK BUTTON
    g4.add('button', undefined, "OK", {name: "OK"});
    //ADD CANCEL BUTTON
    g4.add('button', undefined, "Cancel", {name: "Cancel"});
    
    //WHEN THE EDIT TEXT FIELD IS BEING EDITED, SLICE WHEN NON-NUMBERS ARE ENTERED
    myPageRange.onChanging = function() {
        if (myPageRange.text.match(/[a-zA-Z.;:\/\\\[{\]}\(\)]/)) {
            myPageRange.text = myPageRange.text.slice(0,-1);
            }
        }
    //WHEN THE FOCUS CHANGE FROM EDIT TEXT FIELD, CHECK IF NON-NUMBERS HAS BEEN ENTERED
    myPageRange.onChange = function() {
        if (myPageRange.text.match(/[a-zA-Z.;:\/\\\[{\]}\(\)]/)) {
            alert("You can only enter numbers or \",\" or \"-\" to set page ranges");
            myPageRange.text = "";
            }
        }
    
    //SHOW THE DIALOG WINDOW
    if(myWin.show() != 2) {
        //IF PRESETS 1 OR 2 ARE "BLANK", ALERT AND EXIT
        if (myPDFExport1.selection.index == 0 || myPDFExport2.selection.index == 0) {
            alert("You must select both predefinitions.","Script by LFCorullón");
            exit();
            }
        //ELSE IF BOTH PRESETS CHOOSE
        else if (myPDFExport1.selection.index != 0 && myPDFExport2.selection.index != 0) {
            //SET THE VARIABLE MYFILENAME WITH THE NAME OF CURRENT DOCUMENT UP TO THE LAST DOT
            var myFileName = myFile.name.substr(0,myFile.name.lastIndexOf("."));
            //ASK THE USER TO SELECT THE FOLDER TO SAVE THE PDFS IN
            var myFolder = Folder("").selectDlg("Select the folder where you want to save your PDF");
            
            //STORE THE NAME OF EACH PDF PRESET AND THE PAGE RANGE AS VARIABLES
            var myPreset_1 = String(myPDFExport1.selection.text);
            var myPreset_2 = String(myPDFExport2.selection.text);
            var myRange = myPageRange.text;
            
//~             alert("Preset#1: " + myPreset_1 + "\rPreset#2: " + myPreset_2 + "\rmyPageRange: " + myRange); 
//~             alert(typeof myRange);
//~             exit();
            
            //RUN THE FUNCTION TWICE, EACH TIME WITH ONE PRESET
            savePDF(myPreset_1 , myRange);
            savePDF(myPreset_2 , myRange);
            
            //ALERT WHEN SUCCESS
            alert("Success.\rThe PDFs are saved in the selected folder." , "Script by LFCorullón");
            }
        }
    }

//======================================================================================================================
//====================================================================================================================== FUNCTIONS
//======================================================================================================================
function savePDF(myPreset , myPageRange) {
    //IF THE PAGE RANGE FIELD IS BLANK, SET THE PAGE RANGE TO ALL
    if (myPageRange == "") {
        myPageRange = PageRange.ALL_PAGES
        }
    //ELSE, SET THE PAGE RANGE AS THE ENTERED VALUE
    else {
        myPageRange = myPageRange;
        }
    //SET THE PAGERANGE
    app.pdfExportPreferences.pageRange = myPageRange;
    //SET THE NAME TO THE NEW PDF FILE
    name = myFolder+"/"+myFileName+"_"+myPreset.replace(/\/|:/g,"_")+".pdf";
    //EXPORT THE CURRENT DOCUMENT TO PDF BASED ON SELECTED PRESETS
    app.activeDocument.exportFile(ExportFormat.PDF_TYPE, new File(name), false, myPreset);
    }
//======================================================================================================================
//======================================================================================================================
//======================================================================================================================
function checkSave(myDoc) {
    //IF THE DOCUMENT IS NOT SAVED
    if(myDoc.saved == false){
        //ALERT
        alert("The current file is not saved.","Script by LFCorullón");
        //THEN ASK THE USER TO SAVE THE DOCUMENT
        var mySaveDialog = File.saveDialog("Choose a name and a folder to save the file","InDesign document:*.indd");
        //IF THE USER CANCEL THE SAVE DIALOG, EXIT
        if (mySaveDialog == null) {
            exit();
            }
        //ELSE, SAVE THE DOCUMENT
        else {
            myDoc.save(mySaveDialog);
            alert("The file was saved.","Script by LFCorullón");
            }
        }
    //IF THE DOCUMENT IS SAVED BUT MODIFIED, JUST SAVE IT
    else if (myDoc.modified == true) {
        myDoc.save();
        }
    }
