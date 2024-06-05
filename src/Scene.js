// src/Scene.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Scene = () => {
  const mountRef = useRef(null);
  const [doorSize, setDoorSize] = useState({ width: 1, height: 2 });

  useEffect(() => {
    createScene()
  }, [doorSize]);

  const createScene  = () => {
    const mount = mountRef.current;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Create directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    light.castShadow = true; // Enable shadows
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Create the plane ground
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true; 
    scene.add(plane);

    // Add two geometries
    // Box
    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.5, roughness: 0.5 });

    const cube = new THREE.Mesh(geometry1, material1);
    cube.position.set(-2, 0, 0);
    cube.castShadow = true; 
    scene.add(cube);

    // Sphere
    const geometry2 = new THREE.SphereGeometry(0.5, 32, 32);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.5, roughness: 0.5 });
    const sphere = new THREE.Mesh(geometry2, material2);
    sphere.position.set(2, 0, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    // Add door
    const textureLoader = new THREE.TextureLoader();
    const doorTexture = textureLoader.load('textures/wood.jpeg');
    const doorGeometry = new THREE.BoxGeometry(doorSize.width, doorSize.height, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ map: doorTexture });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, doorSize.height / 2 - 1, 0);
    door.castShadow = true; 
    scene.add(door);

    // Add door handle
    const handleGeometry = new THREE.SphereGeometry(0.07, 32, 32);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(doorSize.width / 2 - 0.1, doorSize.height / 2 - 1, 0.1); 
    handle.castShadow = true;
    door.add(handle);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount.removeChild(renderer.domElement);

    };
  }
  const handleResize = (event) => {
    const { name, value } = event.target;
    setDoorSize((prevSize) => ({
      ...prevSize,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div>
      <div ref={mountRef} />
      <div style={{ position: 'absolute', top: '20vw', left: 0 }}>
        <label>
          Door Width:
          <input
            type="number"
            name="width"
            value={doorSize.width}
            onChange={handleResize}
          />
        </label>
        <label>
          Door Height:
          <input
            type="number"
            name="height"
            value={doorSize.height}
            onChange={handleResize}
          />
        </label>
      </div>
    </div>
  );
};

export default Scene;
