// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec4 v_VertPos;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position; 
  }`
// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos; 
  uniform vec4 u_FragColor;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos; 
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
uniform sampler2D u_Sampler3;
uniform int u_whichTexture;
uniform bool u_lightOn;
void main() {
  if (u_whichTexture == -3) {
    gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
  }
  else if (u_whichTexture == -2) {
    gl_FragColor = u_FragColor;
  }
  else if (u_whichTexture == -1) {
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
  }
  else if (u_whichTexture == 0) {
    gl_FragColor = texture2D(u_Sampler0, v_UV);
  }
  else if (u_whichTexture == 1) {
    gl_FragColor = texture2D(u_Sampler1, v_UV);
  }
  else if (u_whichTexture == 2) {
    gl_FragColor = texture2D(u_Sampler2, v_UV);
  }
  else if (u_whichTexture == 3) {
    gl_FragColor = texture2D(u_Sampler3, v_UV);
  }
  else {
    gl_FragColor = vec4(1, 0.2, 0.2, 1);
  }

  vec3 lightVector = u_lightPos - vec3(v_VertPos); 
  float r = length(lightVector);

  // N dot L
  vec3 L = normalize(lightVector);
  vec3 N = normalize(v_Normal);
  float nDotL = max(dot(N, L), 0.0);

  // Reflection
  vec3 R = reflect(-L, N);

  // eye
  vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

  // Specular
  float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;

  vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;
  vec3 ambient = vec3(gl_FragColor) * 0.2;
  if (u_lightOn) {
    if (u_whichTexture == 0) {
      gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
    }
    else {
      gl_FragColor = vec4(diffuse + ambient, 1.0);
    }
  }
}`
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ProjectionMatrix;
let u_ModelMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_lightPos;
let u_cameraPos;
let u_lightOn;


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
  //new connections
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  // Get normal attribute
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (u_whichTexture < 0) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  //Samplers
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

//global variables for UI
let g_globalAngleX = 5;
let g_globalAngleY = 0;
let g_rightArmSlider = 0;
let g_rightForearmSlider = 0;
let g_leftArmSlider = 0;
let g_leftForearmSlider = 0;
let g_rightLegSlider = 0;
let g_leftLegSlider = 0;
let g_animation = 0;
let g_normal = false;

let g_lightPos = [0, 1, -2];
let g_lightOn = false;

function addActionsForHtmlUI() {
  //actions for buttons
  // Normal On/Off
  document.getElementById("normalOn").onclick = function () { g_normal = true; };
  document.getElementById("normalOff").onclick = function () { g_normal = false; };

  //control lights
  document.getElementById("lightSlideX").addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightPos[0] = this.value / 100; renderAllShapes(); } });
  document.getElementById("lightSlideY").addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightPos[1] = this.value / 100; renderAllShapes(); } });
  document.getElementById("lightSlideZ").addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightPos[2] = this.value / 100; renderAllShapes(); } });
  // Light On/Off
  document.getElementById("lightOn").onclick = function () { g_lightOn = true; };
  document.getElementById("lightOff").onclick = function () { g_lightOn = false; };
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
function initTextures() {
  //get the image of u_sampler
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  var image1 = new Image();
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  var image3 = new Image();
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function () { sendImageToTEXTURE0(image); };
  image.src = 'sky.jpg'

  image1.onload = function () { sendImageToTEXTURE1(image1); };
  image1.src = 'pineapple.jpg';

  image2.onload = function () { sendImageToTEXTURE2(image2); };
  image2.src = 'squidward_texture.jpg';

  image3.onload = function () { sendImageToTEXTURE3(image3); };
  image3.src = 'leaf_512x512.jpeg';
  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0, 0);

  console.log('Finished loadTexture0');
}
function sendImageToTEXTURE1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1, 1);

  console.log('Finished loadTexture1');
}

function sendImageToTEXTURE2(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE2);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler2, 2);

  console.log('Finished loadTexture2');
}

function sendImageToTEXTURE3(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE3);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler3, 3);

  console.log('Finished loadTexture3');
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

  //keyboard functionality
  document.onkeydown = keydown;
  initTextures();
  // Specify the color for clearing <canvas>
  gl.clearColor(1, 0.6, 0.06, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}
//let g_camera = new Camera();
function click(ev) {
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // // Clear <canvas>
  gl.clear(gl.DEPTH_BUFFER_BIT);

  renderAllShapes();
}
var g_map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1
  [0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//2
  [0, 4, 5, 5, 5, 5, 4, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//3
  [0, 4, 5, 6, 6, 5, 4, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//4
  [0, 4, 5, 6, 6, 5, 4, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//5
  [0, 4, 5, 5, 5, 5, 4, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//6
  [0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//7
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//8
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//9
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//10
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//11
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//12
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//13
  [5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//14
  [5, 6, 6, 6, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//15
  [5, 6, 6, 6, 6, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//16
  [5, 6, 6, 6, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//17
  [5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//18
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//19
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//20
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//21
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//22
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//23
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//24
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//25
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//26
  [0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//27
  [1, 2, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//28
  [1, 2, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//29
  [1, 2, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//30
  [0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//31
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]//32
];



function drawMap() {
  //var map = new Cube();
  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      if (g_map[x][y] <= 4) {
        //if its less than 3, its a wall
        for (i = 0; i < g_map[x][y]; i++) {
          var map = new Cube();
          map.color = [0.36, 0.64, 0.33, 1];
          map.textureNum = 1;
          map.matrix.translate(x - 4, i - 0.75, y - 4);
          map.render();
        }
        //else its a roof
      }
      else if (g_map[x][y] == 6) {
        for (i = 0; i < 3; i++) {
          var map = new Cube();
          //map.color = [0.36, 0.64, 0.33, 1];
          map.textureNum = 3;
          map.matrix.translate(x - 4, g_map[x][y] - 1.75, y - 4);
          map.render();
          map.matrix.translate(0, 0.75, 0);
          map.render();
        }
      }
      else {
        var map = new Cube();
        map.color = [0.36, 0.64, 0.33, 1];
        map.textureNum = 1;
        map.matrix.translate(x - 4, g_map[x][y] - 1.75, y - 4);
        map.render();
      }
    }
  }
  //Draw squidward's house
  for (x = 12; x < 20; x++) {
    for (y = 0; y < 8; y++) {
      //if 5, its a wall
      if (g_map[x][y] == 5) {
        for (i = 0; i < 6; i++) {
          var map = new Cube();
          //map.color = [0.36, 0.64, 0.33, 1];
          map.textureNum = 2;
          map.matrix.translate(x - 4, i - 0.75, y - 4);
          map.render();
        }
      }
      else if (g_map[x][y] == 1) {
        //draw nose and eyes of house
        var map = new Cube();
        map.color = [0, 0, 0, 1];
        map.textureNum = -2;
        map.matrix.translate(x - 4, (3 * 0.75), y - 4);
        map.render();
        map.matrix.translate(0, -(.75), 0);
        map.render();
      }
    }
  }
  //Draw Patrick's house
  for (x = 25; x < 32; x++) {
    for (y = 0; y < 8; y++) {
      if (g_map[x][y] >= 1) {
        var map = new Cube();
        map.color = [0.588, 0.294, 0, 1];
        map.textureNum = -2;
        map.matrix.translate(x - 4, g_map[x][y] - 1.75, y - 4);
        map.render();
      }
    }
  }
}
let g_camera = new Camera();
//keydown function for camera
function keydown(ev) {
  if (ev.keyCode == 87) { // W
    g_camera.moveForward();
  }
  else if (ev.keyCode == 65) { // A
    g_camera.moveLeft();
  }
  else if (ev.keyCode == 83) { // S
    g_camera.moveBackward();
  }
  else if (ev.keyCode == 68) { // D
    g_camera.moveRight();
  }
  else if (ev.keyCode == 81) { // Q
    g_camera.panLeft();
  }
  else if (ev.keyCode == 69) { // E
    g_camera.panRight();
  }

  renderAllShapes();
  console.log(ev.keyCode);
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
  g_lightPos[0] = 2 * Math.cos(g_seconds);
}
// Clear <canvas>
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  var startTime = performance.now();
  //projection/view matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width / canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  //need to set the lookAt matrix to our camera
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


  //global matrix
  var globalRotMatrix = new Matrix4().rotate(g_globalAngleX, 0, 1, 0);
  globalRotMatrix.rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);
  // Clear Canvas


  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  gl.uniform1i(u_lightOn, g_lightOn);
  //DRAW STUFF

  // Draw light
  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();
  //draw the sky
  var sky = new Cube();
  sky.color = [0.6, 0.8, 1, 1];
  if (g_normal) {
    sky.textureNum = -3;
  } else {
    sky.textureNum = 0;
  }
  sky.matrix.scale(-10, -10, -10);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();
  //draw the sphere
  var sphere = new Sphere();
  sphere.matrix.scale(0.75, 0.75, 0.75);
  if (g_normal) {
    sphere.textureNum = -3;
  }
  sphere.matrix.translate(-2, 0, 0);
  sphere.render();

  // Draw the floor
  var floor = new Cube();
  floor.color = [.36, .64, .33, 1];
  floor.textureNum = 2;
  floor.matrix.translate(0, -.75, 0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-.5, 0, -.5);
  floor.render();
  //spongebob body
  //matrix for all body parts that will be tilted
  matrixBody = new Matrix4();
  matrixBody.translate(-.4, -0.2, 0.0);
  matrixBody.rotate(-40, 1, 0, 0);
  matrixBody.scale(.8, 0.8, 0.3);
  //main body (head structure)
  drawCube(matrixBody, [1.0, 1.0, 0.0, 1.0]);

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

  //drawMap();
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
  if (g_normal) {
    cube.textureNum = -3;
  } else {
    cube.textureNum = -2;
  }
  cube.color = color;
  cube.matrix = M;
  cube.render();
}


