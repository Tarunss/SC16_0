class Circle {
    constructor() {
        this.type = "circle"
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = g_numSegs;
    }
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        // Pass color in
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        var d = this.size / 200.0;
        let angleStep = 360 / this.segments;
        for (var angle = 0; angle < 360; angle = angle + angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d];
            let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d];
            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
            drawTriangles3D([xy[0], xy[1], 0, pt1[0], pt1[1], 0, pt2[0], pt2[1], 0]);

        }
        //gl.drawArrays(gl.POINTS, 0, 1);
    }
}