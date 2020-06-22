/*
  Smart_Pack_todo.jsx for Adobe Illustrator
  Description: Creates and display artwork from imported variables/variable data
  and creates barcodes from a string. It also displays the date, page numbers
  and name of your file.You need to install ocrb10 font in your computer.
  Date: May, 2019
  Author: Katja Bjerrum, email: katja@productivista.com , www.productivista.com
  ============================================================================
  NOTICE:
  Tested with Adobe Illustrator CC 2020 (Win), 2019 (Mac).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale.
  ============================================================================
  Released under the MIT license.
  http://opensource.org/licenses/mit-license.php
  ============================================================================
  Thanks to: Dmitry Yagupov for providing some parts of barcode script
  Esben Bjerrum for help with a lot of scripting
  Vasily Hall for support.
  ============================================================================
  Please contact me if you need some help or customization of this script
  at katja@productivista.com
*/

//@target illustrator


var docRef = app.activeDocument;
var sel = docRef.selection;

app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;


    if (docRef.name.match(/Untitled-\d+/gi)){
            alert ("Please save file");
        }

    //docRef.placedItems[0].selected == false;

    else if (sel <= 0){
        //docRef.placedItems[0].selected == false;
        alert ("Please make a selection");
    
    }
    
    else {
        var oriGroup = SelectionToNewGroup();
        DuplicateandMove(oriGroup, docRef.dataSets.length);
        EANdigits();
        
        layer = docRef.layers.add();//add new layer
        layer.name = "DieCut";
        DieCuttoNewLayer();//move diecut to new layer
        fileInfo();
        /*for (  i = 0; i < docRef.placedItems.length; i+1 ) {
        app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
        docRef.placedItems[i].embed();
        }*/

    }



    function DieCuttoNewLayer()
    {
            var paths = docRef.pathItems;
            var len = paths.length; 
        
        for(var x=0; x < len; x++){
            var ipath = paths[x];
            if(ipath.strokeColor.typename == "SpotColor" && ipath.strokeColor.spot.name == "Cutter" && !ipath.filled)
            {
                ipath.selected = true;
                
    // MOVE THE STROKES TO NEW CAD LAYERS
    
                ipath.moveToBeginning(app.activeDocument.layers["DieCut"]);
                docRef.selection = null;
            }
        }
    }      






function getDate(){
    var today = new Date();
    var date = "Date created: " + today.getDate() + ' / ' + (today.getMonth()+1)+ ' / ' +today.getFullYear();
    return date;

}




function fileInfo(){
    var pagesnr = docRef.artboards.length; // number of artboards
     

    for (i = 0; i < pagesnr; i++) // loop thru all artboards
    
        {
            //Get sizes of the artboard
            //var aIndex = docRef.artboards.getActiveArtboardIndex();
            //var artboard = docRef.artboards[0];
            var artboard = docRef.artboards[i];
            var aRect = artboard.artboardRect;

            //Save them into separate variables
            var aLeft = aRect[0];
            var aTop = aRect[1];
            var aRight = aRect[2];
            var aBottom = aRect[3];
            var aWidth = aLeft + aRight;

            
               var fileName = app.activeDocument.textFrames.add();
                fileName.top = aTop - 35; 
                fileName.left = aLeft + 50;
                fileName.contents = app.activeDocument.name;
            
                var date = app.activeDocument.textFrames.add(); 
                date.contents = getDate(); 
                date.top = aTop - 25; 
                date.left = aLeft + 50;
                
                /*if (date.contents =! today){
                    var dateMod = "Date modified: " + today.getDate() + ' / ' + (today.getMonth()+1)+ ' / ' +today.getFullYear();
                    dateMod.contents = getDate(); 
                    dateMod.top = aTop - 50; 
                    dateMod.left = aLeft + 50;
                }*/
               

            //1 of x pages text
           var pageText = (i + 1) + ' of ' + pagesnr + ' pages ';
                        
            var itext = app.activeDocument.textFrames.add();
            itext.top = aTop - 30; 
            itext.left = aRight - 100;
            itext.contents = pageText; //"page 1 of 1";				
                		
                
        }
    }
    
    
//Create new artboard
function createNewAB(){
            
    var thisBoardIndex = docRef.artboards.getActiveArtboardIndex();
    var thisBoard = docRef.artboards[thisBoardIndex];
    var thisRect = thisBoard.artboardRect;
    var lastBoard = docRef.artboards[docRef.artboards.length - 1];
    var lastRect = lastBoard.artboardRect;
        
    
    
    var newBoard = docRef.artboards.add(thisRect);
    var offsetH = 20;
    newBoard.artboardRect = [
        lastRect[2] + offsetH,
        lastRect[1],
        lastRect[2] + offsetH + (thisRect[2] - thisRect[0]),
        lastRect[3]
    ];
    
};

function SelectionToNewGroup(){
    //Create group from selected items
    if (sel.length > 0){ 
         var myGroup = app.activeDocument.groupItems.add();
         }
     for ( i = 0; i < sel.length; i++ ) {
             
             sel[i].moveToEnd( myGroup );
         }   
     myGroup.selected = false;
     return myGroup;
}   

function DuplicateandMove(myGroup, j){

    //coordinates for myGroup
    var width = myGroup.width;
    var left = myGroup.left;
    var top = myGroup.top;
    var height = myGroup.height;
    var right = left + width;
    var bottom = -top + height;
    
    
   
     //Get sizes of the artboard
     var aIndex = docRef.artboards.getActiveArtboardIndex();
     var artboard = docRef.artboards[aIndex];
     var aRect = artboard.artboardRect;
     
     //Save them into separate variables
     var aLeft = aRect[0];
     var aTop = aRect[1];
     var aRight = aRect[2];
     var aBottom = aRect[3];
     var aWidth = aLeft + aRight;
     
    
    //gap
    var newX = width*0.10; 
    var newY = 20;
   
    //How much to move the item
    var x_Offset = width + newX;   
    var y_Offset = - height - newY;
    
    //counters
    var cc = 0; //column counter;
    var rc =  0; //row counter
   //myGroup.position = [20 * j, 20];
   //myGroup.remove()
    
    
    if (right >= (aRect[2] - 10) || bottom >= (-aBottom - 10)){

        alert ('Adjust artboard to your artwork');
       return;
    } 

   for(i = 0; i < j; i++){
   
       var ds1 = docRef.dataSets[i];
       ds1.display();  
       var newGroup = myGroup.duplicate();
        
   
           //Calculate right edge of the proposed new item
           var newRight = cc * x_Offset + right;
               
       
               if (newRight >= aRect[2] - 20)  {
                   //Ooops, the object will not fit.
                   //Go back to column 1
                   cc = 0;
                   //Go to next 
                   rc = rc + 1;    
                   }
       
               //Calculate bottom of the proposed new item
               var newHeight = rc * y_Offset + top - height;
                   
               if (newHeight < aBottom + 10){
                   //Over bottom, make a new artboard
                   createNewAB();
                       
                       cc = 0;
                       rc = 0;
                   }
               newGroup.position = [left + cc * x_Offset , top + rc * y_Offset]; //move item
               newGroup.selected = false;
       
               // Go one position to the right
               var cc = cc + 1;
   
           }
       myGroup.remove();  
   
   }

   var doc = app.activeDocument;
   app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM; 
   
   
   function getCenter(p){
       return [p.left + p.width / 2,
            p.top - p.height / 2];
   }
   
   function EANdigits(){
       //Select 13 digits and replace it with a barcode 
       for ( var i = 0; i < docRef.textFrames.length; i++ ) { 
           
            if (docRef.textFrames[i].contents.match(/^\d{13}$/gi)){ 
               
               var myCode = docRef.textFrames[i].contents;
           if (CheckDigit(myCode) == false){
               alert("This barcode " + myCode + " is wrong.");
               //alert( CheckDigit(myCode));
               break 
           } 
          else{
                var textArtRange = docRef.textFrames[i];  
                textArtRange.selected = true; 
                justText(textArtRange);
                //define angle
                //var matrix = app.selection[0].matrix; //
                var matrix = textArtRange.matrix;
                var Angle = -180/Math.PI * Math.atan2(matrix.mValueC, matrix.mValueD)  
                var Width = textArtRange.textRange.size * 6.1;
                //var point = getCenter( textArtRange );
                var Height = Width / 2;
    
                
    
            
                //var newX = textArtRange.position[0];
                //var newY = - textArtRange.position[1] - Height / 1.41;
                var newX = textArtRange.anchor[0];
                var newY = -textArtRange.anchor[1]- Height;
                //Ref.pathItems.ellipse(roto_X, roto_Y, 1,1);
                
                var roto_X =  textArtRange.anchor[0];
                var roto_Y =  textArtRange.anchor[1];
                
                
               
                var EAN = textArtRange.contents;
                var barcode = CreateEAN(newX, newY, Width, Height, EAN);
                //docRef.pathItems.ellipse(roto_X, roto_Y, 1,1);
                //CreateBarcode(newX, newY, Width, Height, EAN);
                rotate_around_point (barcode, roto_Y, roto_X, Angle);
                //barcode.rotate(Angle, true,true,true,true,Transformation.BOTTOMLEFT);
                textArtRange.remove();
               } 
            }
        }
   }
   
   function CreateEAN(newX, newY, Width, Height, EAN){
   
       var delta= Width/20;
   
       var wRect = makeWhiteRect(-newY+delta, newX-delta, Width+3*delta,Height+2*delta);
       var bc1 = CreateBarcode(newX, newY, Width, Height, EAN);
       var groupEAN = docRef.groupItems.add();
   
       wRect.moveToBeginning(groupEAN);
       bc1.moveToBeginning(groupEAN);
       return groupEAN;
   }            
   
              
   function makeWhiteRect(rX, rY, rW, rH){
               
           var colorRef = new CMYKColor();
           colorRef .cyan = 0;
           colorRef .magenta = 0;
           colorRef .yellow = 0;
           colorRef .black = 0;
               
           var path_ref = docRef.pathItems.rectangle(rX, rY, rW, rH);
           path_ref.fillColor = colorRef ;
           path_ref.stroked = false;
           return path_ref;
           }        
       
       
   function CreateBarcode(newX, newY, Width, Height, EAN ){
   
       //var bcHeight = 15;//height of a barcode
       bcWidth = Width/(250*1.15654);
       bcHeight = Height/(3*1.07408);
   
       var fS = bcWidth * 25;//font size
       var ztY = bcHeight * 2.4;// Vertical placement of the barcode number
               
               
   
   var EANGroup = docRef.groupItems.add(); 
   
   var mm=2.834645669; //convert point to mm
   var blk = bcWidth; //whidts på barcode lines
   var blkD = blk*7;//gap between block D
   var blkE= blk*3;//gap between block E
   var blkC= blk*5;//gap between block C
   var blkH = bcHeight * 0.90; //heigth of barcode
   var blkHE = blkH + blkH * 0.1;//heigth of E-lines
   
   
   //var zX=0;
   //var zY=0;
   var tablEAN= new Array(10);
   
   //makeWhiteRect(rX,rY,rW,rH)
   
   tablEAN[0]="AAAAAA";
   tablEAN[1]="AABABB";
   tablEAN[2]="AABBAB";
   tablEAN[3]="AABBBA";
   tablEAN[4]="ABAABB";
   tablEAN[5]="ABBAAB";
   tablEAN[6]="ABBBAA";
   tablEAN[7]="ABABAB";
   tablEAN[8]="ABABBA";
   tablEAN[9]="ABBABA";
   
   
   
   
   // Set color values for the CMYK object
   var barColor = new CMYKColor();
   barColor.black = 100;
   barColor.cyan = 0;
   barColor.magenta = 0;
   barColor.yellow = 0;
   
               var zX = 0;
               var zY = bcHeight * 3.33;
           
               //var chkSum13=SUM13(EAN);
           
           
           
               SE();                                                                
           
               zX+=blkE;                                                      
               numBlokA1();                                                   
                   
               switch    (EAN.charAt(0)){
           
                   case '0':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[0].charAt(j-1),j); 
                           zX+=blkD;
                           }
                           CENTER();                                      
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);                                   
                           zX+=blkD;
                       }
           
                   break;
                   case '1':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[1].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '2':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[2].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '3':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[3].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '4':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[4].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '5':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[5].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '6':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[6].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '7':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[7].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '8':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[8].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
           
                   break;
                   case '9':
                   for (var j=2;j<7;j++){
                           numBlokAB(tablEAN[9].charAt(j-1),j);
                           zX+=blkD;
                           }
                           CENTER();
                           zX+=blkC; 
                   for (var u=7;u<13;u++){
                           numBlokC(u);
                           zX+=blkD;
                       }
                           
                   break;
           
               }
                           SE();           
              
           textEAN();
           
           
           //============== Function create text number code
           function textEAN(){
           
               //var posXGroup = 20; // X coordinate Barcode
               //var XGr = parseInt(posXGroup);    
               
               //var posYGroup = 50;  // Y coordinate Barcode
               //var YGr = parseInt(posYGroup);  
              
       
           
           
           //var ztX = bcWidth ;
           //var ztY = bcHeight * 2.4;
   
           var pointTextRef1 = EANGroup.textFrames.add();
           pointTextRef1.textRange.size = fS;
           pointTextRef1.contents = EAN.charAt(0);
           pointTextRef1.top = ztY * mm;
           pointTextRef1.left = (bcWidth - bcWidth * 8)*mm;
           pointTextRef1.textRange.characterAttributes.textFont =  textFonts.getByName("ocrb10");
           
           var pointTextRef2 = EANGroup.textFrames.add();
           pointTextRef2.textRange.size = fS;
           pointTextRef2.contents = EAN.substring(1,7);
           pointTextRef2.top = ztY*mm;
           pointTextRef2.left = (bcWidth + bcWidth * 3)*mm;
           pointTextRef2.textRange.characterAttributes.textFont =  textFonts.getByName("ocrb10");
           
           var pointTextRef3 = EANGroup.textFrames.add();
           pointTextRef3.textRange.size = fS;
           pointTextRef3.contents = EAN.substring(7,13);
           pointTextRef3.top = ztY*mm;
           pointTextRef3.left = (bcWidth + bcWidth * 49)*mm;
           pointTextRef3.textRange.characterAttributes.textFont =  textFonts.getByName("ocrb10");
           
           EANGroup.position = [newX, -newY];
           //EANGroup.position = Array (XGr*mm, -YGr*mm);
           
           redraw();
               
               }
           
           //============ 
           function numBlokA1(){
           
               switch (EAN.charAt(1)){
                               case '0':
                                   A_0();
                               break;            
                               case '1':
                                   A_1();
                               break;            
                               case '2':
                                   A_2();
                               break;            
                               case '3':
                                   A_3();
                               break;            
                               case '4':
                                   A_4();
                               break;            
                               case '5':
                                   A_5();
                               break;            
                               case '6':
                                   A_6();
                               break;            
                               case '7':
                                   A_7();
                               break;            
                               case '8':
                                   A_8();
                               break;            
                               case '9':
                                   A_9();
                               break;            
                       
                       }
           zX+=blkD;
               }
           
           
           //============ 
           function numBlokC(numC){
           
               switch (EAN.charAt(numC)){
                   case '0':
                   C_0();
                   break;
                   case '1':
                   C_1();
                   break;
                   case '2':
                   C_2();
                   break;
                   case '3':
                   C_3();
                   break;
                   case '4':
                   C_4();
                   break;
                   case '5':
                   C_5();
                   break;
                   case '6':
                   C_6();
                   break;
                   case '7':
                   C_7();
                   break;
                   case '8':
                   C_8();
                   break;
                   case '9':
                   C_9();
                   break;
                   }
           
           }
           
           //============ 
           function numBlokAB(ab,digBlok) {
               
               switch (ab){
                   case 'A':
                  switch (EAN.charAt(digBlok)){
                               case '0':
                                   A_0();
                               break;            
                               case '1':
                                   A_1();
                               break;            
                               case '2':
                                   A_2();
                               break;            
                               case '3':
                                   A_3();
                               break;            
                               case '4':
                                   A_4();
                               break;            
                               case '5':
                                   A_5();
                               break;            
                               case '6':
                                   A_6();
                               break;            
                               case '7':
                                   A_7();
                               break;            
                               case '8':
                                   A_8();
                               break;            
                               case '9':
                                   A_9();
                               break;            
                       
                                               }
                               break;
                             
                   case 'B':
              switch (EAN.charAt(digBlok)){
                               case '0':
                                   B_0();
                               break;            
                               case '1':
                                   B_1();
                               break;            
                               case '2':
                                   B_2();
                               break;            
                               case '3':
                                   B_3();
                               break;            
                               case '4':
                                   B_4();
                               break;            
                               case '5':
                                   B_5();
                               break;            
                               case '6':
                                   B_6();
                               break;            
                               case '7':
                                   B_7();
                               break;            
                               case '8':
                                   B_8();
                               break;            
                               case '9':
                                   B_9();
                               break;            
                       
                       }    
                       break;
               
               
               }                
               }
           
           
           function SUM13(EAN12){
           var sumSt1;
           var sumSt2;
           if (EAN12.length < 12)
           sumSt2 ="<?>";
           else {
           
           sumSt1 =  parseInt(EAN12.charAt(1))+parseInt(EAN12.charAt(3))+parseInt(EAN12.charAt(5))+parseInt(EAN12.charAt(7))+parseInt(EAN12.charAt(9))+parseInt(EAN12.charAt(11));
           sumSt1 *=3;
           sumSt1 += parseInt(EAN12.charAt(0))+parseInt(EAN12.charAt(2))+parseInt(EAN12.charAt(4))+parseInt(EAN12.charAt(6))+parseInt(EAN12.charAt(8))+parseInt(EAN12.charAt(10));
           sumSt2 = sumSt1%10;
            if (!(sumSt2 == 0))
                           {
                               sumSt2 = 10 - sumSt2;
                           }
                       
           else {
               sumSt2 = 0 ;
               
               }			
               }
           return sumSt2;
               }
       
           function rect(y1,x1,Rw,Rh,colorFill) {
               var rect = EANGroup.pathItems.rectangle( x1*mm, y1*mm, Rw*mm, Rh*mm );
                 
               rect.stroked = false;
               rect.filled = true;
               rect.fillColor = colorFill;
           }
           
           
           
           function A_0(){
             rect(zX+blk*3,zY,blk*2,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function A_1(){
             rect(zX+blk*2,zY,blk*2,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function A_2(){
             rect(zX+blk*2,zY,blk,blkH,barColor);   
             rect(zX+blk*5,zY,blk*2,blkH,barColor);   
               }
           function A_3(){
             rect(zX+blk,zY,blk*4,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function A_4(){
             rect(zX+blk,zY,blk,blkH,barColor);   
             rect(zX+blk*5,zY,blk*2,blkH,barColor);   
               }
           function A_5(){
             rect(zX+blk,zY,blk*2,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function A_6(){
             rect(zX+blk,zY,blk,blkH,barColor);   
             rect(zX+blk*3,zY,blk*4,blkH,barColor);   
               }
           function A_7(){
             rect(zX+blk,zY,blk*3,blkH,barColor);   
             rect(zX+blk*5,zY,blk*2,blkH,barColor);   
               }
           function A_8(){
             rect(zX+blk,zY,blk*2,blkH,barColor);   
             rect(zX+blk*4,zY,blk*3,blkH,barColor);   
               }
           function A_9(){
             rect(zX+blk*3,zY,blk,blkH,barColor);   
             rect(zX+blk*5,zY,blk*2,blkH,barColor);   
               }
           
           function B_0(){
             rect(zX+blk,zY,blk,blkH,barColor);   
             rect(zX+blk*4,zY,blk*3,blkH,barColor);   
               }
           function B_1(){
             rect(zX+blk,zY,blk*2,blkH,barColor);   
             rect(zX+blk*5,zY,blk*2,blkH,barColor);   
               }
           function B_2(){
             rect(zX+blk*2,zY,blk*2,blkH,barColor);   
             rect(zX+blk*5,zY,blk*2,blkH,barColor);   
               }
           function B_3(){
             rect(zX+blk,zY,blk,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function B_4(){
             rect(zX+blk*2,zY,blk*3,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function B_5(){
             rect(zX+blk,zY,blk*3,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function B_6(){
             rect(zX+blk*4,zY,blk,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function B_7(){
             rect(zX+blk*2,zY,blk,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function B_8(){
             rect(zX+blk*3,zY,blk,blkH,barColor);   
             rect(zX+blk*6,zY,blk,blkH,barColor);   
               }
           function B_9(){
             rect(zX+blk*2,zY,blk,blkH,barColor);   
             rect(zX+blk*4,zY,blk*3,blkH,barColor);   
               }
           
           function C_0(){
             rect(zX,zY,blk*3,blkH,barColor);   
             rect(zX+blk*5,zY,blk,blkH,barColor);   
               }
           function C_1(){
             rect(zX,zY,blk*2,blkH,barColor);   
             rect(zX+blk*4,zY,blk*2,blkH,barColor);   
               }
           function C_2(){
             rect(zX,zY,blk*2,blkH,barColor);   
             rect(zX+blk*3,zY,blk*2,blkH,barColor);   
               }
           function C_3(){
             rect(zX,zY,blk,blkH,barColor);   
             rect(zX+blk*5,zY,blk,blkH,barColor);   
               }
           function C_4(){
             rect(zX,zY,blk,blkH,barColor);   
             rect(zX+blk*2,zY,blk*3,blkH,barColor);   
               }
           function C_5(){
             rect(zX,zY,blk,blkH,barColor);   
             rect(zX+blk*3,zY,blk*3,blkH,barColor);   
               }
           function C_6(){
             rect(zX,zY,blk,blkH,barColor);   
             rect(zX+blk*2,zY,blk,blkH,barColor);   
               }
           function C_7(){
             rect(zX,zY,blk,blkH,barColor);   
             rect(zX+blk*4,zY,blk,blkH,barColor);   
               }
           function C_8(){
             rect(zX,zY,blk,blkH,barColor);   
             rect(zX+blk*3,zY,blk,blkH,barColor);   
               }
           function C_9(){
             rect(zX,zY,blk*3,blkH,barColor);   
             rect(zX+blk*4,zY,blk,blkH,barColor);   
               }
           
           
           function SE(){
               
             rect(zX,zY,blk,blkHE,barColor);   
             rect(zX+blk*2,zY,blk,blkHE,barColor);  
           
               }
           
           
           function CENTER(){
             rect(zX+blk,zY,blk,blkHE,barColor);   
             rect(zX+blk*3,zY,blk,blkHE,barColor);   
               }
           
           return EANGroup;
           }
           function CheckDigit(myCode) {
               //Calculate checksum of a 13 digit number and compare to last digit
               //Number must be 13 digit long, or the calculation will be wrong
               var mySum = 0;
               for (var j = 0 ; j < myCode.length - 1; j = j + 1){
                       //Determine weight to multiply to current digit
                       if (j%2 ==0) {
                           var weight = 1
                       } 
                       else {
                           var weight = 3
                       }
                       
                       var myNumber = myCode[j] * weight;
                       mySum = mySum + myNumber;
                       
                   }
                   //Calculate remainder to next ten;
                   checkDigit = Math.ceil(mySum/10)*10- mySum
                   //alert(checkDigit);
                   //alert(myCode[12]);
                   return (checkDigit == myCode[12]);
           }


// Utility that rotates an object around an arbitrary point
//The "export function" and the .mjs utility should make it importable in another script



function rotate_around_point (obj, roto_X, roto_Y, angle) {
    //Translate from point to document origin 
    obj.translate(-roto_Y, -roto_X); //Why the f*ck is Y and X for this call??

    //Rotate around document origin
    obj.rotate(angle,true,true,true,true,Transformation.DOCUMENTORIGIN);

    //Translate back
    obj.translate(roto_Y, roto_X);
}

//Utility to easily make a CMYK color
function make_cmyk (c, m, y, k) {
    var colorRef = new CMYKColor();
    colorRef .cyan = c;
    colorRef .magenta = m;
    colorRef .yellow = y;
    colorRef .black = k;
    return colorRef;
}



function justText(sel){
    
    var sel = app.activeDocument.selection;
    var locArr = new Array();
    var myJust = Justification.FULLJUSTIFYLASTLINELEFT; 
    try
{
	// Check current document for textFrames.
	if ( app.documents.length < 1 ) {
		alert ( "open a document with paragraphs that contain TabStops." );
	}
	else {
		docRef = app.activeDocument;
		if ( docRef.textFrames.length < 1 ) {
			alert ( "open a document with paragraphs that contain TabStops." );
		}
		else { 
			sel = docRef.selection;
			var slen = sel.length;
			for (var x=0;x<slen ;x++)
			{
				if(sel[x].typename == "TextFrame"){
					addtoList(sel[x]);
				}
			}
			
			for (all in locArr)
			{
			  locArr[all][0].story.textRange.justification = myJust;
//			  locArr[all][0].story.textFrame.typename = myTextType;
//			  locArr[all][0].story.textFrames.
			  locArr[all][0].top = locArr[all][1];
		      locArr[all][0].left = locArr[all][2];
			}

		}
	}
	 
	 
		
    }
    catch (e){
	    alert("Script Failed! Here's why:\n"+e);
        } 
        
        function addtoList(obj){
    
            var temp  = new Array();
           temp[0] = obj;
           temp[1] = obj.top;
           temp[2] = obj.left;
           locArr.push(temp);
        }
}

//Create new artboard
function createNewAB(){
            
	var thisBoardIndex = docRef.artboards.getActiveArtboardIndex();
	var thisBoard = docRef.artboards[thisBoardIndex];
	var thisRect = thisBoard.artboardRect;
	var lastBoard = docRef.artboards[docRef.artboards.length - 1];
	var lastRect = lastBoard.artboardRect;
		
	
	
	var newBoard = docRef.artboards.add(thisRect);
	var offsetH = 20;
	newBoard.artboardRect = [
		lastRect[2] + offsetH,
		lastRect[1],
		lastRect[2] + offsetH + (thisRect[2] - thisRect[0]),
		lastRect[3]
	];
	
};
 
