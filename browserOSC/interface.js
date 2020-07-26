var debugMode = true;
debugMode = false;

var gui = new Object();		// global variable

  gui.elements = new Array();
  
  gui.currentPage = 0;
  gui.numberOfPages = -1;

  gui.backgroundColor = "rgb(120,120,120)";
  gui.lineWidth = 6.0;
  gui.pageButtonSize = 50;
  
  // developer facing
  gui.addElement = function(guiElement){
    this.elements.push(guiElement);
  }
  
  gui.setPage = function(p){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");    
    
    gui.currentPage = p;
    gui.DrawElements(ctx);
  }
  
  // algorithm facing  
  gui.init = function(){
    // count the number of pages\
    var len = this.elements.length;
    for(var i = 0; i < len; ++i){
      if(gui.numberOfPages < this.elements[i]._page){
	gui.numberOfPages = this.elements[i]._page;
      }
    }
    gui.numberOfPages += 1;	// ugly zero indexed page solution
    //console.log("Number of Pages : "+gui.numberOfPages);
    
    if(gui.numberOfPages > 1){
      // don't add page buttons if there is only one page
      for(var i = 0; i < gui.numberOfPages; i++){
	
	var sz = gui.pageButtonSize;
	var offset = 10;
	var w = window.innerWidth;
	var h = window.innerHeight;
	
	// add page buttons
	gui.addElement(new PageButton(i).position(((i*sz)+(offset)) + (offset), h - offset - sz).size(sz-offset,sz-offset));
      }
    }
  }

  gui.DrawElements = function(ctx){

    ctx.fillStyle = gui.backgroundColor;
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);    
    
    for(var i = 0; i < this.elements.length; ++i){
      if(this.elements[i]._page == this.currentPage || this.elements[i].elementType == "PageButton"){
	this.elements[i].display(ctx);
      }
    }
  }
  
  gui.CheckBounds = function(eventType, touches){
    
    // step through each button to see if the touch event 
    // falls within the bounds of an element
    for(var i = 0; i < this.elements.length; ++i){
      if(this.elements[i]._page == this.currentPage || this.elements[i].elementType == "PageButton"){
	if(touches[0].pageX >= this.elements[i].posX &&
	    touches[0].pageY >= this.elements[i].posY &&
	    touches[0].pageX <= (this.elements[i].posX + this.elements[i].width) &&
	    touches[0].pageY <= (this.elements[i].posY + this.elements[i].height)){
	      
	      if(this.elements[i].elementType == "TouchSlider" || this.elements[i].elementType == "XYPad"){
		// pass in the coordinates in the activation
		if(debugMode){ oscSend("touchSliderEvent_"+eventType, 0); }	
		
		if(eventType == "start"){
		  this.elements[i].activate(eventType, touches);
		}
		if(eventType == "move"){
		  this.elements[i].activate(eventType, touches);
		}
	      }
	      else if(this.elements[i].elementType == "TiltSlider") {
		this.elements[i].activate(eventType, true);
	      }
	      else {	      
		// is a binary button type, PushButton/ToggleButton/TiltSlider
		this.elements[i].activate(eventType);
	      }
	      
	    }
      }
    }
    
  }
  
  gui.CheckActivity = function(){
    for(var i = 0; i < this.elements.length; ++i){
      this.elements[i].checkActivity();
    }
  }
  
  gui.Redraw = function(ctx){
    for(var i = 0; i < this.elements.length; ++i){
      if(this.elements[i].redraw){
	this.elements[i].display(ctx);
	this.elements[i].redraw = false;
      }
    }
  }
  
  gui.Tick = function(ctx){
    gui.CheckActivity();
    gui.Redraw(ctx);
  }
