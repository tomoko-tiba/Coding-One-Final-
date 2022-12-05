# Coding-One-Final-Project
Yan Wang 22019755

## Contents
- [Introduction](#Introduction)
- [Install](#Install)
- [Details](#Details)
    - [Geometry](#Geometry)
    - [Physics](#Physics)
    - [Interaction](#Interaction)
    
## Introduction

我基于three.js创建了一个互动式的网页海报,将各种图形和字体结合在画面中，同时点击画面中的球体还可以改变颜色和得到声音的反馈，给体验者多方面的感官体验。同时，我还在这个项目中运用了了物理运动库-cannon.es，让图形的运动更生动。

Click here to play : https://final-wang-yan.vercel.app/

![](https://github.com/tomoko-tiba/Coding-One-Final-/blob/master/1.png)

## Install

This project uses node and npm. Go check them out if you don't have them locally installed.

```sh
$ npm install
$ npm run dev
```

## Details

接下来我会展示一下在这个项目中所用到的部分技术

### Geometry and material

我将文字的原始obj文件转换为json文件后，使用FontLoader加载，加入厚度后使它成为3d的图形。

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
文字的材质我使用了matcap，这种材质不受光源的影响，会随着摄像头的移动而改变物体的光影效果。

```sh
const textMaterial = new THREE.MeshMatcapMaterial({ matcap : matcapTexture });
```

背景的装饰是使用循环生成的一个线框的正方体矩阵。

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

同时还增加了烟雾的效果，让远处的物体颜色变暗，从而使整体的氛围感更强。

```sh
const fog = new THREE.Fog('#000000', 1, 15);
fog.far = 20;
scene.fog = fog;
```

### Animate

运用三角函数让文字进行前后的运动，并将这部分代码放在animateLoop函数中循环调用，实时更新。

```sh
for(let i = 0; i < textShapeToUpdate.length; i++){
    let directionZ = 0;
    if(i % 2 == 0)directionZ = 1;
    else directionZ = -1
    textShapeToUpdate[i].mesh.position.z = Math.sin(elapsedTime * 0.5 ) * 0.8 * Math.cos(elapsedTime) * directionZ;
}
```
