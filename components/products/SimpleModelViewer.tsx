// 연관 파일:
// - ProductModelViewer.tsx (SimpleModelViewer 사용처)

'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface ProductSettings {
  position: [number, number, number]; scale: number; rotation: [number, number, number];
  cameraPosition: [number, number, number]; cameraFov: number;
  minDistance: number; maxDistance: number;
  autoRotateSpeed: number; autoRotate: boolean;
}

const getProductSettings = (productId: string): ProductSettings => {
  // [TRISID] 제품 ID에 따라 다른 설정 반환
  switch (productId) {
    // [TRISID] 에어매트 4종에 대한 개별 스케일 및 위치 설정
    case "Cylinder-Type-SafetyAirMat":
      return {
        position: [0, -0.5, 0], scale: 0.1, rotation: [0, 0, 0],
        cameraPosition: [3, 2, 5], cameraFov: 37,
        minDistance: 3, maxDistance: 10,
        autoRotateSpeed: 0.8, autoRotate: true,
      };
    case "Fan-Type-Air-Safety-Mat":
      return {
        position: [0, -0.5, 0], scale: 12, rotation: [0, 0, 0],
        cameraPosition: [3, 2, 5], cameraFov: 37,
        minDistance: 3, maxDistance: 10,
        autoRotateSpeed: 0.8, autoRotate: true,
      };
    case "Training-Air-Mattress-Fall-Prevention-Mat":
      return {
        position: [0, -0.5, 0], scale: 0.15, rotation: [0, 0, 0],
        cameraPosition: [3, 2, 5], cameraFov: 37,
        minDistance: 3, maxDistance: 10,
        autoRotateSpeed: 0.8, autoRotate: true,
      };
    case "Lifesaving-Mat":
      return {
        position: [0, -0.5, 0], scale: 17, rotation: [0, 0, 0],
        cameraPosition: [3, 2, 5], cameraFov: 37,
        minDistance: 3, maxDistance: 10,
        autoRotateSpeed: 0.8, autoRotate: true,
      };
    // [TRISID] 나머지 모든 제품 기본 설정
    default:
      return {
        position: [0, -0.5, 0], scale: 0.095, rotation: [0, 0, 0],
        cameraPosition: [3, 2, 5], cameraFov: 37,
        minDistance: 3, maxDistance: 10,
        autoRotateSpeed: 1, autoRotate: true,
      };
  }
};

function Model({ url, onLoad, onError, productId }: { url: string; onLoad?: () => void; onError?: () => void; productId?: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { position, scale, rotation } = getProductSettings(productId || '');

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

        // [TRISID] 모델을 지오메트리 중심으로 이동시켜 위치를 정규화합니다.
        const box = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        scene.position.sub(center);

        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const setMaterialProperties = (material: THREE.Material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  material.roughness = 0.2;
                  material.metalness = 0.1;
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
  modelPath?: string;
  src?: string;
  productName?: string;
  onLoad?: () => void;
  onError?: () => void;
  productId?: string;
  transparent?: boolean;
  interactive?: boolean;
}

// [TRISID] 3D 모델 경로 자동 생성 함수 (공식 경로)
function getDefaultModelPath(productId: string) {
  return `/models/products/${productId}/${productId}.glb`;
}

// [TRISID] glb/gltf 우선순위 경로 생성 함수 (src/modelPath 우선, 없으면 공식 경로)
function resolveModelPath(props: SimpleModelViewerProps): { path: string | null, isGLTF: boolean } {
  let path = props.src || props.modelPath || '';
  if (!path && props.productId) {
    path = getDefaultModelPath(props.productId);
  }
  if (!path) return { path: null, isGLTF: false };
  if (path.endsWith('.glb')) return { path, isGLTF: false };
  if (path.endsWith('.gltf')) return { path, isGLTF: true };
  // 폴더(제품ID)만 들어온 경우 자동 경로 생성
  if (/^[\w-]+$/.test(path)) {
    path = getDefaultModelPath(path);
    return { path, isGLTF: false };
  }
  return { path, isGLTF: false };
}

export default function SimpleModelViewer(props: SimpleModelViewerProps) {
  const { productName, onLoad, onError, productId, transparent = false, interactive = false } = props;
  const [isRotating, setIsRotating] = useState(true);
  const settings = getProductSettings(productId || '');
  const toggleRotation = () => setIsRotating(!isRotating);

  // [TRISID] glb 우선, gltf 부가 지원 경로 처리
  const { path: resolvedPath, isGLTF } = resolveModelPath(props);

  return (
    <div className="w-full h-full relative bg-transparent">
      {/* gltf 안내 메시지 */}
      {isGLTF && (
        <div className="absolute top-2 left-2 z-20 bg-yellow-500/80 text-black px-3 py-1 rounded text-xs font-bold shadow">[TRISID] glb 파일 사용을 권장합니다 (gltf는 부가 지원)</div>
      )}
      <div className="w-full h-full rounded-lg overflow-hidden">
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: settings.cameraPosition, fov: settings.cameraFov }}
          shadows={false}
          style={{ touchAction: 'none', background: 'transparent' }}
          className="w-full h-full"
          onCreated={({ gl: createdGl }) => {
            createdGl.setPixelRatio(window.devicePixelRatio);
            createdGl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={1.35} color="#fff" />
          <directionalLight
            position={[-8, 10, 5]}
            intensity={3.2}
            color="#fff"
            castShadow={false}
          />
          <spotLight
            position={[10, 15, 10]}
            angle={0.25}
            penumbra={0.5}
            intensity={3.5}
            color="#fff"
            castShadow={false}
          />
          <Suspense fallback={<Loader />}>
            <Model url={resolvedPath || ''} onLoad={onLoad} onError={onError} productId={productId} />
          </Suspense>
          <OrbitControls
            autoRotate={isRotating}
            autoRotateSpeed={settings.autoRotateSpeed}
            enableZoom={false}
            enablePan={false}
            enableRotate={interactive}
            minDistance={settings.minDistance}
            maxDistance={settings.maxDistance}
          />
        </Canvas>
      </div>
      <div className="absolute bottom-3 left-3 z-10">
        <button
          onClick={toggleRotation}
          className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors shadow-md w-8 h-8 flex items-center justify-center"
          aria-label={isRotating ? "회전 정지" : "자동 회전"}
        >
          <span className="text-white text-xs">{isRotating ? '❚❚' : '▶'}</span>
        </button>
      </div>
    </div>
  );
}
