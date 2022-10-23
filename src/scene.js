var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var clock = new THREE.Clock();
var delta = 0;
var elapsedTime = 0;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var lookingVector = new THREE.Vector3(0, 0, -1);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.movementSpeed = 100;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;


camera.position.z = 5;
var input = document.addEventListener('keydown', getInput);

function getInput(event){
    var keyCode = event.keyCode;

    // get looking vector
    var lookingVector = new THREE.Vector3(0, 0, -1);
    lookingVector.applyQuaternion(camera.quaternion);

    // get cube rotation
    var cubeRotation = cube.rotation;


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
        cube.position.x += Math.sin(cubeRotation.y % 10) * 1;
        cube.position.z += Math.cos(cubeRotation.y % 10) * 1;

        camera.position.x += Math.sin(cubeRotation.y % 10) * 1;
        camera.position.z += Math.cos(cubeRotation.y % 10) * 1;
    }
    if (keyCode == 83) { // move backwards
    // move in direction of rotation

        cube.position.x -= Math.sin(cubeRotation.y % 10) * 1;
        cube.position.z -= Math.cos(cubeRotation.y % 10) * 1;

        camera.position.x -= Math.sin(cubeRotation.y % 10) * 1;
        camera.position.z -= Math.cos(cubeRotation.y % 10) * 1;
    }
    if (keyCode == 32) { // go up
        cube.position.y += 1;

        cube.rotation
    }
    if (keyCode == 17) { // go down
        cube.position.y -= 1;
    }

    // move camera 2 units behind cube
    camera.position.x = cube.position.x - Math.sin(cubeRotation.y % 10) * 10;
    camera.position.z = cube.position.z - Math.cos(cubeRotation.y % 10) * 10;
    camera.position.y = cube.position.y + 5;


    controls.target = cube.position;
    controls.update();
}

function createPlane() {
    var geometry = new THREE.PlaneGeometryBufferGeometry( 2000, 2000, 256, 256 );
    var material = new THREE.MeshLambertMaterial( { color: 0x3c3951 } );
    var terrain = new THREE.Mesh(geometry, material);

    // make plane hoirzontal
    plane.rotation.x = 1.57;

    return plane;
}


var plane = createPlane();
scene.add(plane);


async function generateFish(n) {
    return new Promise((resolve, reject) => {
        const fishList = [];
        for (var i = 0; i < n; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            var fish = new THREE.Mesh( geometry, material );
            fish.position.x = Math.random() * 100;
            fish.position.z = Math.random() * 100;
            fish.position.y = Math.random() * 10;
            scene.add( fish );
            fishList.push(fish);
        }
        resolve(fishList);
    });
}

let fishList = await generateFish(10);


function generatePath() {
    var path = function ( fish, t ) {
        var x = fish.position.x + 0.3 * Math.sin( 4 * Math.PI * t ) * Math.cos( 2 * Math.PI * t );
        var y = 0;
        var z = fish.position.z + 1 * Math.sin( 9 * Math.PI * t ) * Math.cos( 3 * Math.PI * t );

        return new THREE.Vector3( x, y, z );
    }
    return path;
}




function update () {
    let itteration = 0;
    requestAnimationFrame( update );

    delta = clock.getDelta();
    // console.log(delta);
    elapsedTime += delta;

    // calculate vector from camera to cube

    controls.target = cube.position;
    controls.update();

    let path = generatePath();

    // move fish
    fishList.forEach(fish => {
        fish.position.x = path(fish, elapsedTime/100).x;
        fish.position.z = path(fish, elapsedTime/100).z;
        fish.position.y = path(fish, elapsedTime/100).y;
    });

    renderer.render( scene, camera );
    itteration++;
    // console.log(elapsedTime);
};


update();

// renderer.render( scene, camera );
// animate();