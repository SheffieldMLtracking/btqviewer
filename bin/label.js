function convertJSONtoImageURL(data,drawcrosshairs) {
    if (data === null) {alert("Failed");}
    img = data['photo'];
    fn = data['filename'];
    $('span#filename').text(fn);
    height = img.length
    width = img[0].length
    var canvas=document.createElement("canvas");
    var ctx=canvas.getContext("2d");

    // size the canvas to your desired image
    canvas.width=width;
    canvas.height=height;

    // get the imageData and pixel array from the canvas
    var imgData=ctx.getImageData(0,0,width,height);
    var imdata=imgData.data;

    // manipulate some pixel elements
    row = 0; //height-1;
    col = 0;
    
    var sum = 0;
    var count = 0;
    for( var i = 0; i < img.length; i+=1 ){
      for( var j = 0; j < img[i].length; j+=1 ){
        sum += img[i][j]; //don't forget to add the base
        count += 1;
      }
    }
    var avg = sum/count;
    var maxval = avg*2;

    maxval = $('input#scaletext').val();
    //$('span#scaletext').text(maxval.toFixed(2))
    scale = 255/maxval

    for(var i=0;i<imdata.length;i+=4){
        c = img[row][col]*scale;
        if (c>255) {c=255;}
        imdata[i]=c;
        imdata[i+1] = c;
        imdata[i+2] = c;
        imdata[i+3]=255; // make this pixel opaque
        col = col + 1;
        if (col>=width) {
          col = 0;
          row = row + 1;
        }
    }
    

    if (drawcrosshairs) {
        
        drawcrosshair(imdata,width,height)
        
    }
    
    
    // put the modified pixels back on the canvas
    ctx.putImageData(imgData,0,0);

    return "url('"+canvas.toDataURL()+"')";
}

url = "http://127.0.0.1:"+$('input#port').val()+"/getsessions";
$.getJSON(url, function(data) {
    $('#session')
    .find('option')
    .remove()
    for (var key in data) {
        sess = data[key];
        $('#session').append('<option value="'+sess+'">'+sess+'</option>');
        
    }
    current_session = data[0];
    updateSets();
});


function updateSets() {
    current_session = $('#session').val();
    url = "http://127.0.0.1:"+$('input#port').val()+"/getsets/"+current_session;
    $.getJSON(url, function(data) {
        $('#photo_set')
        .find('option')
        .remove()
        for (var key in data) {
            photo_set = data[key];
            $('#photo_set').append('<option value="'+photo_set+'">'+photo_set+'</option>');
            
        }
        updateBoxes();
    });
   
}


function updateBoxes() {
    current_set = $('#photo_set').val();
    url = "http://127.0.0.1:"+$('input#port').val()+"/getboxes/"+current_session+'/'+current_set;
    $.getJSON(url, function(data) {
        $('#box')
        .find('option')
        .remove()
        for (var key in data) {
            box = data[key];
            $('#box').append('<option value="'+box+'">'+box+'</option>');
            
        }
        updateCams();
    });
    
}


function updateCams() {
    current_box = $('#box').val();
    url = "http://127.0.0.1:"+$('input#port').val()+"/getcams/"+current_session+'/'+current_set+'/'+current_box;
    $.getJSON(url, function(data) {
        $('#camid')
        .find('option')
        .remove()
        for (var key in data) {
            boxid = data[key];
            $('#camid').append('<option value="'+boxid+'">'+boxid+'</option>');
        }
        refreshimages();
    });
    
}


$('select#session').click(function(){updateSets();});
$('select#photo_set').click(function(){updateBoxes();});
$('select#box').click(function(){updateCams();});
$('select#camid').click(function(){refreshimages();});

$('input#scaletext').bind('input',function() {refreshimages();});
$('input#imagenum').bind('input',function() {image = parseInt($('input#imagenum').val()); refreshimages();});
//$('input#datetime').bind('input',function() {
$('button#goto').click(function(){
url = "http://127.0.0.1:"+$('input#port').val()+"/getindexoftime/"+cam+'/'+$('input#datetime').val();
$.getJSON(url, function(data) {image=data; $('input#imagenum').val(data); refreshimages();}); 
});
$('button#newconfig').click(function(){
url = "http://127.0.0.1:"+$('input#port').val()+"/newconfig/"+$('input#datetime').val();
$.getJSON(url, function(data) {refreshimages();});
});

$('button#detectrange').click(function(){
url = "http://127.0.0.1:"+$('input#port').val()+"/detectfromto/"+cam+'/'+image+'/'+(image+50);
$.getJSON(url, function(data) {}); 
});


cam_images = [0,0,0,0,0,0];
image = 0;
x1 = 0;
x2 = 2048;
y1 = 0;
y2 = 1536;
boxsize=300;

$('button#next').click(function(){
image=image+1; 
refreshimages(); drawDots(); })
$('button#last').click(function(){
image=image-1; 
refreshimages();})
$('button#reset').click(function(){
x1 = 0;
x2 = 2048;
y1 = 0;
y2 = 1536;
boxsize=300;
refreshimages();})
$('button#next10').click(function(){
image=image+10; 
x1 = 0;
x2 = 2048;
y1 = 0;
y2 = 1536;
boxsize=300;
refreshimages();})
$('button#last10').click(function(){
image=image-10; 
x1 = 0;
x2 = 2048;
y1 = 0;
y2 = 1536;
boxsize=300;
refreshimages();})



$(document).keypress(function(e) {

  if(e.which == 120) { //'x'

    //url = "http://127.0.0.1:"+$('input#port').val()+"/deletelm/"+cam+'/'+internalcam+'/'+image+'/'+Math.round(x)+"/"+Math.round(y);
    //$.getJSON(url, function(data) {});
    //setTimeout(refreshimages, 200);
  }
  if(e.which == 110) {$('button#next').trigger('click');} //'n'
  if(e.which == 78) {$('button#next10').trigger('click');}   //'N' (shift-N)
  if(e.which == 108) {$('button#last').trigger('click');}    //'l' 
  if(e.which == 76) {$('button#last10').trigger('click');} //'L' (shift-L)
  if(e.which == 114) {$('button#reset').trigger('click');}  //'r'

  if(e.which == 100) { //'d'
        photo_set = $('select#photo_set').val();
        session = $('select#session').val();
        box = $('select#box').val();
        cam = $('select#camid').val();
        sess_set_box_cam_string = session+'/'+photo_set+'/'+box+'/'+cam;
    
        url = "http://127.0.0.1:"+$('input#port').val()+"/deleteallpos/"+sess_set_box_cam_string+'/'+image;
        $.getJSON(url, function(data) {}); 
        setTimeout(refreshimages, 300);  
  }
});



function drawpixel(imdata,x,y,width,height) {
    pos = 4*(x+y*width)
    imdata[pos] = 0
    imdata[pos+1] = 0
    imdata[pos+2] = 0
}
function drawscaledpixel(imdata,x,y,width,height,r,g,b) {
    if ((x>x1) && (x<x2) && (y>y1) && (y<y2)) {
        x = Math.round(width*(x - x1)/(x2-x1))
        y = Math.round(height*(y - y1)/(y2-y1))
        
        pos = 4*(x+y*width)
        imdata[pos] = r
        imdata[pos+1] = g
        imdata[pos+2] = b
    }
}

function drawcrosshair(imdata,width,height) {
    x=Math.round(width/2);
    y=Math.round(height/2);
    for (xstep=x-10;xstep<x+10;xstep+=1) {
        drawpixel(imdata,xstep,y,width,height)
    }
    for (ystep=y-10;ystep<y+10;ystep+=1) {
        drawpixel(imdata,x,ystep,width,height)
    }

}

function drawscaledcrosshair(imdata,width,height,x,y,size,r,g,b) {
    if (size<0) {return;}
    size = Math.round(size)+5
    for (step=-size;step<+size;step+=1) {
        if (Math.abs(step)<5) {continue;}
        drawscaledpixel(imdata,x,y+step,width,height,r,g,b)
        drawscaledpixel(imdata,x+step,y,width,height,r,g,b)
    }

}

function drawscaleddiagcrosshair(imdata,width,height,x,y,size,r,g,b) {
    if (size<0) {return;}
    size = Math.round(size)+5
    for (step=-size;step<+size;step+=1) {
       if (Math.abs(step)<5) {continue;}
        drawscaledpixel(imdata,x+step,y+step,width,height,r,g,b)
        drawscaledpixel(imdata,x-step,y+step,width,height,r,g,b)
    }

}

shifted = false
controlpressed = false
$(document).on('keyup keydown', function(e){shifted = e.shiftKey} );
$(document).on('keyup keydown', function(e){controlpressed = e.ctrlKey} );
    
$('#image2').mousedown(function(e){
    if (event.which==2) {
        if (shifted) {confidence=50;} else {confidence=100;}   
        label = "none";     
        if (controlpressed) {label = prompt("Enter label", "none");}

        photo_set = $('select#photo_set').val();
        session = $('select#session').val();
        box = $('select#box').val();
        cam = $('select#camid').val();
        sess_set_box_cam_string = session+'/'+photo_set+'/'+box+'/'+cam;
        url = "http://127.0.0.1:"+$('input#port').val()+"/savepos/"+sess_set_box_cam_string+'/'+image+"/"+Math.round(chosenloc[0])+"/"+Math.round(chosenloc[1])+"/"+confidence+"/"+label;

        console.log(url);
        $.getJSON(url, function(data) {alert('???');}); 
        //refreshimages();
        setTimeout(refreshimages, 100)
    }
});



$('#image2').click(function(e){
    var posX = $(this).offset().left, posY = $(this).offset().top;
    centrex = (e.pageX - posX);
    centrey = (e.pageY - posY);
    centrex = x1+(x2-x1)*centrex/1024;
    centrey = y1+(y2-y1)*centrey/768;


    $('span#loc').text(Math.round(centrex) + " " + Math.round(centrey))
    boxsize = boxsize * 0.8; // / 2;
    x1 = -1
    while ((x1<0) | (y1<0) | (x2>2047) | (y2>1535)) {
        x1 = centrex-boxsize;
        x2 = centrex+boxsize;
        y1 = centrey-boxsize/1.3333333;
        y2 = centrey+boxsize/1.3333333;

        if (x1<0) {boxsize = boxsize + x1 - 1; continue;}
        if (y1<0) {boxsize = boxsize + y1*1.3333333 - 1; continue;}
        if (x2>2047) {boxsize=boxsize + (2047-x2) - 1; continue;}
        if (y2>1535) {boxsize = boxsize + (1535-y2)*1.3333333 - 1; continue}
    }
    refreshimages();
});
currentimage = null
positions = null


function drawDots() {
  context.clearRect(0, 0, canvasWidth, canvasHeight)
  context.beginPath();
  if (currentimage==null) {return;}
  scale = currentimage['photo'].length/768;

  brightestv = 0;
  brightloc = null;
  box = 2;

  if (dot.y*scale+box+2>currentimage['photo'].length) {dot.y = (currentimage['photo'].length-box-2)/scale;}
  if (dot.y*scale-box-2<0) {dot.y = (box+2)/scale;}
  for( var i = Math.round(dot.x*scale-box); i < dot.x*scale+box; i+=1 ){
    for( var j = Math.round(dot.y*scale-box); j < dot.y*scale+box; j+=1 ){
      if (currentimage['photo'][j][i]>brightestv) {
        brightestv = currentimage['photo'][j][i];
        brightloc = [i,j];
      }
    }
  }
  if (brightloc!=null) {
    chosenloc = [x1+(x2-x1)*brightloc[0]/1024/scale, y1+(y2-y1)*brightloc[1]/768/scale];

    context.beginPath();
    context.arc(1+brightloc[0]/scale,1+brightloc[1]/scale, 5, 0, 2 * Math.PI, false);
    context.strokeStyle = '#ffff00';
    context.stroke();
  }

  for (var i = 0; i<positions.length; i+=1) {
 
    position = positions[i]
    context.beginPath();
    pos = []

    pos['x'] = 1024*(position['x']-x1)/(x2-x1);
    pos['y'] = 768*(position['y']-y1)/(y2-y1);
    


    context.arc(2+pos['x'],1+pos['y'], 25, 0, 2 * Math.PI, false);
    context.strokeStyle = '#ffff00';
    context.font = "20px Arial";
    context.fillStyle = "Yellow";    
    context.fillText(position['meta']+position['label'], pos['x'],1+pos['y'])
    context.stroke(); 
    
    //if (position['source']=='retrodetect')
   
    
  } 
}

$('input#maxval').bind('input',function() {refreshimages();});
function refreshimages(){
    photo_set = $('select#photo_set').val();
    session = $('select#session').val();
    box = $('select#box').val();
    cam = $('select#camid').val();
    sess_set_box_cam_string = session+'/'+photo_set+'/'+box+'/'+cam;
    cam_images[cam]=image;
    $('input#imagenum').val(image);
    
    url = "http://127.0.0.1:"+$('input#port').val()+"/getimage/"+sess_set_box_cam_string+'/'+image+"/"+Math.round(x1)+"/"+Math.round(y1)+"/"+Math.round(x2)+"/"+Math.round(y2);
    $.getJSON(url, function(data) {$('#image').css("background-image",convertJSONtoImageURL(data,true)); currentimage=data; });  
    
    url = "http://127.0.0.1:"+$('input#port').val()+"/loadpos/"+sess_set_box_cam_string+'/'+image;
    $.getJSON(url, function(data) {positions = data;});
    
    setTimeout(drawDots,100);
}

refreshimages();


var dot = { x: 50, y: 50, radius: 25 };
$('canvas#image2').mousemove(function( event ) {
  dot.x = event.offsetX;
  dot.y = event.offsetY;
  
  drawDots();
  
  x = x1+(x2-x1)*dot.x/1024
  y = y1+(y2-y1)*dot.y/768
  $('span#locationstring').text(Math.round(x)+" "+Math.round(y)+" ("+Math.round(chosenloc[0])+" "+Math.round(chosenloc[1])+")")
});

var canvas = $('canvas#image2');
var context = canvas[0].getContext('2d');
var canvasWidth = canvas.width();
var canvasHeight = canvas.height();
canvas.attr({height: canvasHeight, width: canvasWidth});

// Set and create our dot.
chosenloc = [0,0];

setTimeout(refreshimages, 100);  
setTimeout(drawDots, 200);  
