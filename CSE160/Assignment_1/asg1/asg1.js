// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform float u_Size;
 void main() { 
  gl_Position = a_Position; 
  gl_PointSize = u_Size;}
  `

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
   gl_FragColor = u_FragColor;
  }`
let canvas;
let gl;
let u_FragColor;
let a_Position;
let u_Size;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
}

function connectVariablesToGLSL() {
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

//global variables for UI
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = 'POINT';
let g_numSegs = 10;

function addActionsForHtmlUI() {
  //actions for buttons
  // document.getElementById('green').onclick = function () { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red').onclick = function () { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  // document.getElementById('blue').onclick = function () { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; };
  document.getElementById('clear').onclick = function () { g_shapesList = []; renderAllShapes() };

  document.getElementById('point').onclick = function () { g_selectedType = 'POINT' };
  document.getElementById('triangle').onclick = function () { g_selectedType = 'TRIANGLE' };
  document.getElementById('circle').onclick = function () { g_selectedType = 'CIRCLE' };

  document.getElementById('picture').onclick = function () { g_shapesList = []; renderAllShapes(); drawPicture(); };





  //actions for sliders
  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100 });
  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100 });
  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100 });
  document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value });
  document.getElementById('segSlide').addEventListener('mouseup', function () { g_numSegs = this.value });




}
function main() {
  //Set up webGL stuff
  setupWebGL();
  //Connect variables to GLSL
  connectVariablesToGLSL();
  //set up HTML buttons
  addActionsForHtmlUI();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []

function click(ev) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  [x, y] = convertCoordinateEventsToGL(ev);
  // Store the coordinates to g_points array
  let point;
  if (g_selectedType == 'POINT') {
    point = new Point();
  }
  else if (g_selectedType == 'TRIANGLE') {
    point = new Triangle();
  }
  else {
    point = new Circle();
  }


  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  // g_points.push([x, y]);
  // //g_colors.push(g_selectedColor);
  // g_colors.push(g_selectedColor.slice());
  // g_sizes.push(g_selectedSize);
  //Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }
  //note: since we need to push new colors into the array, we need to copy them into something new. 
  //Slice does this, but we can also manually copy it into a new array, and push that too.
  renderAllShapes();
}
function convertCoordinateEventsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return ([x, y]);
}
//functi
// Clear <canvas>
function renderAllShapes() {
  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT);
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot:" + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}


function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from html");
    return;
  }
  htmlElm.innerHTML = text;
}



function drawPicture() {
  //make canvas better color (light blue)
  gl.clearColor(0.53, 0.8, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //create our triangles(vertices), then call render() on them to render them

  //dog body
  let bod1 = [0.1, -0.1, -0.5, 0, 0.5, 0];
  let bod2 = [0.1, -0.1, -0.2, -0.05, 0.3, -0.05];
  let bod3 = [0.1, 0.1, -0.5, 0, 0.5, 0];

  //dog legs
  let leg1 = [-0.3, -0.02, -0.2, -0.03, -0.2, -0.2];
  let leg2 = [-0.2, -0.05, -0.1, -0.05, -0.1, -0.2];
  let leg3 = [0.4, -0.02, 0.3, -0.03, 0.3, -0.2];
  let leg4 = [0.3, -0.05, 0.2, -0.05, 0.2, -0.2];

  //dog head
  let head = [-0.64, 0.15, -0.34, 0.15, -0.48, -0.1];
  let nose = [-0.48, -0.1, -0.46, -0.075, -0.50, -0.075];
  //dog ears
  let ear1 = [-0.42, 0.15, -0.37, 0.15, -0.40, 0.35];
  let ear2 = [-0.62, 0.15, -0.57, 0.15, -0.60, 0.35];
  let ear3 = [-0.42, 0.15, -0.37, 0.15, -0.40, 0.25];
  let ear4 = [-0.62, 0.15, -0.57, 0.15, -0.60, 0.25];
  //dog eyes
  let eye1 = [-0.54, 0.07];
  let eye2 = [-0.44, 0.07];
  //render triangle
  //var xy = this.position;
  var rgba = [0.71, 0.39, 0.11, 1.0]; //dog body color (brown)

  //var d = this.size / 200.0; //delta
  //draw all the brown triangles
  drawCustomTriangles(rgba, bod1);
  drawCustomTriangles(rgba, bod3);
  drawCustomTriangles(rgba, leg1);
  drawCustomTriangles(rgba, leg2);
  drawCustomTriangles(rgba, leg3);
  drawCustomTriangles(rgba, leg4);
  drawCustomTriangles(rgba, head);
  drawCustomTriangles(rgba, ear1);
  drawCustomTriangles(rgba, ear2);

  rgba = [1.0, 1.0, 1.0, 1.0];
  //draw white triangles
  drawCustomTriangles(rgba, bod2);
  //draw pink triangles
  rgba = [1.0, 0.75, 0.80, 1.0];
  drawCustomTriangles(rgba, ear3);
  drawCustomTriangles(rgba, ear4);
  //draw eyes
  rgba = [0.0, 0.0, 0.0, 1.0];
  drawCustomTriangles(rgba, nose);
  drawCustomPoints(rgba, eye1);
  drawCustomPoints(rgba, eye2);



}
//helper function for drawing custom triangles
function drawCustomTriangles(rgba, vertices) {
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  // Pass the position of a point to a_Position variable
  gl.uniform1f(u_Size, 1.0);
  drawTriangles(vertices);
}
//helper function for drawing custom points
function drawCustomPoints(rgba, pos) {
  gl.disableVertexAttribArray(a_Position);
  // Pass the size of a point to u_Size variable
  gl.vertexAttrib3f(a_Position, pos[0], pos[1], 0.0);
  // Pass the color of a point to u_FragColor variable
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  // Pass the position of a point to a_Position variable
  gl.uniform1f(u_Size, 7.0);
  // Draw
  gl.drawArrays(gl.POINTS, 0, 1);
}