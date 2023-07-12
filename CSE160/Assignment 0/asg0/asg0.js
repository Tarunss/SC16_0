//asgn0.js
function main() {
    //get canvas element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve canvas element');
        return false;
    }
    //Get rendering context
    var ctx = canvas.getContext('2d');
    //part 1
    // let v1 = new Vector3([2.25, 2.25, 0]);
    // drawVector(v1, "red", ctx);
    //if draw is clicked, call handleDrawEvent (part 2)
    document.getElementById("draw").onclick = function () {
        handleDrawEvent(ctx);
    }
    //same thing for option
    document.getElementById("draw2").onclick = function () {
        handleDrawOperationEvent(ctx);
    }

}

function drawVector(vec, color, ctx) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    let x = (vec.elements[0] * 20) + 200;
    let y = 200 - (vec.elements[1] * 20);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function handleDrawEvent(ctx) {
    //clear the canvas
    ctx.clearRect(0, 0, 400, 400);
    //get values of vector
    let x1 = document.getElementById("v1.x").value;
    let y1 = document.getElementById("v1.y").value;
    let x2 = document.getElementById("v2.x").value;
    let y2 = document.getElementById("v2.y").value;
    //make the new vectors
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);
    //call draw
    drawVector(v1, "red", ctx);
    drawVector(v2, "blue", ctx);
}

function angleBetween(v1, v2) {
    var angle = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()));
    //in radians, we need degrees
    angle = angle * (180 / Math.PI);
    return angle;
}
function areaTriangle(v1, v2) {
    var v3 = Vector3.cross(v1, v2);
    var t = (v3.magnitude() / 2);
    return t;
}
function handleDrawOperationEvent(ctx) {
    //get all information needed first
    //clear the canvas
    ctx.clearRect(0, 0, 400, 400);
    //get values of vector
    let x1 = document.getElementById("v1.x").value;
    let y1 = document.getElementById("v1.y").value;
    let x2 = document.getElementById("v2.x").value;
    let y2 = document.getElementById("v2.y").value;
    //make the new vectors
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);
    //call draw
    drawVector(v1, "red", ctx);
    drawVector(v2, "blue", ctx);
    //now, draw vector based on selection
    let operation = document.getElementById("Operation").value;
    let scalar = document.getElementById("scalar").value;
    //check which operation matches
    if (operation == "add") {
        let v3 = v1.add(v2);
        drawVector(v3, "green", ctx);
    }
    else if (operation == "sub") {
        let v3 = v1.sub(v2);
        drawVector(v3, "green", ctx);
    }
    else if (operation == "mul") {
        let v3 = v1.mul(scalar);
        let v4 = v2.mul(scalar);
        drawVector(v3, "green", ctx);
        drawVector(v4, "green", ctx);
    }
    else if (operation == "div") {
        let v3 = v1.div(scalar);
        let v4 = v2.div(scalar);
        drawVector(v3, "green", ctx);
        drawVector(v4, "green", ctx);
    }
    else if (operation == "magnitude") {
        console.log("Magnitude v1: ", v1.magnitude());
        console.log("Magnitude v2: ", v2.magnitude());
    }
    else if (operation == "normalize") {
        let v3 = v1.normalize();
        let v4 = v2.normalize();
        drawVector(v3, "green", ctx);
        drawVector(v4, "green", ctx);
    }
    else if (operation == "angle") {
        console.log("Angle: ", angleBetween(v1, v2));
    }
    else if (operation == "area") {
        console.log("Area of the triangle: ", areaTriangle(v1, v2));
    }
}