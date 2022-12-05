# Coding-One-Final-Project
Yan Wang 22019755

## Contents
- [Introduction](#Introduction)
- [Install](#Install)
- [Details](#Details)
    - [Geometry](#Geometry)
    - [Animate](#Animate)
    - [Physics](#Physics)
    - [Interaction](#Interaction)
    
## Introduction

I created an interactive web poster based on three.js, combining various graphics and fonts on the screen, while clicking on the spheres on the screen changes the colour and gives sound feedback, giving a multi-sensory experience. I also used the physical motion library, cannon.es, in this project to bring the graphics to life.

Github link ：https://github.com/tomoko-tiba/Coding-One-Final-/blob/master/README.md
Click here to play : https://final-wang-yan.vercel.app/

![](https://github.com/tomoko-tiba/Coding-One-Final-/blob/master/1.png)

## Install

This project uses node and npm. Go check them out if you don't have them locally installed.

```sh
$ npm install
$ npm run dev
```

## Details

I will then show some of the techniques used in this project.

### Geometry and material

After converting the raw obj file of the text to a json file, I loaded it using FontLoader, added the thickness and made it into a 3d graphic.

```sh
const fontLoader = new FontLoader();

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
		}
	);
}

loadText({x: 0, y:0, z: 0});
```

For the text I used matcap, a material that is not affected by the light source and changes the light and shadow effect of the object as the camera moves.

```sh
const textMaterial = new THREE.MeshMatcapMaterial({ matcap : matcapTexture });
```

The background is decorated with a square matrix of wireframes generated using a loop.

```sh
//cube matrix
const cubeGeo = new THREE.BoxGeometry(size, size, size);
const sphereGeoC = new THREE.SphereGeometry(size*0.01, 32, 16);
const cubeMaterial = new THREE.MeshBasicMaterial({ color : 'green', wireframe: true});
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
				sphereMat
			);

			mesh.position.set(orignPosition.x + size*i, orignPosition.y + size*j, orignPosition.z - size*q);
			mesh2.position.set(orignPosition2.x + size*i, orignPosition2.y + size*j, orignPosition2.z - size*q);
			scene.add(mesh, mesh2);
		}
	}
}
```

A smoke effect has also been added to darken the colours of distant objects, thus giving an overall sense of atmosphere.

```sh
const fog = new THREE.Fog('#000000', 1, 15);
fog.far = 20;
scene.fog = fog;
```

### Animate

Use trigonometric functions to make the text move backwards and forwards, and place this part of the code in an animateLoop function to be called in a loop and updated in real time.

```sh
for(let i = 0; i < textShapeToUpdate.length; i++){
    let directionZ = 0;
    if(i % 2 == 0)directionZ = 1;
    else directionZ = -1
    textShapeToUpdate[i].mesh.position.z = Math.sin(elapsedTime * 0.5 ) * 0.8 * Math.cos(elapsedTime) * directionZ;
}
```
### Physics

To achieve the effect of displaying physics, I used the canon-es library. Using canon-es to generate a mesh of the same size as the sphere in three.js, and copying the position of the body to the mash, I was able to make the sphere in three.js achieve physical movement.

```sh
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
```

And bind the body of the cannon to the mesh of three.js in the animateLoop function, updating it in real time.

```sh
for(const object of objToUpdate){
	object.mesh.position.copy(object.body.position);
}
```

Create multiple boxBody to the corresponding text at the same time and set the body's mass to 0 to allow him to bounce the ball without being physically moved out of position.

![](https://github.com/tomoko-tiba/Coding-One-Final-/blob/master/2png)

### Interaction

The use of rayCast function to determine if the mouse is resting on an object and to change the colour of the object when clicked, as well as playing sound effects, makes the interactive experience more interesting for the audience.

```sh
const raycaster = new THREE.Raycaster();
let currentIntersect = null;

function animateLoop(){
	raycaster.setFromCamera(mouse, camera)

	const intersects = raycaster.intersectObjects(objectsToTest)

	if(intersects.length){
		if(!currentIntersect){
			//console.log('mouse enter')
			currentIntersect = intersects[0];
			//console.log(currentIntersect);
		}
	}else{
		if(currentIntersect){
			//console.log('mouse leave')
			currentIntersect = null
		}
	}
}

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
```
