'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import { Play, Pause, Info } from 'lucide-react';

// 모델 컴포넌트 - 직접 경로에서 모델 로드
function Model({ url }: { url: string }) {
  // 오류 상태 추적
  const [error, setError] = useState<Error | null>(null);

  try {
    // 단순화된 모델 로딩 방식
    const { scene } = useGLTF(url);

    // 모델 렌더링
    return <primitive object={scene} position={[0, -0.5, 0]} scale={0.08} />;
  } catch (err) {
    // 오류 발생 시 처리
    if (!error) setError(err as Error);
    console.error('모델 로딩 오류:', err);

    // 오류 발생 시 메시지 표시
    return (
      <Html position={[0, 0, 0]} center>
        <div className="bg-black/70 p-4 rounded-lg text-white max-w-xs text-center">
          <h3 className="font-bold mb-2">모델을 불러오는데 문제가 발생했습니다</h3>
          <p className="text-sm opacity-80">기술적인 문제로 인해 3D 모델을 표시할 수 없습니다.</p>
        </div>
      </Html>
    );
  }
}

// 로딩 컴포넌트
function Loader() {
  return (
    <Html center>
      <div className="bg-black/70 p-4 rounded-lg text-white">
        <p>모델 로딩 중...</p>
      </div>
    </Html>
  );
}

// 메인 뷰어 컴포넌트
interface SimplestModelViewerProps {
  modelPath: string;
  productName: string;
  onLoad?: () => void;
  onError?: () => void;
}

// [TRISID] glb/gltf 우선순위 경로 생성 함수
function resolveModelPath(modelPath: string): { path: string | null, isGLTF: boolean } {
  if (!modelPath) return { path: null, isGLTF: false };
  if (modelPath.endsWith('.glb')) return { path: modelPath, isGLTF: false };
  if (modelPath.endsWith('.gltf')) return { path: modelPath, isGLTF: true };
  // 폴더/제품ID일 경우 glb 우선, 없으면 gltf (실제 파일 존재 여부는 서버/데이터에서 체크 필요)
  const glbPath = modelPath + '/model.glb';
  const gltfPath = modelPath + '/model.gltf';
  // 실제 파일 존재 여부를 동적으로 체크하려면 fetch 등 필요, 여기선 glb 우선 반환
  return { path: glbPath, isGLTF: false };
}

export default function SimplestModelViewer({ modelPath, productName, onLoad, onError }: SimplestModelViewerProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // [TRISID] glb 우선, gltf 부가 지원 경로 처리
  const { path: resolvedPath, isGLTF } = resolveModelPath(modelPath);

  // 토글 핸들러
  const toggleRotation = () => setIsRotating(!isRotating);
  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <div className="w-full h-full relative">
      {/* gltf 안내 메시지 */}
      {isGLTF && (
        <div className="absolute top-2 left-2 z-20 bg-yellow-500/80 text-black px-3 py-1 rounded text-xs font-bold shadow">[TRISID] glb 파일 사용을 권장합니다 (gltf는 부가 지원)</div>
      )}
      {/* Canvas 컨테이너 */}
      <div className="w-full h-full rounded-xl overflow-hidden bg-transparent">
        <Canvas
          camera={{ position: [3, 1.5, 5], fov: 45 }}
          gl={{ antialias: true }}
          shadows
        >
          {/* 조명 */}
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />

          {/* 모델 */}
          <Suspense fallback={<Loader />}>
            <Model url={resolvedPath || ''} />
          </Suspense>

          {/* 환경 */}
          <Environment preset="city" />

          {/* 컨트롤 */}
          <OrbitControls
            autoRotate={isRotating}
            autoRotateSpeed={1}
            enableZoom={true}
            enablePan={true}
            minDistance={3}
            maxDistance={10}
          />
        </Canvas>
      </div>

      {/* 제품 이름 */}
      <div className="absolute bottom-6 left-6 text-white text-xl font-bold z-10 bg-black/30 px-3 py-1 rounded">
        {productName}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
        <button
          className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
          onClick={toggleRotation}
          aria-label={isRotating ? "회전 정지" : "자동 회전"}
        >
          {isRotating ?
            <Pause size={20} className="text-white" /> :
            <Play size={20} className="text-white" />
          }
        </button>

        <button
          className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
          onClick={toggleInfo}
          aria-label="제품 정보"
        >
          <Info size={20} className="text-white" />
        </button>
      </div>

      {/* 제품 정보 모달 */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg max-w-md w-full">
            <h3 className="text-white text-xl font-bold mb-4">{productName}</h3>
            <p className="text-white/90 mb-4">
              이 제품은 안전 에어매트로, 다양한 산업 현장에서 작업자의 안전을 보호하는 데 사용됩니다.
              자세한 사양과 기능은 제품 상세 페이지에서 확인할 수 있습니다.
            </p>
            <button
              className="bg-primary-500 text-white px-4 py-2 rounded-md w-full hover:bg-primary-600 transition-colors"
              onClick={toggleInfo}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
