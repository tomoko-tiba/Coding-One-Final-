import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as CANNON from 'cannon-es'
import { Vec3 }  from 'cannon-es'
import * as dat from 'dat.gui'

/**
 * debug
 */
 const gui = new dat.GUI();
 const debugObj = {};
 
 debugObj.createSphere=()=>{
	let count = Math.round(Math.random()*15)+ 1;
	for(let i = 0; i < count; i ++){
		createSphere(
			Math.random()*0.4, 
			{x: (Math.random()-0.5)*3, y: 3.5, z: (Math.random()-0.5)*3});
	}
 }
 
 gui.add(debugObj, 'createSphere');


let width = window.innerWidth;
let height = window.innerHeight;

//three.js scene
const scene = new THREE.Scene();

/**
 * sound
 */
 const hitSound = new Audio('./sounds/click.flac');

 const playHitSound = () => {
	hitSound.volume = Math.random() + 0.05;
	hitSound.currentTime = 0;
	hitSound.play();

 }
 
//camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); //焦距，画面比例, 
scene.add(camera);
camera.position.z = 3;

/**
* Mouse
*/
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => 
{
mouse.x = event.clientX / width * 2 - 1;
mouse.y = - (event.clientY / height) * 2 + 1;
})
/**
 * textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./textures/matcap/green.png');

const cubeTextureLoader = new THREE.CubeTextureLoader();

// Environment map
const environmentMap = cubeTextureLoader.load([
	'/textures/environment/px.png',
	'/textures/environment/nx.png',
	'/textures/environment/py.png',
	'/textures/environment/ny.png',
	'/textures/environment/pz.png',
	'/textures/environment/nz.png'
	]);

//scene.background = environmentMap;
/**
 * fonts
 */
const fontLoader = new FontLoader();

const textShapeToUpdate = [];
const textToUpdate = [];

function loadText(position){
		
	fontLoader.load(
		'./font/Planet Kosmos.json',
		(font) => {
			const textInfo = {
				font: font,
				size: 0.5,
				height: 0.3,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 5
			};

			const textGeometry = new TextGeometry('\' Hello', textInfo);
			const textGeometry2 = new TextGeometry('World \'', textInfo);
			const textGeometry3 = new TextGeometry('from', textInfo);
			const textGeometry4 = new TextGeometry('yenny', textInfo);

			textGeometry.center();
			textGeometry2.center();
			textGeometry3.center();
			textGeometry4.center();

			const textMaterial = new THREE.MeshMatcapMaterial({ matcap : matcapTexture });
			let zMove = 0;
			const text = new THREE.Mesh(textGeometry, textMaterial);
			const text2 = new THREE.Mesh(textGeometry2, textMaterial);
			const text3 = new THREE.Mesh(textGeometry3, textMaterial);
			const text4 = new THREE.Mesh(textGeometry4, textMaterial);
			text.position.set(position.x, position.y+1.2 + zMove, position.z);
			text2.position.set( position.x, position.y+0.43 + zMove, position.z);
			text3.position.set( position.x, position.y-0.43 + zMove, position.z);
			text4.position.set( position.x, position.y-1.3 + zMove, position.z);
			scene.add(text, text2, text3, text4);
			//1
			createTextBody({x: 2.5, y: 0.4, z: 0.3}, {x : position.x + 0.2 , y:  position.y+1.1, z: position.z});
			createTextBody({x: 0.8, y: 0.4, z: 0.3}, {x : position.x - 1 , y:  position.y+1.3, z: position.z});
			createTextBody({x: 0.5, y: 0.4, z: 0.3}, {x : position.x + 0.6 , y:  position.y+1.3, z: position.z});
			//2
			createTextBody({x: 1.5, y: 0.6, z: 0.3}, {x : position.x +1, y:  position.y+0.43, z: position.z});
			createTextBody({x: 2, y: 0.4, z: 0.3}, {x : position.x - 0.8, y:  position.y+0.3, z: position.z});
			//3
			createTextBody({x: 2.3, y: 0.4, z: 0.3}, {x : position.x+0.1 , y:  position.y-0.43, z: position.z});
			createTextBody({x: 0.5, y: 0.7, z: 0.3}, {x : position.x-1 , y:  position.y-0.43, z: position.z});
			//4
			createTextBody({x: 3, y: 0.4, z: 0.3}, {x : position.x , y:  position.y-1.15, z: position.z});
			createTextBody({x: 0.3, y: 0.7, z: 0.3}, {x : position.x-1.1 , y:  position.y-1.3, z: position.z});
			createTextBody({x: 0.3, y: 0.7, z: 0.3}, {x : position.x+1.15 , y:  position.y-1.3, z: position.z});
			
			textShapeToUpdate.push({mesh : text});
			textShapeToUpdate.push({mesh : text2});
			textShapeToUpdate.push({mesh : text3});
			textShapeToUpdate.push({mesh : text4});

		}
	);
}
let positionText = {x: 0, y:0, z: 0};
loadText({x: 0, y:0, z: 0});

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const textMaterial = new THREE.MeshStandardMaterial({
	color : 'white',
	transparent : true,
	opacity : 0.0
	//metalness : 0.4
})

function createTextBody(size, position){
	//three.js mesh
	const mesh = new THREE.Mesh(boxGeo, textMaterial);
	mesh.scale.set(size.x, size.y, size.z);
	mesh.position.copy(position);
	scene.add(mesh);
	
	//Cannon js body
	const shape = new CANNON.Box(new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5 ));
	const body = new CANNON.Body({
		mass : 0,
		position : new Vec3(0, 0, 0),
		shape,
		material : defualtMaterial
	});
	body.position.copy(position);
	//body.addEventListener('collide', playHitSound);
	world.addBody(body);

	//what need to be updated
	textToUpdate.push({
		mesh : mesh,
		body : body
	});
}

/**
 * cannon physics world
 */

 //world
 const world = new CANNON.World();
 world.broadphase = new CANNON.SAPBroadphase(world);
 world.allowSleep = true;
 world.gravity.set(0, -9.82, 0);

 let size = 4.5;

//material
const defualtMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
	defualtMaterial,
	defualtMaterial,
	{
		friction : 0.1,
		restitution : 0.75
	}
)

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

const planeGeo = new THREE.PlaneGeometry(size, size);
const planeMaterial = new THREE.MeshBasicMaterial({
	color : '#006400',
	transparent : true,
	opacity : 0.1
	//metalness : 0.4
})

function createBound(direction, rotation, position){

	//cannon
	const planeShape = new CANNON.Plane();
	const planeBody = new CANNON.Body({
		mass: 0,
		shape: planeShape,
		material: defualtMaterial,
	});
	planeBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(direction.x, direction.y, direction.z),  //1. 0. 0
		rotation,//-Math.PI * 0.5
	);
	planeBody.position.set(position.x, position.y, position.z );
	world.addBody(planeBody);

	//three mesh
	const plane = new THREE.Mesh(
		planeGeo,
		planeMaterial
	);
	//plane.rotation.set(rotation2.x, rotation.y, rotation.z);
	plane.quaternion.copy(planeBody.quaternion);
	plane.position.set(position.x, position.y, position.z);
	plane.receiveShadow = true;
	scene.add(plane);
}
//botton
createBound(
	{x: 1, y: 0, z:0},
	-Math.PI * 0.5,
	{x: 0, y: -size * 0.5, z:0}
	);

//top
createBound(
	{x: 1, y: 0, z:0},
	Math.PI * 0.5,
	{x: 0, y: size * 0.5, z:0}
	);

//left
createBound(
	{x: 0, y: 1, z:0},
	Math.PI * 0.5,
	{x:  -size * 0.5, y: 0, z:0}
	);

//right
createBound(
	{x: 0, y: 1, z:0},
	-Math.PI * 0.5,
	{x:  size * 0.5, y: 0, z:0}
	);

//behind
createBound(
	{x: 0, y: 0, z:0},
	0,
	{x: 0, y: 0, z: -size * 0.5}
	);

//font
createBound(
	{x: 0, y: 1, z:0},
	-Math.PI,
	{x: 0, y: 0, z: size * 0.5}
	);


const objToUpdate = [];
const objectsToTest = [];

const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
const sphereMat = new THREE.MeshStandardMaterial({
	color : 'white',
	roughness : 0.5,
	envMap: environmentMap,
	envMapIntensity: 0.5,
	metalness : 0.2
})

const createSphere = (radius, position) => {
	//three.js mesh
	const mesh = new THREE.Mesh(sphereGeo, sphereMat);
	mesh.scale.set(radius, radius, radius);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);
	objectsToTest.push(mesh);
	
	//Cannon js body
	const sphereShape = new CANNON.Sphere(radius);
	const sphereBody = new CANNON.Body({
		mass : 1,
		position : new Vec3(0, 4, 0),
		shape : sphereShape,
		material : defualtMaterial
	});
	sphereBody.position.copy(position);
	//sphereBody.addEventListener('collide', playHitSound);
	world.addBody(sphereBody);

	//what need to be updated
	objToUpdate.push({
		mesh : mesh,
		body : sphereBody
	});
}

for(let i = 0; i < 45; i ++){
	createSphere(
		Math.random()*0.4, 
		{x: (Math.random()-0.5)*3, y: 3.5, z: (Math.random()-0.5)*3});
}

/**
 * Geometry
 */
//cube matrix
const cubeGeo = new THREE.BoxGeometry(size, size, size);
const sphereGeoC = new THREE.SphereGeometry(size*0.01, 32, 16);
const cubeMaterial = new THREE.MeshBasicMaterial({ color : '#006400', wireframe: true});
const sphereMat2 = new THREE.MeshStandardMaterial({ color : '#98fb98'});

const orignPosition = {x: -size *5, y: -size *5, z: 0};
const orignPosition2 = {x: -size *5 - size * 0.5, y: -size *5 - size * 0.5, z: size * 0.5};
for(let i = 0; i < 10; i ++){
	for(let j = 0; j < 10; j ++){
		for(let q = 0; q < 5; q ++){
			const mesh = new THREE.Mesh(
				cubeGeo,
				cubeMaterial
			);
			const mesh2 = new THREE.Mesh(
				sphereGeoC,
				sphereMat2
			);

			mesh.position.set(orignPosition.x + size*i, orignPosition.y + size*j, orignPosition.z - size*q);
			mesh2.position.set(orignPosition2.x + size*i, orignPosition2.y + size*j, orignPosition2.z - size*q);
			scene.add(mesh, mesh2);
		}
	}
}

/**
* Fog
*/
const fog = new THREE.Fog('#000000', 1, 15);
//fog.near = 5;
fog.far = 20;
scene.fog = fog;

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.6;
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.4);
pointLight.position.set(1, 2, 1);
// pointLight.lookAt(sphere);
scene.add(pointLight);

//renderer
const canvas = document.querySelector('canvas.ThreeJs');
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
	}) 
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//camera controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
camera.position.set(0, 0, 5.5);


// This is the thing that does the resizing      
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
} 

//轴辅助线
const axeHelper = new THREE.AxesHelper(2);
//scene.add(axeHelper);

/**
* Raycaster
*/
const raycaster = new THREE.Raycaster();
let currentIntersect = null;

/**
 * Animate
 */
 const clock = new THREE.Clock();
 let oldElapsedTime = 0;

 
function animateLoop(){

	let elapsedTime = clock.getElapsedTime();
	let deltaTime = elapsedTime - oldElapsedTime;
	oldElapsedTime = elapsedTime;

	//undate physics world
	//sphereBody.applyForce(new Vec3(-0.3, 0, 0), sphereBody.position);
	world.step(1 / 60, deltaTime, 3);
	//cubeCenter.position.copy(boxBody.position);
	//cubeCenter.quaternion.copy(boxBody.quaternion);
	for(const object of objToUpdate){
		//object.body.applyForce(new Vec3(-0.3, 0, 0), object.body.position);
		object.mesh.position.copy(object.body.position);
	}
	for(let i = 0; i < textToUpdate.length; i++){
		let directionZ = 0;
		if(i == 0 || i == 1 || i == 2 || i == 5 || i== 6) directionZ = 1; 
		if(i == 3 || i == 4 || i == 7 || i == 8 || i== 9) directionZ = -1; 
		textToUpdate[i].mesh.position.z = Math.sin(elapsedTime * 0.5 ) * 0.8 * Math.cos(elapsedTime) * directionZ;
		textToUpdate[i].body.position.z = textToUpdate[i].mesh.position.z;
	}
	for(let i = 0; i < textShapeToUpdate.length; i++){
		let directionZ = 0;
		if(i % 2 == 0)directionZ = 1;
		else directionZ = -1
		textShapeToUpdate[i].mesh.position.z = Math.sin(elapsedTime * 0.5 ) * 0.8 * Math.cos(elapsedTime) * directionZ;
	}
	//raycaster
	raycaster.setFromCamera(mouse, camera)
	
	const intersects = raycaster.intersectObjects(objectsToTest)

	if(intersects.length)
	{
		if(!currentIntersect)
		{
			//console.log('mouse enter')
			currentIntersect = intersects[0];
			//console.log(currentIntersect);
		}
		
		}else{
			if(currentIntersect)
			{
				//console.log('mouse leave')
				currentIntersect = null
			}
		}

	//control update
	controls.update();

	//renderer
	renderer.render(scene, camera);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	window.requestAnimationFrame(animateLoop);
}

animateLoop();

//double click
window.addEventListener('dblclick', () => {
	const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

	if(!document.fullscreenElement){
		if(canvas.requestFullscreen) canvas.requestFullscreen();
		else if(canvas.webkitRequestFullscreen) canvas,webkitRequestFullscreen();
	}else{
		if(document.exitFullscreen) document.exitFullscreen();
		else if(document.webkitExitFullscreen) document,webkitExitFullscreen();
	}
})


//full screen and resize
window.addEventListener('resize', () => {
	//update size
	width = window.innerWidth;
	height = window.innerHeight;
	
	//update camera
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	//update renderer
	renderer.setSize(width, height);
})
const yellow = new THREE.MeshStandardMaterial({color:'#fffcc7', roughness : 0.5, envMap: environmentMap, envMapIntensity: 0.5, metalness : 0.2});
const green = new THREE.MeshStandardMaterial({color:'#cdf499', roughness : 0.5, envMap: environmentMap, envMapIntensity: 0.5, metalness : 0.2});
const color = [yellow, green];

window.addEventListener('click', () =>
{
	if(currentIntersect)
	{
		let i;
		if(Math.random()>0.7)i = 0;
		else i = 1;
		currentIntersect.object.material = color[i];
		playHitSound();
	}
	
})