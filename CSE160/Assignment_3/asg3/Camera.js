class Camera {
    //constructor
    constructor() {
        this.eye = new Vector3([0, 0, 2.]);
        this.at = new Vector3([0, 0, -1000]);
        this.up = new Vector3([0, 1, 0]);
        this.fov = 60.0;
        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // this.projMat = new Matrix4();
        // this.projMat.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }
    //functions

    //moveForward
    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        //add to both eye and at
        this.eye.add(f);
        this.at.add(f);
    }
    //moveBackward
    moveBackward() {
        var b = new Vector3();
        b.set(this.at);
        b.sub(this.eye);
        b.normalize();
        //add to both eye and at
        this.eye.sub(b);
        this.at.sub(b);
    }
    moveLeft() {
        var l = new Vector3();
        l.set(this.at);
        l.sub(this.eye);
        l.normalize();
        l = Vector3.cross(l, this.up);
        l.normalize();
        this.at.sub(l);
        this.eye.sub(l);
    }
    moveRight() {
        var r = new Vector3();
        r.set(this.at);
        r.sub(this.eye);
        r.normalize();
        r = Vector3.cross(r, this.up);
        r.normalize();
        this.at.add(r);
        this.eye.add(r);
    }
    //panning
    //panLeft
    panLeft() {
        var f = new Vector3;
        f.set(this.at);

        // f.sub(this.eye);
        // f.normalize();

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        // var eye = this.eye.add(f_prime);
        // this.at = eye;

        var eye = new Vector3;
        eye.set(this.eye);
        this.at = eye.add(f_prime);
    }
    //panRight
    panRight() {
        var f = new Vector3;
        f.set(this.at);
        // f.sub(this.eye);
        // f.normalize();

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        // var eye = this.eye.add(f_prime);
        // this.at = eye;

        var eye = new Vector3;
        eye.set(this.eye);
        this.at = eye.add(f_prime);
    }
}