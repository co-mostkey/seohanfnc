'use client'

import React, { useRef, Suspense, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import type { Logo3DSettings, Logo3DStylePreset } from '@/types/company'

const MODEL_PATH = '/images/3dlogo-3d.glb'

// Logo3D.tsx 내부에 defaultLogo3DSettings 정의 - HDRI 경로를 빈 문자열로 변경
const defaultLogo3DSettings: Required<Logo3DSettings> = {
  enableRotation: true,
  rotationSpeed: 0.0015,
  modelScale: 1,
  stylePreset: 'default',
  glbFileUrl: '',
  viewerBackgroundType: 'transparent',
  viewerBackgroundColor: '#FFFFFF',
  viewerBackgroundHdriPath: '', // 빈 문자열로 변경하여 404 오류 방지
};

function LoadingIndicator() {
  return (
    <mesh position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#004080" wireframe />
    </mesh>
  )
}

// 3D 모델 컴포넌트 - React.memo로 최적화
const Model = React.memo(function Model({ settings }: { settings: Logo3DSettings }) {
  const modelRef = useRef<THREE.Group>(null)
  const modelToLoad = settings.glbFileUrl || MODEL_PATH;

  const { scene } = useGLTF(modelToLoad)
  useGLTF.preload(modelToLoad)

  const {
    enableRotation = defaultLogo3DSettings.enableRotation,
    rotationSpeed = defaultLogo3DSettings.rotationSpeed,
    modelScale = defaultLogo3DSettings.modelScale,
    stylePreset = defaultLogo3DSettings.stylePreset,
  } = settings;

  // 회전 애니메이션 - useCallback으로 최적화
  const animateRotation = useCallback((delta: number) => {
    if (enableRotation && modelRef.current) {
      modelRef.current.rotation.y -= rotationSpeed;
    }
  }, [enableRotation, rotationSpeed]);

  useFrame((state, delta) => {
    animateRotation(delta);
  })

  // 스케일 계산 - useMemo로 최적화
  const currentScale = useMemo((): [number, number, number] => {
    const scaleFactor = 0.014;
    return [
      scaleFactor * modelScale,
      scaleFactor * modelScale,
      scaleFactor * modelScale
    ];
  }, [modelScale]);

  // 초기 회전 설정
  useEffect(() => {
    if (modelRef.current && scene) {
      modelRef.current.rotation.x = Math.PI * 0.5
      modelRef.current.rotation.y = Math.PI * 0.05
      modelRef.current.rotation.z = Math.PI * 0.045
    }
  }, [scene])

  // 스타일 프리셋 적용 - 부드러운 전환을 위해 최적화
  useEffect(() => {
    if (!scene || !scene.children || scene.children.length === 0) {
      return;
    }

    let appliedMaterial = false;
    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true

        if (object.material) {
          appliedMaterial = true;
          const material = object.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
          material.envMapIntensity = 2.0;

          if (material instanceof THREE.MeshPhysicalMaterial) {
            material.clearcoat = 0;
            material.clearcoatRoughness = 0;
            material.sheen = 0;
            material.sheenRoughness = 0;
            material.transmission = 0;
          }
          if (!material.emissive || (material.emissive.r === 0 && material.emissive.g === 0 && material.emissive.b === 0)) {
            material.emissive = new THREE.Color(0x111111);
            material.emissiveIntensity = 0.1;
          }

          let partName = '';
          if (object.name.includes('S_Logo_Red')) partName = 'S_Logo';
          else if (object.name.includes('Text_Logo_White')) partName = 'Text_Logo';
          else if (object.name.includes('Ring_Logo_Gray')) partName = 'Ring_Logo';

          if (partName) {
            material.emissive = new THREE.Color(0x000000);
            material.emissiveIntensity = 0;

            switch (stylePreset) {
              case 'metallic':
                material.metalness = 1.0;
                material.roughness = 0.01;
                material.envMapIntensity = 5.0;

                if (partName === 'S_Logo') {
                  material.color = new THREE.Color(0xB0B0B5);
                  material.roughness = 0.001;
                } else if (partName === 'Text_Logo') {
                  material.color = new THREE.Color(0xE0E0E5);
                  material.roughness = 0.005;
                } else {
                  material.color = new THREE.Color(0x505055);
                  material.roughness = 0.01;
                }
                break;
              case 'vibrant':
                material.metalness = 0.1;
                material.roughness = 0.2;
                material.envMapIntensity = 1.5;
                if (material instanceof THREE.MeshPhysicalMaterial) {
                  material.clearcoat = 0.8;
                  material.clearcoatRoughness = 0.1;
                }

                if (partName === 'S_Logo') material.color = new THREE.Color(0xFF0000);
                else if (partName === 'Text_Logo') material.color = new THREE.Color(0x00A0FF);
                else if (partName === 'Ring_Logo') material.color = new THREE.Color(0x00FF00);

                if (partName) {
                  material.emissive = new THREE.Color(material.color).multiplyScalar(0.3);
                  material.emissiveIntensity = 0.6;
                }
                break;
              case 'darkElegant':
                material.metalness = 0.85;
                material.roughness = 0.05;
                material.color = new THREE.Color(0x0A0A0A);
                material.envMapIntensity = 2.5;

                if (partName === 'S_Logo') {
                  material.emissive = new THREE.Color(0x500000);
                  material.emissiveIntensity = 0.7;
                  material.color = new THREE.Color(0x1A0000);
                } else {
                  material.emissive = new THREE.Color(0x000000);
                  material.emissiveIntensity = 0;
                }
                break;
              case 'minimalLight':
                material.metalness = 0.0;
                material.roughness = 0.95;
                material.envMapIntensity = 0.5;

                if (partName === 'S_Logo') material.color = new THREE.Color(0xF5F5F5);
                else if (partName === 'Text_Logo') material.color = new THREE.Color(0xFAFAFA);
                else if (partName === 'Ring_Logo') material.color = new THREE.Color(0xEAEAEA);

                material.emissive = new THREE.Color(0x050505);
                material.emissiveIntensity = 0.05;
                break;
              case 'default':
              default:
                material.metalness = (partName === 'S_Logo') ? 0.85 : (partName === 'Text_Logo') ? 0.8 : 0.6;
                material.roughness = (partName === 'S_Logo') ? 0.08 : (partName === 'Text_Logo') ? 0.1 : 0.25;
                if (partName === 'S_Logo') material.color = new THREE.Color(0xFF3030);
                else if (partName === 'Text_Logo') material.color = new THREE.Color(0xFFFFFF);
                else if (partName === 'Ring_Logo') material.color = new THREE.Color(0xC5C5C5);

                if (partName === 'S_Logo' || partName === 'Text_Logo') {
                  material.emissive = new THREE.Color(material.color).multiplyScalar(0.3);
                  material.emissiveIntensity = (partName === 'S_Logo') ? 0.4 : 0.15;
                } else {
                  material.emissive = new THREE.Color(material.color).multiplyScalar(0.05);
                  material.emissiveIntensity = 0.1;
                }
                break;
            }
          }
          material.needsUpdate = true
        }
      }
    });

  }, [scene, stylePreset]);

  return (
    <primitive
      object={scene}
      ref={modelRef}
      scale={currentScale}
      position={[0, 0, 0]}
    />
  )
});

// Logo3DProps를 Logo3DSettings를 포함하는 객체로 변경
interface Logo3DCanvasProps {
  settings: Logo3DSettings;
}

// 조명 및 환경 컴포넌트 - React.memo로 최적화하고 HDRI 에러 처리 추가
const LightsAndEnvironment = React.memo(function LightsAndEnvironment({
  stylePreset,
  viewerBackgroundType,
  viewerBackgroundHdriPath
}: {
  stylePreset: string;
  viewerBackgroundType: string;
  viewerBackgroundHdriPath: string;
}) {
  const environmentElement = useMemo(() => {
    let reflectiveHdriPreset: any = undefined;

    switch (stylePreset) {
      case 'metallic':
        reflectiveHdriPreset = 'dawn';
        break;
      case 'vibrant':
        reflectiveHdriPreset = 'apartment';
        break;
      case 'darkElegant':
        reflectiveHdriPreset = 'night';
        break;
      case 'minimalLight':
        reflectiveHdriPreset = 'studio';
        break;
      case 'default':
      default:
        reflectiveHdriPreset = 'city';
        break;
    }

    // 배경 유형이 'color'인 경우 환경 맵을 적용하지 않음
    if (viewerBackgroundType === 'color') {
      return null; // 단색 배경일 때는 환경 맵 없이 조명만 사용
    }

    // HDRI 파일 로딩 시 에러 처리 추가
    if (viewerBackgroundType === 'hdri' && viewerBackgroundHdriPath && viewerBackgroundHdriPath.trim() !== '') {
      try {
        return <Environment files={viewerBackgroundHdriPath} background />;
      } catch (error) {
        console.warn('HDRI 파일 로딩 실패, 기본 환경으로 대체:', error);
        // HDRI 로딩 실패 시 기본 프리셋으로 대체
        const environmentBackground = viewerBackgroundType !== 'transparent';
        return <Environment preset={reflectiveHdriPreset} background={environmentBackground} />;
      }
    } else if (reflectiveHdriPreset) {
      const environmentBackground = viewerBackgroundType !== 'transparent';
      return <Environment preset={reflectiveHdriPreset} background={environmentBackground} />;
    } else {
      const environmentBackground = viewerBackgroundType !== 'transparent';
      return <Environment background={environmentBackground} />;
    }
  }, [stylePreset, viewerBackgroundType, viewerBackgroundHdriPath]);

  const lights = useMemo(() => {
    switch (stylePreset) {
      case 'metallic':
        return (
          <>
            <ambientLight intensity={0.02} color="#FFFFFF" />
            <directionalLight position={[8, 6, 8]} intensity={5.0} color="#FFFFFF" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
            <directionalLight position={[-8, 4, -8]} intensity={3.0} color="#A0B0D0" />
            <spotLight position={[0, 15, 10]} angle={0.4} penumbra={0.3} intensity={6.0} color="#FFFFFF" distance={60} decay={1} castShadow />
            <pointLight position={[0, -10, 0]} intensity={1.5} color="#505070" distance={30} decay={2} />
            <hemisphereLight intensity={0.05} groundColor="#303040" color="#E0E0FF" />
          </>
        );
      case 'vibrant':
        return (
          <>
            <ambientLight intensity={0.7} color="#FFFFFF" />
            <directionalLight position={[0, 10, 10]} intensity={1.8} color="#FFFFFF" castShadow />
            <spotLight position={[8, 5, 5]} angle={0.3} penumbra={0.5} intensity={2.0} color="#FF8080" distance={50} decay={1.5} />
            <spotLight position={[-8, 5, 5]} angle={0.3} penumbra={0.5} intensity={2.0} color="#8080FF" distance={50} decay={1.5} />
            <hemisphereLight intensity={0.6} groundColor="#FFD700" color="#00FFFF" />
          </>
        );
      case 'darkElegant':
        return (
          <>
            <ambientLight intensity={0.05} color="#202030" />
            <spotLight position={[7, 5, 0]} angle={0.15} penumbra={0.3} intensity={8.0} color="#E0E0FF" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} target-position={[0, 0, 0]} />
            <spotLight position={[-6, 3, -3]} angle={0.2} penumbra={0.5} intensity={4.0} color="#FFC0CB" castShadow={false} target-position={[0, 0, 0]} />
            <pointLight position={[0, -5, 0]} intensity={0.3} color="#404050" distance={10} decay={2} />
          </>
        );
      case 'minimalLight':
        return (
          <>
            <ambientLight intensity={2.5} color="#FFFFFF" />
            <directionalLight position={[0, 10, 0]} intensity={0.3} color="#F0F0F0" />
            <hemisphereLight intensity={1.5} groundColor="#FCFCFC" color="#FFFFFF" />
          </>
        );
      case 'default':
      default:
        return (
          <>
            <ambientLight intensity={1.8} color="#FFFFFF" />
            <directionalLight
              position={[5, 8, 5]}
              intensity={2.5}
              color="#FFFFFF"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#DDDDFF" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFFFFF" />
            <pointLight position={[0, -10, 5]} intensity={0.4} color="#FFFFFF" />
          </>
        );
    }
  }, [stylePreset]);

  return (
    <>
      {environmentElement}
      {lights}
    </>
  );
});

// 3D 로고 캔버스 컴포넌트 - React.memo로 최적화하고 Canvas key 최적화
export default React.memo(function Logo3D({ settings }: Logo3DCanvasProps) {
  // 기본값과 병합된 최종 설정값 사용
  const finalSettings = useMemo(() => ({ ...defaultLogo3DSettings, ...settings }), [settings]);

  const {
    viewerBackgroundType,
    viewerBackgroundColor,
    viewerBackgroundHdriPath,
    stylePreset,
    glbFileUrl
  } = finalSettings;

  // Canvas key는 모델 파일이 변경될 때만 적용 (스타일 변경 시에는 재생성하지 않음)
  // 빈 문자열이나 undefined인 경우 기본 모델 경로 사용
  const canvasKey = useMemo(() => {
    const modelPath = glbFileUrl && glbFileUrl.trim() !== '' ? glbFileUrl : MODEL_PATH;
    return `logo3d-${modelPath}`;
  }, [glbFileUrl]);

  // Canvas 배경색 및 투명도 설정 - useMemo로 최적화
  const canvasConfig = useMemo(() => {
    let canvasStyleBackground = 'transparent';
    let canvasGlAlpha = true;

    if (viewerBackgroundType === 'color' && viewerBackgroundColor) {
      canvasStyleBackground = viewerBackgroundColor;
      canvasGlAlpha = false;
    } else if (viewerBackgroundType === 'hdri') {
      canvasStyleBackground = 'transparent';
      canvasGlAlpha = true;
    }

    return { canvasStyleBackground, canvasGlAlpha };
  }, [viewerBackgroundType, viewerBackgroundColor]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        key={canvasKey}
        camera={{ position: [0, 0, 18], fov: 35, near: 0.1, far: 1000 }}
        style={{
          width: '100%',
          height: '100%',
          background: canvasConfig.canvasStyleBackground,
          touchAction: 'none'
        }}
        gl={{
          antialias: true,
          alpha: canvasConfig.canvasGlAlpha,
          preserveDrawingBuffer: true
        }}
        orthographic={false}
        linear={true}
        frameloop="always"
        performance={{ min: 0.5 }}
        shadows
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <LightsAndEnvironment
          stylePreset={stylePreset}
          viewerBackgroundType={viewerBackgroundType}
          viewerBackgroundHdriPath={viewerBackgroundHdriPath}
        />
        <Suspense fallback={<LoadingIndicator />}>
          <Model settings={finalSettings} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} minPolarAngle={Math.PI / 4} maxPolarAngle={3 * Math.PI / 4} />
      </Canvas>
    </div>
  )
});
