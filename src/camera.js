import * as scene from "./scene.js";

var input = document.addEventListener('keydown', getInput);
function getInput(event){
    var keyCode = event.keyCode;

    // get looking vector
    var lookingVector = new THREE.Vector3(0, 0, -1);
    lookingVector.applyQuaternion(camera.quaternion);

    // get cube rotation
    var cubeRotation = cube.rotation;
    console.log(cubeRotation);


    console.log(keyCode);
    if (keyCode == 81) { // move left
        // cube.position.x += Math.sin(cubeRotation.y) * 0.1;
        // cube.position.y += Math.cos(cubeRotation.x) * 0.1;

        // rotate cube
        cube.rotation.y += 0.1;
    }
    if (keyCode == 68) { // move right
        // cube.position.x -= Math.sin(lookingVector.y) * 1;
        // camera.position.x -= Math.sin(lookingVector.y) * 1;

        // rotate cube
        cube.rotation.y -= 0.1;
    }
    if (keyCode == 90) { // move forward
        // move in direction of rotation
        cube.position.x -= Math.sin(cubeRotation.y) * 1;
        cube.position.z -= Math.cos(cubeRotation.y) * 1;

        camera.position.x -= Math.sin(cubeRotation.y) * 1;
        camera.position.z -= Math.cos(cubeRotation.y) * 1;
    }
    if (keyCode == 83) { // move backwards
    // move in direction of rotation

        cube.position.x += Math.sin(cubeRotation.y) * 1;
        cube.position.z += Math.cos(cubeRotation.y) * 1;

        camera.position.x += Math.sin(cubeRotation.y) * 1;
        camera.position.z += Math.cos(cubeRotation.y) * 1;
    }
    if (keyCode == 32) { // go up
        cube.position.y += 1;
    }
    if (keyCode == 17) { // go down
        cube.position.y -= 1;
    }
}