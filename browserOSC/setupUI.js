var hostName = "http://192.168.2.8";

function setupUI(ctx, text){

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    // overrides the default background color and pagebutton size
    gui.backgroundColor = "rgb(0, 0, 0)";
    gui.pageButtonSize = 150;

/*
  Reference
  ---------

  UI Elements:
    PushButton()
    ToggleButton()
    XYPad()
    TouchSlider()
    TiltSlider()

  Methods:
    position(x,y)
    size(x,y)
    color(cssColor)
    label(string)
    oscAddress(string)
    page(index) - somewhat optional, defaults to page zero when not called
  Optional Methods: (some methods not apply to all UI Elements, see README.md for more information)
    textSize(px)
    strokeColor(cssColor)
    backgroundColor(cssColor)
    isVertical()

*/

    
    // delete these and add your own buttons!!
    gui.addElement(new PushButton()
		    .position(10, height-200).size(width - 20,180)
		    .color("rgb(61, 88, 151)")
		    .oscAddress("/pushButton0").textColor("white")
		    .label("Now").page(0));

}
