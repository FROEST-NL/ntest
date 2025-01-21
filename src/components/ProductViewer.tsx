import React, { useRef, useState, Suspense } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CameraIcon, TrashIcon, RotateCcwIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';
import ErrorBoundary from './ErrorBoundary';
import { Mesh } from 'three';

extend(THREE);

interface CameraPosition {
  angle: number;
  position: [number, number, number];
  label: string;
}

interface ProductViewerProps {
  onPositionLock: (position: CameraPosition) => void;
  maxPositions: number;
  currentProduct: number;
  totalProducts: number;
  onProductComplete: () => void;
  onProductChange: (index: number) => void;
  lockedPositions: CameraPosition[];
  onPositionRemove: (index: number) => void;
  productName?: string;
}

function CubeWithLabels() {
  const meshRef = useRef<Mesh>(null);

  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial
          color="#4299e1"
          metalness={0.2}
          roughness={0.3}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Front */}
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Voorkant
      </Text>

      {/* Back */}
      <Text
        position={[0, 0, -1.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        Achterkant
      </Text>

      {/* Left */}
      <Text
        position={[-1.1, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
      >
        Links
      </Text>

      {/* Right */}
      <Text
        position={[1.1, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        Rechts
      </Text>

      {/* Top */}
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Bovenkant
      </Text>

      {/* Bottom */}
      <Text
        position={[0, -1.1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        Onderkant
      </Text>
    </group>
  );
}

function getViewLabel(angle: number): string {
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  if (normalizedAngle >= 315 || normalizedAngle < 45) return "Voorkant";
  if (normalizedAngle >= 45 && normalizedAngle < 135) return "Rechterkant";
  if (normalizedAngle >= 135 && normalizedAngle < 225) return "Achterkant";
  if (normalizedAngle >= 225 && normalizedAngle < 315) return "Linkerkant";
  
  return "Onbekend";
}

export default function ProductViewer({ 
  onPositionLock, 
  maxPositions, 
  currentProduct, 
  totalProducts,
  onProductComplete,
  onProductChange,
  lockedPositions,
  onPositionRemove,
  productName
}: ProductViewerProps) {
  const controlsRef = useRef<any>(null);
  const [manualAngle, setManualAngle] = useState<string>('');

  const handleAngleChange = (value: string) => {
    setManualAngle(value);
    const angle = parseFloat(value);
    if (!isNaN(angle) && controlsRef.current) {
      const radians = (angle * Math.PI) / 180;
      controlsRef.current.setAzimuthalAngle(radians);
      controlsRef.current.update();
    }
  };

  const handleLockPosition = () => {
    if (controlsRef.current && lockedPositions.length < maxPositions) {
      const camera = controlsRef.current.object;
      const azimuthalAngle = controlsRef.current.getAzimuthalAngle();
      const angleInDegrees = (azimuthalAngle * 180) / Math.PI;
      const position: CameraPosition = {
        angle: angleInDegrees,
        position: [camera.position.x, camera.position.y, camera.position.z],
        label: getViewLabel(angleInDegrees)
      };
      
      onPositionLock(position);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-medium">
              {productName || `Product ${currentProduct}`} van {totalProducts}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onProductChange(currentProduct - 2)}
                disabled={currentProduct === 1}
                className={`p-1.5 rounded-lg transition-colors ${
                  currentProduct === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-blue-400 hover:bg-blue-500/20'
                }`}
                title="Vorig product"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onProductChange(currentProduct)}
                disabled={currentProduct === totalProducts}
                className={`p-1.5 rounded-lg transition-colors ${
                  currentProduct === totalProducts
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-blue-400 hover:bg-blue-500/20'
                }`}
                title="Volgend product"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1.5">
              <input
                type="number"
                min="0"
                max="360"
                value={manualAngle}
                onChange={(e) => handleAngleChange(e.target.value)}
                placeholder="0"
                className="w-16 bg-transparent text-white text-center focus:outline-none"
              />
              <span className="text-gray-400">graden</span>
            </div>
            <span className="text-sm text-gray-400">
              {lockedPositions.length}/{maxPositions} posities vastgelegd
            </span>
          </div>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(lockedPositions.length / maxPositions) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative">
        <div className="h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-black/30 to-black/20 backdrop-blur-sm border border-white/10 relative">
          <div className="absolute inset-0 bg-blue-500/5" />
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-white/50">
                Loading 3D viewer...
              </div>
            }>
              <Canvas
                camera={{ position: [4, 3, 4], fov: 50 }}
                gl={{ 
                  antialias: true,
                  alpha: true,
                  preserveDrawingBuffer: true
                }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={1}
                  castShadow
                />
                <hemisphereLight
                  args={["#ffffff", "#000000", 0.5]}
                  position={[0, 50, 0]}
                />
                <CubeWithLabels />
                <OrbitControls
                  ref={controlsRef}
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 2}
                  onChange={() => {
                    if (controlsRef.current) {
                      const angleInDegrees = (controlsRef.current.getAzimuthalAngle() * 180) / Math.PI;
                      setManualAngle(Math.round(((angleInDegrees % 360) + 360) % 360).toString());
                    }
                  }}
                />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={handleLockPosition}
            disabled={lockedPositions.length >= maxPositions}
            className={`px-4 py-2 bg-blue-500 text-white rounded-full flex items-center gap-2 transition-colors ${
              lockedPositions.length >= maxPositions 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-600'
            }`}
          >
            <CameraIcon className="w-4 h-4" />
            Foto positie vastleggen ({lockedPositions.length}/{maxPositions})
          </button>
        </div>
      </div>

      {lockedPositions.length > 0 && (
        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="text-white font-medium mb-2">Vastgelegde Hoeken:</h3>
          <div className="space-y-2">
            {lockedPositions.map((pos, index) => (
              <div key={index} className="text-gray-300 flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <span className="flex-1">{pos.label}</span>
                <span className="text-sm text-gray-400">{Math.abs(pos.angle).toFixed(0)}°</span>
                <button
                  onClick={() => onPositionRemove(index)}
                  className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Verwijder positie"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedPositions.length === maxPositions && currentProduct < totalProducts && (
        <button
          onClick={onProductComplete}
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcwIcon className="w-4 h-4" />
          Ga naar volgend product
        </button>
      )}
    </div>
  );
}