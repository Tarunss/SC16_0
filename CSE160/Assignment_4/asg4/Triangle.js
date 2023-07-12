class Triangle {
    constructor() {
        this.type = "triangle"
        this.position = [0.0, 0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        // Pass the size of a point to u_Size variable
        //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the position of a point to a_Position variable
        gl.uniform1f(u_Size, size);
        // Draw
        var d = this.size / 200.0; //delta
        drawTriangles([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
    }
}
function drawTriangles(vertices) {

    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    // Draw Triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
}
var g_vertexBuffer = null;

function intitialize3D() {
    g_vertexBuffer = gl.createBuffer();
    if (!g_vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

}
function drawTriangles3D(vertices) {

    var n = vertices.length / 3; // The number of vertices (depends)
    // Create a buffer object
    if (g_vertexBuffer == null) {
        intitialize3D();
    }

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // Draw Triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
function drawTriangles3DUV(vertices, uv) {
    //Vertices buffer
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);


    // UV buffer
    // Create a buffer object
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log('Failed to create the uvbuffer object');
        return -1;
    }
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    g_vertexBuffer = null; //null buffer after call
}

function drawTriangles3DUVNormal(vertices, uv, normals) {
    //Vertices buffer
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);


    // UV buffer
    // Create a buffer object
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log('Failed to create the uvbuffer object');
        return -1;
    }
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);

    //normal buffer
    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    g_vertexBuffer = null; //null buffer after call
}