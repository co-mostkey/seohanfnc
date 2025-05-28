// 연관 파일:
// - ProductModelViewer.tsx (SimpleModelViewer 사용처)

'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { Play, Pause } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface ProductSettings {
  position: [number, number, number]; scale: number; rotation: [number, number, number];
  cameraPosition: [number, number, number]; cameraFov: number;
  minDistance: number; maxDistance: number;
  autoRotateSpeed: number; autoRotate: boolean;
}

const getProductSettings = (url: string): ProductSettings => {
  if (url.includes('Cylinder-Type-SafetyAirMat')) return { position: [0, -0.5, 0], scale: 0.15, rotation: [0, Math.PI * 0.05, 0], cameraPosition: [3, 2.2, 5], cameraFov: 35, minDistance: 3.5, maxDistance: 10, autoRotateSpeed: 1.2, autoRotate: true };
  if (url.includes('Fan-Type-Air-Safety-Mat')) return { position: [0, -0.3, 0], scale: 12, rotation: [0, Math.PI * 0.25, 0], cameraPosition: [3.8, 2.2, 4.5], cameraFov: 29, minDistance: 3.5, maxDistance: 10, autoRotateSpeed: 0.5, autoRotate: true };
  if (url.includes('Lifesaving-Mat')) return { position: [0, -0.2, 0], scale: 15, rotation: [0, Math.PI * 0.05, 0], cameraPosition: [3.2, 2.5, 4.0], cameraFov: 31, minDistance: 3.0, maxDistance: 9.0, autoRotateSpeed: 0.6, autoRotate: true };
  if (url.includes('Training-Air-Mattress-Fall-Prevention-Mat')) return { position: [0, -0.2, 0], scale: 0.15, rotation: [0, Math.PI * 0.1, 0], cameraPosition: [3.5, 2.3, 4.2], cameraFov: 32, minDistance: 3.2, maxDistance: 9.5, autoRotateSpeed: 0.7, autoRotate: true };
  return { position: [0, -0.5, 0], scale: 0.095, rotation: [0, 0, 0], cameraPosition: [3, 2, 5], cameraFov: 37, minDistance: 3, maxDistance: 10, autoRotateSpeed: 1, autoRotate: true };
};

function Model({ url, onLoad, onError, productId }: { url: string; onLoad?: () => void; onError?: () => void; productId?: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { position, scale, rotation } = getProductSettings(url);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    const cacheInvalidation = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';
    const modelUrl = `${url}${cacheInvalidation}`;

    console.log(`[SimpleModelViewer] ${productId} 모델 로딩 시작:`, modelUrl);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelUrl,
      (gltf) => {
        console.log(`[SimpleModelViewer] ${productId} 모델 로딩 성공:`, gltf);
        const scene = gltf.scene;
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const setMaterialProperties = (material: THREE.Material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  if (productId === 'Lifesaving-Mat') {
                    material.roughness = 0.2;
                    material.metalness = 0.7;
                  } else {
                    material.roughness = 0.3;
                    material.metalness = 0.05;
                  }
                }
              };

              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(setMaterialProperties);
              } else {
                setMaterialProperties(mesh.material);
              }
            }
          }
        });
        setModel(scene);
        setIsLoading(false);
        console.log(`[SimpleModelViewer] ${productId} onLoad 콜백 호출`);
        if (onLoad) onLoad();
      },
      (progress) => {
        if (progress.total > 0) {
          const percentage = (progress.loaded / progress.total * 100).toFixed(1);
          console.log(`[SimpleModelViewer] ${productId} 로딩 진행률: ${percentage}%`);
        }
      },
      (error) => {
        console.error(`[SimpleModelViewer] ${productId} 모델 로딩 실패:`, error);
        console.error(`[SimpleModelViewer] ${productId} 시도한 URL:`, modelUrl);
        console.error(`[SimpleModelViewer] ${productId} 오류 상세:`, {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          type: error instanceof Error ? error.constructor.name : typeof error
        });
        setLoadError(true);
        setIsLoading(false);
        console.log(`[SimpleModelViewer] ${productId} onError 콜백 호출`);
        if (onError) onError();
      }
    );
    return () => {
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
              else child.material.dispose();
            }
          }
        });
        if (model.parent) model.parent.remove(model);
      }
      dracoLoader.dispose();
    };
  }, [url, onLoad, onError, productId]);

  if (isLoading) return <Html center><div className="bg-black/50 text-white px-4 py-2 rounded-lg font-sans text-sm"><p>모델 로딩 중...</p></div></Html>;
  if (loadError || !model) return (
    <>
      <mesh position={[0, 0, 0]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#444" /></mesh>
      <Html position={[0, 0.8, 0]} center><div className="bg-red-600/80 text-white px-3 py-1 rounded-md text-xs font-sans text-center"><p>모델 로드 실패</p></div></Html>
    </>
  );
  return <primitive object={model} position={position} scale={scale} rotation={rotation} />;
}

function Loader() { return <Html center><div className="bg-black/50 text-white px-4 py-2 rounded-lg font-sans text-sm"><p>로딩 컴포넌트...</p></div></Html>; }

interface SimpleModelViewerProps {
  modelPath: string;
  productName?: string;
  onLoad?: () => void;
  onError?: () => void;
  productId?: string;
}

export default function SimpleModelViewer({ modelPath, productName, onLoad, onError, productId }: SimpleModelViewerProps) {
  const [isRotating, setIsRotating] = useState(true);
  const settings = getProductSettings(modelPath);
  const toggleRotation = () => setIsRotating(!isRotating);

  return (
    <div className="w-full h-full relative bg-transparent">
      <div className="w-full h-full rounded-lg overflow-hidden">
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: settings.cameraPosition, fov: settings.cameraFov }}
          shadows
          style={{ touchAction: 'none', background: 'transparent' }}
          className="w-full h-full"
          onCreated={({ gl: createdGl }) => {
            createdGl.setPixelRatio(window.devicePixelRatio);
            createdGl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 15, 10]}
            angle={0.25}
            penumbra={0.5}
            intensity={2.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            color="#FFFFFF"
          />
          <directionalLight
            position={[-8, 10, 5]}
            intensity={2.2}
            color="#FFFFFB"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Suspense fallback={<Loader />}>
            <Model url={modelPath} onLoad={onLoad} onError={onError} productId={productId} />
            <Environment preset="apartment" />
          </Suspense>
          <OrbitControls
            autoRotate={isRotating}
            autoRotateSpeed={settings.autoRotateSpeed}
            enableZoom={true}
            enablePan={false}
            minDistance={settings.minDistance}
            maxDistance={settings.maxDistance}
          />
        </Canvas>
      </div>
      <div className="absolute bottom-3 left-3 z-10">
        <button
          onClick={toggleRotation}
          className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors shadow-md"
          aria-label={isRotating ? "회전 정지" : "자동 회전"}
        >
          {isRotating ? <Pause size={16} className="text-white/90" /> : <Play size={16} className="text-white/90" />}
        </button>
      </div>
    </div>
  );
}
