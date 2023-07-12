class Cube {
    constructor() {
        this.type = "cube"
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        //this.segments = g_numSegs;
        this.matrix = new Matrix4();
        this.textureNum = -2;
        //for render faster
        this.verts = new Float32Array([
            0, 0, 0, 1, 1, 0, 1, 0, 0,
            0, 0, 0, 0, 1, 0, 1, 1, 0,
            0, 1, 0, 0, 1, 1, 1, 1, 1,
            0, 1, 0, 1, 1, 1, 1, 1, 0,
            1, 1, 0, 1, 1, 1, 1, 0, 0,
            1, 0, 0, 1, 1, 1, 1, 0, 1,
            0, 1, 0, 0, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 1, 1, 0, 0, 1,
            0, 0, 0, 0, 0, 1, 1, 0, 1,
            0, 0, 0, 1, 0, 1, 1, 0, 0,
            0, 0, 1, 1, 1, 1, 1, 0, 1,
            0, 0, 1, 0, 1, 1, 1, 1, 1
        ]);

    }
    render() {
        var rgba = this.color;
        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass color in
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //Pass the matrix from u_ModelMatrix Attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


        //front of cube
        drawTriangles3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
        drawTriangles3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);
        // drawTriangles3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
        //drawTriangles3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);


        //pass in different color
        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
        //back of cube
        // drawTriangles3D([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
        // drawTriangles3D([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
        drawTriangles3DUV([0, 0, 1, 1, 1, 1, 1, 0, 1], [1, 0, 0, 1, 0, 0]);
        drawTriangles3DUV([0, 0, 1, 0, 1, 1, 1, 1, 1], [1, 0, 1, 1, 0, 1]);

        //top of cube
        // drawTriangles3D([0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
        // drawTriangles3D([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0]);
        drawTriangles3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
        drawTriangles3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);

        //side of cube (left)
        // drawTriangles3D([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0]);
        // drawTriangles3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
        drawTriangles3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [1, 0, 0, 1, 1, 1]);
        drawTriangles3DUV([0, 0, 0, 0, 1, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0]);
        //side of cube(right)
        // drawTriangles3D([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
        // drawTriangles3D([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
        drawTriangles3DUV([1, 0, 0, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0]);
        drawTriangles3DUV([1, 0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 0, 1]);

        //bottom of the cube
        // drawTriangles3D([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
        // drawTriangles3D([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0]);
        drawTriangles3DUV([0, 0, 0, 1, 0, 0, 1, 0, 1], [1, 0, 0, 0, 0, 1]);
        drawTriangles3DUV([0, 0, 0, 1, 0, 1, 0, 0, 1], [1, 0, 0, 1, 1, 1]);
        //gl.drawArrays(gl.POINTS, 0, 1);
    }
    renderFast() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];


        // Front of cube
        allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);

        // Top of cube
        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
        allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);

        // Right of cube
        allverts = allverts.concat([1, 1, 0, 1, 1, 1, 1, 0, 0]);
        allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 0, 1]);

        // Left of cube
        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 0, 0, 0]);
        allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 0, 1]);

        // Bottom of cube
        allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
        allverts = allverts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]);

        // Back of cube
        allverts = allverts.concat([0, 0, 1, 1, 1, 1, 1, 0, 1]);
        allverts = allverts.concat([0, 0, 1, 0, 1, 1, 1, 1, 1]);

        drawTriangles3D(allverts);
    }
}