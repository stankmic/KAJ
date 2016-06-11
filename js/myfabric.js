/*
MyFabric object constructor
@param id - canvas id
*/
var MyFabric = function(id) {
    this._canvas = new fabric.Canvas(id);
    this._main = document.querySelector("main");
    this._resizeCanvas();
    window.addEventListener("resize", this._resizeCanvas.bind(this), false);
    window.addEventListener("keyup", this._keyup.bind(this));
}

/*
Test function what Fabric can do
*/
MyFabric.prototype.test = function() {
    var hi = new fabric.Text("hi");
    this._canvas.add(hi);
}

/*
Resize canvas on full <main> size
*/
MyFabric.prototype._resizeCanvas = function() {
    this._canvas.setHeight(this._main.offsetHeight);
    this._canvas.setWidth(this._main.offsetWidth);
    this._canvas.renderAll();
}

/*
Handle key up event
@param e - event
*/
MyFabric.prototype._keyup = function(e) {
    const del = 46;
    var key = e.keyCode ? e.keyCode : e.which;
    switch (key) {
        case del:
            this._deleteSelected();
            break;
    }
}

/*
Set canvas background image
@param url - image url (can be data url)
*/
MyFabric.prototype.setBackgroundImage = function(url) {
    fabric.Image.fromURL(url);
    fabric.Image.fromURL(url, function(img) {
        this._canvas.setBackgroundImage(img);
        this._canvas.renderAll();
    }.bind(this));
}

/*
Add image to canvas
@param url - image url (can be data url)
*/
MyFabric.prototype.addImage = function(url) {
    fabric.Image.fromURL(url);
    fabric.Image.fromURL(url, function(img) {
        this._canvas.add(img);
    }.bind(this));
}

/*
Delete currently selected object from canvas
*/
MyFabric.prototype._deleteSelected = function() {
    this._canvas.getActiveObject().remove();
}

/*
Get current canvas content as data URL
@return base64 png image from the current canvas content
*/
MyFabric.prototype.getDataURL = function() {
    this._canvas.deactivateAll();
    this._canvas.renderAll();
    return this._canvas.toDataURL();
}

/*
Get current canvas cropped content as data URL
@return base64 png image from the current canvas content
*/
MyFabric.prototype.getCroppedDataURL = function() {
    var tmpCanvas = new fabric.Canvas();
    tmpCanvas.setHeight(this._canvas.getHeight());
    tmpCanvas.setWidth(this._canvas.getWidth());

    var g = new fabric.Group();
    for (var i = 0; i<this._canvas.getObjects().length; i++) {
        var item = this._canvas.item(i);
        g.addWithUpdate(fabric.util.object.clone(item));
    }
    tmpCanvas.add(g);

    var crop = g.getBoundingRect();
    var dataURL = tmpCanvas.toDataURL({
        left: crop.left,
        top: crop.top,
        width: crop.width,
        height: crop.height
    });
    tmpCanvas.clear();
    return dataURL;
}