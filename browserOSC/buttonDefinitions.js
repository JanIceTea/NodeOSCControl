var UI_Element = function(){
  
  this.posX =  null;
  this.posY = null;
  this.width = null;
  this.height = null;
    
  this._color = null;
  
  this._label = null;
  this._textColor = null;
  this._textSize = null;
  
  this._oscAddress = null;
  
  this._page = 0;
  
  this.elementType = null;
  this.currentValue = null;
  this.currentActivity = null;
  this.redraw = null;
  
  this.init = function(){
    this.currentActivity = "none";
    this.currentValue = 0.05;
    this.redraw = false;    
  }
  
  this.position = function(x,y){
    this.posX = x;
    this.posY = y;
    return this;
  }
  
  this.size = function(x,y){
    this.width = x;
    this.height = y;       
    this._textSize = Math.min(Math.floor(this.height * 0.25),80);    
    return this;
  } 

  this.color = function(c){
    this._color = c;
    return this;
  }
  
  this.textColor = function(c){
    this._textColor = c;
    return this;
  }
  
  this.textSize = function(s){
    this._textSize = s;
    return this;
  }

  this.oscAddress = function(o){
    this._oscAddress = o;
    return this;
  }
  
  this.label = function(l){
    this._label = l;
    return this;
  }  
  
  this.page = function(p){
    this._page = p;
    return this;
  }
    
};

var TouchSlider = function(){

  this.__proto__ = new UI_Element();
  this.init();
  
  this.elementType = "TouchSlider";
  
  this.isHorizontal = true;
  
  this._color = "rgb(255,0,0)";
  this._textColor = "black";
  this._oscAddress = "/touchSlider";
  this._label = "TouchSlider";
  this._textSize = 10;
  
  this._backgroundColor = null;
  this._strokeColor = null;
  
  this.backgroundColor = function(c){
    this._backgroundColor = c;
    return this;
  }
  
  this.strokeColor = function(c){
    this._strokeColor = c;
    return this;
  }

  this.isVertical = function(){
    this.isHorizontal = false;    
    this._textSize = Math.floor(this.width * 0.25)    
    return this;
  }  
  
  ///
  this.display = function(ctx){
    // draw the bounding box of the slider
    if(this._backgroundColor == null){
      ctx.fillStyle = gui.backgroundColor;
    }
    else {
      ctx.fillStyle = this._backgroundColor;
    }
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
    
    // draw the indicator rectangle        
    if(this.isHorizontal){      
      ctx.fillStyle = this._color;
      ctx.fillRect(this.posX, this.posY, this.width * this.currentValue, this.height);    
    }
    else {
      ctx.fillStyle = this._color;
      ctx.fillRect(this.posX, this.posY + this.height, this.width, -this.height * this.currentValue);          
    }

    // draw the outline around the slider
    ctx.lineWidth = gui.lineWidth;
    if(this._strokeColor == null){
      ctx.strokeStyle = this._color;
    }
    else {
      ctx.strokeStyle = this._strokeColor;
    }
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);     
        
    // Draw Label
    ctx.fillStyle = this._textColor;    
    
    if(this.isHorizontal){
      // horizontal slider
      ctx.font = "bold "+ this._textSize +"px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(this._label, this.posX + this.width - 4, this.posY + this.height - 4);
    }
    else {
      // vertical slider
      ctx.font = "bold "+ this._textSize +"px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this._label, this.posX + (this.width*0.5), this.posY + (this.height-4));
    }    
  }
  
  this.checkActivity = function(){
    if(this.currentActivity != "none"){
      oscSend(this._oscAddress, this.currentValue);
      this.redraw = true;
      this.currentActivity = "none";
    }
  }
  
  this.activate = function(activityType, touches){
    this.currentActivity = activityType;    
    if(this.isHorizontal){
      this.currentValue = normalizeValue(touches[0].pageX, this.posX, this.posX+this.width);
    }
    else {
      this.currentValue = 1.0 - normalizeValue(touches[0].pageY, this.posY, this.posY+this.height);      
    }
  }
  
}

var TiltSlider = function(){

  this.__proto__ = new UI_Element();
  this.init();
  
  this.elementType = "TiltSlider";
  
  this.isActive = false;
  this.isHorizontal = true;  
  
  this._color = "red";
  this._textColor = "black";
  this._oscAddress = "/tiltSlider";
  this._label = "TiltSlider";
  this._textSize = 10;

  this._backgroundColor = null;
  this._strokeColor = null;
  
  this.backgroundColor = function(c){
    this._backgroundColor = c;
    return this;
  }
  
  this.strokeColor = function(c){
    this._strokeColor = c;
    return this;
  }
  
  this.isVertical = function(){
    this.isHorizontal = false;    
    this._textSize = Math.floor(this.width * 0.25)    
    return this;
  }
    
  ///
  this.display = function(ctx){
    // erase the slider
    if(this._backgroundColor == null){
      ctx.fillStyle = gui.backgroundColor;
    }
    else {
      ctx.fillStyle = this._backgroundColor;
    }
    ctx.fillRect(this.posX, this.posY, this.width, this.height);

    // draw the indicator rectangle    
    if(this.isHorizontal){
      ctx.fillStyle = this._color;
      ctx.fillRect(this.posX, this.posY, this.width * this.currentValue, this.height);    
    }
    else {
      ctx.fillStyle = this._color;
      ctx.fillRect(this.posX, this.posY + this.height, this.width, -this.height * this.currentValue);          
    }

    ctx.lineWidth = gui.lineWidth;
    if(this._strokeColor == null){
      ctx.strokeStyle = this._color;
    }
    else {
      ctx.strokeStyle = this._strokeColor;
    }
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);      
    
    // Draw Label
    ctx.fillStyle = this._textColor;    
    if(this.isActive){
      ctx.fillStyle = "blue";
    }
    
    if(this.isHorizontal){
      // horizontal slider
      ctx.font = "bold "+ this._textSize +"px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(this._label, this.posX + this.width - 4, this.posY + this.height - 4);
    }
    else {
      // vertical slider
      ctx.font = "bold "+ this._textSize +"px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this._label, this.posX + (this.width*0.5), this.posY + (this.height-4));
    }    
  }
  
  this.checkActivity = function(){
    if(this.currentActivity == "start"){
      if(!this.isActive){
	// is off, has become active
	this.isActive = true;
      }
      else if(this.isActive){
	// is on, has become inactive
	this.isActive = false;
      }      
    }
    if(this.currentActivity == "end"){
      // nothing
    }
    
    if(this.currentActivity == "tilt"){
      oscSend(this._oscAddress, this.currentValue);
    }
    
    if(this.currentActivity != "none"){
      this.currentActivity = "none";
    }
        
  }
  
  this.activate = function(activityType, doRedraw){
    this.currentActivity = activityType;
    if(doRedraw){
      this.redraw = true;
    }
  }
  
}

var PushButton = function(){

  this.__proto__ = new UI_Element();
  this.init();  
  
  this.elementType = "PushButton";  
  this.currentValue = "off";  
  
  this._color = "blue";
  this._textColor = "white";  
  this._oscAddress = "/pushButton";
  this._label = "PushButton";
  this._textSize = 10;
  
  ///
  this.checkActivity = function(){
    
    if(this.currentActivity == "start"){
      if(this.currentValue == "off"){
	// is off, has become active
	this.currentValue = "on";
	oscSend(this._oscAddress,1.0);
	
	this.redraw = true;		
      }
    }
    else if(this.currentActivity == "end"){
      if(this.currentValue == "on"){
	// is on, has become inactive
	this.currentValue = "off";
	oscSend(this._oscAddress,0.0);

	this.redraw = true;		
      }
    }
    
    if(this.currentActivity != "none"){
      this.currentActivity = "none";
    }
    
  }
  
  this.display = function(ctx){

    if(this.currentValue == "off"){
      // draw the button as off
      ctx.fillStyle = this._color;
      ctx.fillRect(this.posX, this.posY, this.width, this.height);    
    }
    else {
      // this.currentValue = "on"
      // draw a grey box in the space where the button is
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      var fillBoxMulti = 0.75;
      
      var newWidth = fillBoxMulti * this.width;
      var newHeight = fillBoxMulti * this.height;
      
      ctx.fillRect(this.posX + (this.width-newWidth)*0.5, this.posY + (this.height-newHeight)*0.5, newWidth, newHeight);          
    } 
    
    // Draw Label
    ctx.fillStyle = this._textColor;    
    ctx.font = "bold "+ this._textSize +"px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(this._label, this.posX + (this.width*0.5), this.posY + (this.height * 0.5) + (this._textSize * 0.5));
    
  }
  
  this.activate = function(activityType){
    this.currentActivity = activityType;
  }
  
}

var ToggleButton = function(){
  
  this.__proto__ = new UI_Element();
  this.init();

  this.elementType = "ToggleButton";  
  this.currentValue = "off";
    
  this._color = "blue";
  this._textColor = "white";
  this._oscAddress = "/toggleButton";
  this._label = "ToggleButton";
  this._textSize = 10;

  this._backgroundColor = null;
  
  this.backgroundColor = function(c){
    this._backgroundColor = c;
    return this;
  }  
  
  ///
  this.checkActivity = function(){
    
    if(this.currentActivity == "start"){
      if(this.currentValue == "off"){
	// is off, has become active
	this.currentValue = "on";
	oscSend(this._oscAddress,1.0);
      }
      else if(this.currentValue == "on"){
	// is on, has become inactive
	this.currentValue = "off";
	oscSend(this._oscAddress,0.0);
      } 
      this.redraw = true;		
    }
    else if(this.currentActivity == "end"){
      // does nothing on button up
    }
    
    if(this.currentActivity != "none"){
      this.currentActivity = "none";
    }    
    
  }
  
  this.display = function(ctx){
    
    if(this._backgroundColor == null){
      ctx.fillStyle = gui.backgroundColor;
    }
    else {
      ctx.fillStyle = this._backgroundColor;
    }
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  
    ctx.lineWidth = gui.lineWidth;
    ctx.strokeStyle = this._color;
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);     
    
    if(this.currentValue == "off"){
      // draw the button as off    
    }
    else {
      // this.currentValue = "on"
      // draw a grey box in the space where the button is
      ctx.fillStyle = this._color;
      var fillBoxMulti = 0.75;
      
      var newWidth = fillBoxMulti * this.width;
      var newHeight = fillBoxMulti * this.height;
      
      ctx.fillRect(this.posX + (this.width-newWidth)*0.5, this.posY + (this.height-newHeight)*0.5, newWidth, newHeight);          
    } 
    
    // Draw Label
    ctx.fillStyle = this._textColor;    
    ctx.font = "bold "+ this._textSize +"px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(this._label, this.posX + (this.width*0.5), this.posY + (this.height * 0.5) + (this._textSize * 0.5));
        
  }
  
  this.activate = function(activityType){
    this.currentActivity = activityType;
  }

}

var XYPad = function(){
  
  this.__proto__ = new UI_Element();
  this.init();
  
  this._color = "blue";
  this._textColor = "white";
  this._oscAddress = "/XYPad";
  this._label = "XY Pad";
  this._textSize = 10;
    
  this.elementType = "XYPad";
  
  this._invertX = false;
  this._invertY = false;
  
  this.currentValue = {
    x: 0.1,
    y: 0.5
  };

  this._backgroundColor = null;
  this._strokeColor = null;
  
  this.backgroundColor = function(c){
    this._backgroundColor = c;
    return this;
  }
  
  this.strokeColor = function(c){
    this._strokeColor = c;
    return this;
  }
  
  this.invertX = function(){
    this._invertX = true;
    return this;
  }
  
  this.invertY = function(){
    this._invertY = true;
    return this;
  }
  
  ////
  this.display = function(ctx){
    // draw the bounding box of the XYPad
    if(this._backgroundColor == null){
      ctx.fillStyle = gui.backgroundColor;
    }
    else {
      ctx.fillStyle = this._backgroundColor;
    }
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
            
    // draw X and Y indicator lines
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    // vertical line, X Value
    if(this._invertX){
      ctx.moveTo(this.posX + ((1.0-this.currentValue.x) * this.width), this.posY);
      ctx.lineTo(this.posX + ((1.0-this.currentValue.x) * this.width), this.posY + this.height);      
    }
    else {
      ctx.moveTo(this.posX + (this.currentValue.x * this.width), this.posY);
      ctx.lineTo(this.posX + (this.currentValue.x * this.width), this.posY + this.height);
    }
        
    // horizontal line, Y Value
    
    if(this._invertY){
      ctx.moveTo(this.posX, this.posY + ((1.0-this.currentValue.y) * this.height));
      ctx.lineTo(this.posX + this.width, this.posY + ((1.0-this.currentValue.y) * this.height));    
    }
    else {
      ctx.moveTo(this.posX, this.posY + (this.currentValue.y * this.height));
      ctx.lineTo(this.posX + this.width, this.posY + (this.currentValue.y * this.height));          
    }
    
    ctx.strokeStyle = this._color;
    ctx.stroke();    
    
    // draw a stroke outline of the XYPad
    ctx.lineWidth = gui.lineWidth;
    if(this._strokeColor == null){
      ctx.strokeStyle = this._color;
    }
    else {
      ctx.strokeStyle = this._strokeColor;
    }
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);  
        
    // Draw Label
    ctx.fillStyle = this._textColor;    
    ctx.font = "bold "+ this._textSize +"px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(this._label, this.posX + this.width - 4, this.posY + this.height - 4);
  }  
  
  this.checkActivity = function(){
    if(this.currentActivity != "none"){
      oscSend(this._oscAddress+"/x", this.currentValue.x);
      oscSend(this._oscAddress+"/y", this.currentValue.y);
      this.redraw = true;
      this.currentActivity = "none";
    }
  }
  
  this.activate = function(activityType, touches){
    this.currentActivity = activityType;
    if(this._invertX){
      this.currentValue.x = 1.0 - normalizeValue(touches[0].pageX, this.posX, this.posX+this.width);
    }
    else {
      this.currentValue.x = normalizeValue(touches[0].pageX, this.posX, this.posX+this.width);      
    }
    
    if(this._invertY){
      this.currentValue.y = 1.0 - normalizeValue(touches[0].pageY, this.posY, this.posY+this.height);      
    }
    else {
      this.currentValue.y = normalizeValue(touches[0].pageY, this.posY, this.posY+this.height);      
    }
  }
  
}

var PageButton = function(pageNumber){
  
  this.__proto__ = new UI_Element();
  this.init();
  
  this.elementType = "PageButton";

  this.currentValue = pageNumber;
  this.redraw = true;
  
  this.checkActivity = function(){    
    if(this.currentActivity == "start"){
      gui.setPage(this.currentValue);
      this.currentActivity = "none";
    }       
  }
  
  this.display = function(ctx){
    if(gui.currentPage == this.currentValue){
      ctx.fillStyle = "rgb(200,200,200)";
      ctx.fillRect(this.posX, this.posY, this.width, this.height);
    }
    else {
      ctx.fillStyle = "rgb(100,100,100)";
      ctx.fillRect(this.posX, this.posY, this.width, this.height);      
    }
  }
  
  this.activate = function(activityType){
    this.currentActivity = activityType;
  }
  
}