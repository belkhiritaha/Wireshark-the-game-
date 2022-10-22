/// <reference path="../typings/index.d.ts" />

var scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x404040));
// set scene color to dark blue
scene.background = new THREE.Color(0x13146e);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var clock = new THREE.Clock();
var delta = 0;
var elapsedTime = 0;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var material = new THREE.MeshBasicMaterial({ color: 0x606469, shininess: 0 });

var lookingVector = new THREE.Vector3(0, 0, -1);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 2;
controls.autoForward = true;
controls.dragToLook = true;

function loadObj(path) {
    return new Promise((resolve, reject) => {
        var loader = new THREE.OBJLoader();
        loader.load(path, (object) => {
            resolve(object);
        });
    });
}

function loadGLTF(path) {
    return new Promise((resolve, reject) => {
        var loader = new THREE.GLTFLoader();
        loader.load(path, (object) => {
            resolve(object);
        });
    });
}

console.log("loading shark");
const shark = await loadGLTF('../res/models/shark.glb');
console.log(shark);
// move shark up y axis
// shark.position.y = 2;
// add material to shark

scene.add(shark.scene);

shark.scene.rotation.y = Math.PI / 2;

function getInput() {
    var lookingVector = new THREE.Vector3(0, 0, -1);
    lookingVector.applyQuaternion(camera.quaternion);

    var cubeRotation = shark.scene.rotation;
    // cubeRotation.y += Math.PI/2;

    if (keyState[0] == 1) { // move left
        shark.scene.rotation.y += 0.01;
        camera.rotation.y += 0.01;
    }
    if (keyState[1] == 1) { // move forward
        if (shark.scene.rotation.x > - Math.PI / 4) {
            shark.scene.rotation.x -= 0.01;
            camera.rotation.x -= 0.01;
        }
    }
    if (keyState[2] == 1) { // move right
        shark.scene.rotation.y -= 0.01;
        camera.rotation.y -= 0.01;
    }
    if (keyState[3] == 1) { // move backwards
        if (shark.scene.rotation.x < Math.PI / 4) {
            shark.scene.rotation.x += 0.01;
            camera.rotation.x += 0.01;
        }
    }

    // console.log(shark.scene.rotation.y);

    // get vector from camera to shark
    var vector = new THREE.Vector3();
    vector.subVectors(shark.scene.position, camera.position);


    controls.target = shark.scene.position;
    controls.update();
}

var cubeRotation = shark.scene.rotation;
camera.position.x = shark.scene.position.x - Math.sin(cubeRotation.y / 100 % 10) * 15;
camera.position.z = shark.scene.position.z - Math.cos(cubeRotation.y / 100 % 10) * 15;
camera.position.y = shark.scene.position.y + 10;

const keyState = [0, 0, 0, 0, 0, 0];

function keyUpdate(event, value, keyState) {
    // console.log(event);
    var keyCode = event.keyCode;
    // console.log("key update " + value + " " + keyCode);
    if (keyCode == 81) { // move left
        keyState[0] = value;
    }
    if (keyCode == 90) { // move forward
        keyState[1] = value;
    }
    if (keyCode == 68) { // move right
        keyState[2] = value;
    }
    if (keyCode == 83) { // move backwards
        keyState[3] = value;
    }
    if (keyCode == 32) { // go up
        keyState[4] = value;
    }
    if (keyCode == 16) { // go down
        keyState[5] = value;
    }
    getInput();
}

var inputDown = document.addEventListener('keydown', (event) => { keyUpdate(event, 1, keyState) });
var inputUp = document.addEventListener('keyup', (event) => { keyUpdate(event, 0, keyState) });

async function generateFish(n, x, y, z) {
    const fishList = [];
    for (var i = 0; i < n; i++) {
        const fish = await loadObj('../res/models/fish.obj');

        const randMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        // add material to fish
        fish.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = randMaterial;
            }
        });

        // scale down fish
        fish.scale.set(0.1, 0.1, 0.1);
        fish.position.x = x + Math.random() * 50;
        fish.position.z = y + Math.random() * 50;
        fish.position.y = z + Math.random() * 10;
        scene.add(fish);
        fishList.push(fish);
    }
    return new Promise((resolve, reject) => {
        resolve(fishList);
    });
}

let fishList = await generateFish(10, 0, 50, 0);
let fishList2 = await generateFish(20, 50, 80, 44);


function generatePath() {
    var path = function (fish, t) {
        var x = fish.position.x + 0.3 * Math.sin(4 * Math.PI * t) * Math.cos(Math.PI * t);
        var y = 0;
        var z = fish.position.z + 1 * Math.sin(9 * Math.PI * t) * Math.cos(3 * Math.PI * t);

        return new THREE.Vector3(x, y, z);
    }
    return path;
}


function generateCube(x, y) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = 0;
    scene.add(cube);
}

function generatePlane(width, height, color) {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: color });
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = i * 5;
            cube.position.y = Math.cos(i) * 5;
            cube.position.z = j * 5;
            scene.add(cube);
        }
    }
}

// generatePlane(100, 100, 0x00ff00);


function update() {
    let itteration = 0;
    requestAnimationFrame(update);
    getInput();

    delta = clock.getDelta();
    // console.log(delta);
    elapsedTime += delta;

    let path = generatePath();

    // move fish
    fishList.forEach(fish => {
        fish.position.x = path(fish, elapsedTime / 1000).x;
        fish.position.z = path(fish, elapsedTime / 1000).z;
        fish.position.y = path(fish, elapsedTime / 1000).y;
    });

    fishList2.forEach(fish => {
        fish.position.x = path(fish, elapsedTime / 1000).x;
        fish.position.z = path(fish, elapsedTime / 1000).z;
        fish.position.y = path(fish, elapsedTime / 1000).y;
    }

    );

    renderer.render(scene, camera);
    itteration++;
    // console.log(elapsedTime);
    shark.scene.position.x -= Math.sin(cubeRotation.y + Math.PI / 2 % 10) * 0.5;
    shark.scene.position.z -= Math.cos(cubeRotation.y + Math.PI / 2 % 10) * 0.5;
    shark.scene.position.y -= Math.sin(cubeRotation.x % 10) * 0.5;

    camera.position.x -= Math.sin(cubeRotation.y + Math.PI / 2 % 10) * 0.5;
    camera.position.z -= Math.cos(cubeRotation.y + Math.PI / 2 % 10) * 0.5;
};


update();

// renderer.render( scene, camera );
// animate();