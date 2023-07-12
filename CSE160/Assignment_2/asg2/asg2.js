// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
 void main() { 
  gl_Position = u_GlobalRotateMatrix* u_ModelMatrix*a_Position; 
  }
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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
  gl.enable(gl.DEPTH_TEST);
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

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of U_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of U_GlobalRotateMatrix');
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

//global variables for UI
//let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_globalAngleX = 5;
let g_globalAngleY = 0;
let g_rightArmSlider = 0;
let g_rightForearmSlider = 0;
let g_leftArmSlider = 0;
let g_leftForearmSlider = 0;
let g_rightLegSlider = 0;
let g_leftLegSlider = 0;
let g_animation = 0;
// let g_selectedType = 'POINT';
// let g_numSegs = 10;

function addActionsForHtmlUI() {
  //actions for buttons

  document.getElementById('animationOn').onclick = function () { g_animation = 1; };
  document.getElementById('animationOff').onclick = function () { g_animation = 0; };

  document.getElementById('angleSlideX').addEventListener('mousemove', function () { g_globalAngleX = this.value; renderAllShapes(); });
  document.getElementById('angleSlideY').addEventListener('mousemove', function () { g_globalAngleY = this.value; renderAllShapes(); });
  document.getElementById('rightArmSlider').addEventListener('mousemove', function () { g_rightArmSlider = this.value; renderAllShapes(); });
  document.getElementById('rightForearmSlider').addEventListener('mousemove', function () { g_rightForearmSlider = this.value; renderAllShapes(); });
  document.getElementById('leftArmSlider').addEventListener('mousemove', function () { g_leftArmSlider = this.value; renderAllShapes(); });
  document.getElementById('leftForearmSlider').addEventListener('mousemove', function () { g_leftForearmSlider = this.value; renderAllShapes(); });
  document.getElementById('rightLegSlider').addEventListener('mousemove', function () { g_rightLegSlider = this.value; renderAllShapes(); });
  document.getElementById('leftLegSlider').addEventListener('mousemove', function () { g_leftLegSlider = this.value; renderAllShapes(); });

  //document.getElementById('segSlide').addEventListener('mouseup', function () { g_numSegs = this.value });




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
  gl.clearColor(1, 0.6, 0.06, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}


function click(ev) {
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // // Clear <canvas>
  gl.clear(gl.DEPTH_BUFFER_BIT);

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
//tick function
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  console.log(g_seconds);
  updateAnimation();
  renderAllShapes();
  requestAnimationFrame(tick);
}
//funtion for updating animations
//var g_leftLegTranslate = [-.75, -0.04];
function updateAnimation() {
  if (g_animation == 1) {
    g_rightArmSlider = 45 * Math.sin(g_seconds);
    g_rightForearmSlider = -(45 * Math.sin(g_seconds));
    g_leftArmSlider = 45 * Math.sin(g_seconds);
    g_leftForearmSlider = -(45 * Math.sin(g_seconds));
    g_leftLegSlider = 30 * (Math.sin(g_seconds));
    g_rightLegSlider = 30 * (Math.cos(g_seconds));

  }
}
// Clear <canvas>
function renderAllShapes() {
  var startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //var len = g_shapesList.length;
  // for (var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }
  //global matrix
  var globalRotMatrix = new Matrix4().rotate(g_globalAngleX, 0, 1, 0);
  globalRotMatrix.rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);

  //draw things directly
  //drawTriangles3D([-1.0, 0.0, 0.0, -.5, -1.0, 0.0, 0.0, 0.0, 0.0]);

  //spongebob body
  //matrix for all body parts that will be tilted
  matrixBody = new Matrix4();
  matrixBody.translate(-.4, -0.2, 0.0);
  matrixBody.rotate(-40, 1, 0, 0);
  matrixBody.scale(.8, 0.8, 0.3);
  //main body (head structure)
  drawCube(matrixBody, [1.0, 1.0, 0.0, 1.0]);
  // var body = new Cube();
  // body.color = [1.0, 1.0, 0.0, 1.0];
  // body.matrix = matrixBody;
  //body.render();
  var hat = new Octagon()
  hat.color = [1, 1, 1, 1];
  hat.matrix.rotate(-38, 1, 0, 0);
  hat.matrix.translate(0, .5, 0);
  hat.matrix.scale(.3, 2, .5);
  hat.render();

  hat2Matrix = new Matrix4();
  hat2Matrix.translate(-.02, .3, -0.65);
  hat2Matrix.rotate(-40, 1, 0, 0);
  hat2Matrix.scale(.1, .1, .3);
  drawCube(hat2Matrix, [1, 1, 1, 1]);
  hat3Matrix = new Matrix4();
  hat3Matrix.translate(.03, .45, -0.57);
  hat3Matrix.rotate(-40, 1, 0, 0);
  hat3Matrix.scale(.02, .18, .02);
  drawCube(hat3Matrix, [0, 0, 1, 1]);
  hat4Matrix = new Matrix4();
  hat4Matrix.rotate(-90, 0, 0, 1);
  hat4Matrix.translate(-.49, 0, -0.61);
  //hat4Matrix.rotate(-40, 1, 0, 0);
  hat4Matrix.scale(.02, .08, .02);
  drawCube(hat4Matrix, [0, 0, 1, 1]);

  //main pants
  matrixPants = matrixBody;
  matrixPants.scale(1, .35, 1);
  matrixPants.translate(0, -1, 0);
  drawCube(matrixPants, [.58, .16, .09, 1]);

  //main eyes
  matrixrighteye = matrixPants;
  matrixrighteye.translate(.56, 2.5, -.15);
  matrixrighteye.scale(.3, .75, .3);
  drawCube(matrixrighteye, [1, 1, 1, 1]);
  matrixlefteye = matrixrighteye;
  matrixlefteye.translate(-1.4, 0, 0);
  drawCube(matrixlefteye, [1, 1, 1, 1]);

  //main eye pupils
  matrixrightpupil = matrixlefteye;
  matrixrightpupil.translate(.13, .13, -.3);
  matrixrightpupil.scale(.7, .7, 1);
  drawCube(matrixrightpupil, [.45, .95, .98, 1]);
  matrixleftpupil = matrixrightpupil;
  matrixleftpupil.translate(2, 0, 0);
  drawCube(matrixleftpupil, [.45, .95, .98, 1]);

  //pupisl fr this time
  matrixlefteyedot = matrixleftpupil;
  matrixlefteyedot.translate(.35, .35, -.3);
  matrixlefteyedot.scale(.4, .4, 1);
  drawCube(matrixlefteyedot, [0, 0, 0, 1]);
  matrixrighteyedot = matrixlefteyedot;
  matrixrighteyedot.translate(-5, 0, 0);
  drawCube(matrixrighteyedot, [0, 0, 0, 1])

  //draw the whites in his eyes
  matrixwhiteeyes = matrixrighteyedot
  matrixwhiteeyes.translate(0.0, .7, -.1);
  matrixwhiteeyes.scale(.4, .4, 1);
  drawCube(matrixwhiteeyes, [1, 1, 1, 1]);
  matrixwhiteeyes2 = matrixwhiteeyes;
  matrixwhiteeyes2.translate(12.3, 0, 0);
  drawCube(matrixwhiteeyes2, [1, 1, 1, 1]);

  //drawing the mouth
  matrixmouth = matrixwhiteeyes2;
  matrixmouth.translate(-12.5, -15, 0);
  matrixmouth.scale(15, 8, .3);
  drawCube(matrixmouth, [0, 0, 0, 1]);

  //drawing the teeth
  matrixtooth1 = matrixmouth;
  matrixtooth1.translate(.25, .6, 0);
  matrixtooth1.scale(.2, .5, -.3);
  drawCube(matrixtooth1, [1, 1, 1, 1]);
  matrixtooth2 = matrixtooth1;
  matrixtooth2.translate(1.6, 0, 0);
  drawCube(matrixtooth2, [1, 1, 1, 1]);

  //drawing spongebob pores
  pore1 = matrixtooth2;
  pore1.translate(3.5, 3.26, -52);
  pore1.scale(1, 1, 44);
  drawCube(pore1, [0, 0, 0, 1]);
  pore2 = pore1;
  pore2.translate(-.5, -5, 0);
  drawCube(pore2, [0, 0, 0, 1]);
  pore3 = pore2;
  pore3.translate(-7, -1, 0);
  drawCube(pore3, [0, 0, 0, 1]);
  pore4 = pore3;
  pore4.translate(-.5, 7, 0);
  drawCube(pore4, [0, 0, 0, 1]);
  pore5 = pore4;
  pore5.translate(-.5, -1, 0);
  pore5.scale(.5, .5, 1);
  drawCube(pore5, [0, 0, 0, 1]);
  pore6 = pore5;
  pore6.translate(0, -10, 0);
  drawCube(pore6, [0, 0, 0, 1]);
  pore7 = pore6;
  pore7.translate(15, -2, 0);
  drawCube(pore7, [0, 0, 0, 1]);

  //spongebob arm sleeves
  matrixLeftArm = new Matrix4();
  matrixLeftArm.translate(.45, -.2, -.15);
  matrixLeftArm.rotate(30, 0, 0, 1);
  matrixLeftArm.scale(0.15, .25, .2);
  matrixLeftArm.rotate(g_rightArmSlider, 1, 0, 0);

  //Same thing for the right arm
  matrixRightArm = new Matrix4();
  matrixRightArm.translate(-.57, -.12, -.15);
  matrixRightArm.rotate(-30, 0, 0, 1);
  matrixRightArm.scale(0.15, .25, .2);
  drawCube(matrixLeftArm, [1, 1, 1, 1]);

  //spongebob left arm sleeve
  matrixLeftArm.translate(.2, 0, .2)
  matrixLeftArm.scale(.6, -.6, .6);
  drawCube(matrixLeftArm, [1, 1, 0, 1]);

  //left forearm
  matrixLeftForearm = matrixLeftArm;
  matrixLeftForearm.translate(0, 1, 0);
  //if animating
  matrixLeftForearm.rotate(g_rightForearmSlider, 1, 0, 0);
  drawCube(matrixLeftForearm, [1, 1, 0, 1]);

  //draw the left hand
  matrixlefthand = matrixLeftForearm;
  matrixlefthand.translate(-.2, 1, 0);
  matrixlefthand.scale(1.3, .5, 1.3);
  drawCube(matrixlefthand, [1, 1, 0, 1]);

  //spongebob right arm sleeve
  matrixRightArm.rotate(g_leftArmSlider, 1, 0, 0);
  drawCube(matrixRightArm, [1, 1, 1, 1]);

  //spongebob right arm
  matrixRightArm.translate(.2, 0, .2)
  matrixRightArm.scale(.6, -.6, .6);
  drawCube(matrixRightArm, [1, 1, 0, 1]);

  //right forearm
  matrixRightForearm = matrixRightArm;
  matrixRightForearm.translate(0, 1, 0);
  matrixRightForearm.rotate(g_leftForearmSlider, 1, 0, 0);

  drawCube(matrixRightForearm, [1, 1, 0, 1]);

  //right hand
  matrixrighthand = matrixRightForearm;
  matrixrighthand.translate(-.2, 1, 0);
  matrixrighthand.scale(1.3, .5, 1.3);
  drawCube(matrixrighthand, [1, 1, 0, 1]);

  //draw his nose
  matrixNose = new Matrix4();
  matrixNose.translate(-.03, -.15, -.4);
  matrixNose.rotate(-40, 1, 0, 0);
  matrixNose.scale(.1, .1, .3);
  drawCube(matrixNose, [1, 1, 0, 1]);

  //draw his left leg sleeve
  leftLeg = new Matrix4();
  leftLeg.rotate(g_rightLegSlider, 1, 0, 0);
  leftLeg.translate(.11, -.4, 0.14);
  leftLeg.scale(.13, .13, .13);
  drawCube(leftLeg, [.58, .16, .09, 1]);

  //right leg sleeve
  rightLeg = new Matrix4();
  rightLeg.rotate(g_leftLegSlider, 1, 0, 0);
  rightLeg.translate(-.25, -.4, 0.14);
  rightLeg.scale(.13, .13, .13);
  drawCube(rightLeg, [.58, .16, .09, 1]);

  //left leg femur
  leftLeg1 = leftLeg;
  leftLeg1.translate(.1, -1, 0.1);
  leftLeg1.scale(.7, 2, .7);
  drawCube(leftLeg1, [1, 1, 0, 1]);

  //right leg femur
  rightLeg1 = rightLeg;
  rightLeg1.translate(.1, -1, 0.1);
  rightLeg1.scale(.7, 2, .7);
  drawCube(rightLeg1, [1, 1, 0, 1]);

  //left sock
  leftSock = leftLeg1;
  leftSock.setIdentity();
  leftSock.rotate(g_rightLegSlider, 1, 0, 0);
  leftSock.translate(.14, -.73, .15);
  leftSock.scale(.07, .2, .07);
  drawCube(leftSock, [1, 1, 1, 1]);

  //right sock
  rightSock = rightLeg1;
  rightSock.setIdentity();
  rightSock.rotate(g_leftLegSlider, 1, 0, 0);
  //rightSock.rotate(- g_leftLegSlider, 1, 0, 0);
  rightSock.translate(-.23, -.73, .15);
  rightSock.scale(.07, .2, .07);
  drawCube(rightSock, [1, 1, 1, 1]);

  //left foot
  leftFoot = leftSock;
  leftFoot.translate(0, -.4, -1);
  leftFoot.scale(1, .4, 2);
  drawCube(leftFoot, [0, 0, 0, 1]);

  //right foot
  rightFoot = rightSock;
  rightFoot.translate(0, -.4, -1);
  rightFoot.scale(1, .4, 2);
  drawCube(rightFoot, [0, 0, 0, 1]);
  //draw a floor
  // floor = new Matrix4();
  // floor.translate(-1, -.85, -1);
  // floor.scale(5, .01, 5);
  // drawCube(floor, [1, 1, 1, 1]);

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");


}


function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from html");
    return;
  }
  htmlElm.innerHTML = text;
}
//draw cube function lolz
function drawCube(M, color) {
  cube = new Cube();
  cube.color = color;
  cube.matrix = M;
  cube.render();
}


