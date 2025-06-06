'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, RootState } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, ContactShadows, useProgress } from '@react-three/drei';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Info } from 'lucide-react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string; // GLB 파일 경로
  productName: string;
  showHotspots?: boolean;
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
function ModelContent({ modelPath, showHotspots, autoRotate }: { modelPath: string; showHotspots: boolean; autoRotate: boolean; }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_state: RootState, delta: number) => {
    if (modelRef.current && autoRotate) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  const model = React.useMemo(() => {
    const clone = scene.clone();
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDimension;
    clone.scale.set(scale, scale, scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    return clone;
  }, [scene]);

  const hotspots: HotspotData[] = [
    { position: [0.5, 0.5, 0.5], label: '안전밸브' },
    { position: [-0.5, 0.3, 0.2], label: '견인고리' },
    { position: [0, 0.8, 0], label: '공기주입구' },
  ];

  return (
    <group ref={modelRef}>
      <primitive object={model} />
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
 * 에러 바운더리 컴포넌트
 */
function ModelErrorBoundary({ modelPath, showHotspots, autoRotate }: { modelPath: string; showHotspots: boolean; autoRotate: boolean; }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const Catcher = () => {
      try {
        useGLTF.preload(modelPath);
        return null;
      } catch (e) {
        setHasError(true);
        return null;
      }
    };
    Catcher();
  }, [modelPath]);

  if (hasError) {
    return (
      <Html center>
        <div className="flex flex-col items-center justify-center p-4 bg-gray-800/80 rounded-lg">
          <p className="text-white text-sm mb-2">3D 모델을 불러올 수 없습니다.</p>
          <p className="text-gray-300 text-xs">파일 경로를 확인하세요: {modelPath}</p>
        </div>
      </Html>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <ModelContent modelPath={modelPath} showHotspots={showHotspots} autoRotate={autoRotate} />
    </Suspense>
  );
}

/**
 * 카메라 컨트롤러
 */
function CameraController() {
  const { camera, controls } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
    if (controls) {
      (controls as any).target.set(0, 0, 0);
    }
  }, [camera, controls]);

  return null;
}

/**
 * 3D 모델 뷰어 컴포넌트
 * 제품의 3D 모델을 인터랙티브하게 표시합니다.
 */
export default function ModelViewer({ modelPath, productName, showHotspots = true }: ModelViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const controlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
    }
  };

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full h-full rounded-xl overflow-hidden bg-transparent">
        <Canvas
          camera={{ fov: 45 }}
          shadows
          dpr={[1, 2]}
        >
          <CameraController />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <Environment preset="city" />

          <ModelErrorBoundary modelPath={modelPath} showHotspots={showHotspots} autoRotate={isPlaying} />

          <ContactShadows opacity={0.4} scale={5} blur={2} far={10} resolution={256} color="#000000" />

          <OrbitControls ref={controlsRef} autoRotate={isPlaying} autoRotateSpeed={2} />
        </Canvas>
      </div>

      {/* UI Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-2">
        <button onClick={handleReset} className="control-button group">
          <RotateCcw className="w-5 h-5 text-gray-300 group-hover:text-white" />
          <span className="control-tooltip">리셋</span>
        </button>
        <button onClick={handleZoomIn} className="control-button group">
          <ZoomIn className="w-5 h-5 text-gray-300 group-hover:text-white" />
          <span className="control-tooltip">확대</span>
        </button>
        <button onClick={handleZoomOut} className="control-button group">
          <ZoomOut className="w-5 h-5 text-gray-300 group-hover:text-white" />
          <span className="control-tooltip">축소</span>
        </button>
        <button onClick={togglePlay} className="control-button group">
          {isPlaying ? <Pause className="w-5 h-5 text-gray-300 group-hover:text-white" /> : <Play className="w-5 h-5 text-gray-300 group-hover:text-white" />}
          <span className="control-tooltip">{isPlaying ? '정지' : '회전'}</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button className="control-button group">
          <Info className="w-5 h-5 text-gray-300 group-hover:text-white" />
          <span className="control-tooltip right-full mr-2">
            <strong>{productName}</strong><br />
            - 마우스 휠: 확대/축소<br />
            - 드래그: 회전
          </span>
        </button>
      </div>
    </div>
  );
}
