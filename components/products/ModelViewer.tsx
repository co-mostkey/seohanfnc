'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, ContactShadows, useProgress } from '@react-three/drei';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Info } from 'lucide-react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string; // GLB 파일 경로
  productName: string;
  showHotspots?: boolean;
  onLoad?: () => void; // 3D 모델 로딩 성공 콜백 추가
  onError?: () => void; // 3D 모델 로딩 실패 콜백 추가
}

interface HotspotData {
  position: [number, number, number]; // 3D 공간의 x, y, z 좌표
  label: string;
}

/**
 * 로딩 화면 컴포넌트
 */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white text-sm font-medium">
          {progress.toFixed(0)}% 로딩 중...
        </p>
      </div>
    </Html>
  );
}

/**
 * 3D 모델 컴포넌트
 */
function Model({ modelPath, showHotspots = true, autoRotate = false, fallbackImage = '/images/placeholder-3d.jpg' }: {
  modelPath: string;
  showHotspots?: boolean;
  autoRotate?: boolean;
  fallbackImage?: string;
}) {
  // 모델 로드 실패 시에 사용할 상태
  const [loadError, setLoadError] = useState(false);

  // Load GLB model - with proper error handling
  console.log('Attempting to load model from:', modelPath);

  // Directly use useGLTF without third parameter which causes issues
  let gltf;
  try {
    gltf = useGLTF(modelPath);
  } catch (error) {
    console.error('Failed to load GLTF model:', error);
    setLoadError(true);
    gltf = { scene: null, nodes: {}, materials: {} };
  }

  const { scene, nodes, materials } = gltf;

  const modelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // 모델 자동 회전
  useFrame((state, delta) => {
    if (modelRef.current && autoRotate) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  // 모델 로드 오류가 있으면 대체 요소 반환
  if (loadError || !scene) {
    // 대체 박스 모델 렌더링
    return (
      <group ref={modelRef}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
        <Html center>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-800/80 rounded-lg">
            <p className="text-white text-sm mb-2">Unable to load 3D model</p>
            <p className="text-gray-300 text-xs">Please check the file: {modelPath}</p>
          </div>
        </Html>
      </group>
    );
  }

  // 모델 복제 및 최적화
  const model = React.useMemo(() => {
    if (!scene) return null;

    const clone = scene.clone();

    // 모델 크기 조정 및 중앙 정렬
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // 모델이 화면에 적절히 표시되도록 크기 조정
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDimension;
    clone.scale.set(scale, scale, scale);

    // 모델 위치 조정 (중앙으로)
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    return clone;
  }, [scene]);

  // 임시 핫스팟 데이터 (실제로는 모델별로 지정된 데이터 사용)
  const hotspots: HotspotData[] = [
    { position: [0.5, 0.5, 0.5], label: '안전밸브' },
    { position: [-0.5, 0.3, 0.2], label: '견인고리' },
    { position: [0, 0.8, 0], label: '공기주입구' },
  ];

  return (
    <group ref={modelRef}>
      {model && <primitive object={model} />}

      {/* 핫스팟 (정보 포인트) */}
      {showHotspots && hotspots.map((hotspot, index) => (
        <group key={index} position={new THREE.Vector3(...hotspot.position)}>
          <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="relative">
              <div className="hotspot"></div>
              <div className="floating-label">
                {hotspot.label}
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

/**
 * 카메라 컨트롤러
 */
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    // 카메라 초기 위치 설정
    camera.position.set(0, 0, 5);
  }, [camera]);

  return null;
}

// Preload handler to catch errors
const ErrorBoundaryGLTF = (url: string) => {
  try {
    return useGLTF.preload(url);
  } catch (e) {
    console.error('Preload failed:', e);
    return null;
  }
};

/**
 * 3D 모델 뷰어 컴포넌트
 * 제품의 3D 모델을 인터랙티브하게 표시합니다.
 */
export default function ModelViewer({ modelPath, productName, showHotspots = true, onLoad, onError }: ModelViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelLoadError, setModelLoadError] = useState(false);

  // Create the actual GLB file path ("/models/products/{productID}/model.glb")
  const glbPath = modelPath || `/models/products/Cylinder-Type-SafetyAirMat/model.glb`;
  console.log('Using model path:', glbPath);

  // Fallback image path (used if model loading fails)
  const fallbackImage = `/images/placeholder-3d.jpg`;

  // 확대
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2.0));
  };

  // 축소
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // 리셋
  const handleReset = () => {
    setZoom(1);
    setIsPlaying(false);
  };

  // 자동 회전 토글
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Three.js 캔버스 */}
      <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden">
        <Canvas
          ref={canvasRef}
          camera={{ fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          shadows
          dpr={[1, 2]} // 해상도 최적화
        >
          <CameraController />

          {/* 환경광 설정 */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <Environment preset="city" />

          {/* 모델 및 로딩 화면 */}
          <Suspense fallback={<Loader />}>
            <Model
              modelPath={glbPath}
              showHotspots={showHotspots}
              autoRotate={isPlaying}
              fallbackImage={fallbackImage}
            />
            <ContactShadows opacity={0.4} scale={5} blur={2} far={10} resolution={256} color="#000000" />
          </Suspense>

          {/* 카메라 컨트롤 (마우스로 드래그하여 모델 회전) */}
          <OrbitControls
            enableZoom={true}
            zoomSpeed={0.5}
            autoRotate={isPlaying}
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="model-controls">
        <button
          className="model-control-btn"
          onClick={handleZoomIn}
          aria-label="확대"
        >
          <ZoomIn size={18} />
        </button>
        <button
          className="model-control-btn"
          onClick={handleZoomOut}
          aria-label="축소"
        >
          <ZoomOut size={18} />
        </button>
        <button
          className="model-control-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "정지" : "자동 회전"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          className="model-control-btn"
          onClick={handleReset}
          aria-label="초기화"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* 제품 이름 */}
      <div className="absolute bottom-6 left-6 text-white text-xl font-bold">
        {productName}
      </div>

      {/* 정보 아이콘 */}
      <div className="absolute top-6 right-6">
        <button className="p-2 bg-gray-800/70 rounded-full text-white hover:bg-primary-600/70 transition-colors">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
}
