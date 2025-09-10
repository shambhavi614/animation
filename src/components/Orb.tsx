"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const Orb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.minDistance = 6;
    controls.maxDistance = 20;

    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // ✅ TEMP TEST OBJECT (so you never get a blank page)
    const testCube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshNormalMaterial()
    );
    scene.add(testCube);

    // Texture Loader
    const loader = new THREE.TextureLoader();
    const totalImages = 6;
    const totalItems = 20;
    const radius = 6;

    const createSphere = () => {
      for (let i = 0; i < totalItems; i++) {
        const phi = Math.acos(-1 + (2 * i) / totalItems);
        const theta = Math.sqrt(totalItems * Math.PI) * phi;

        const path = `/assets/img${(i % totalImages) + 1}.jpg`;

        loader.load(
          path,
          (tex) => {
            const geometry = new THREE.PlaneGeometry(2, 1.5);
            const material = new THREE.MeshBasicMaterial({
              map: tex,
              side: THREE.DoubleSide,
              transparent: true,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.setFromSphericalCoords(radius, phi, theta);
            mesh.lookAt(camera.position);
            scene.add(mesh);
          },
          undefined,
          () => console.warn("Image missing:", path)
        );
      }
    };

    createSphere();

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  //  full width/height container
  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Orb;
