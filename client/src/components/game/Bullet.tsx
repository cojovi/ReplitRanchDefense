import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Bullet as BulletType } from "../../lib/stores/useWeapons";

interface BulletProps {
  bullet: BulletType;
}

export default function Bullet({ bullet }: BulletProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Line>(null);
  const trailPoints = useRef<THREE.Vector3[]>([]);

  // Create bullet trail
  useEffect(() => {
    trailPoints.current = [bullet.position.clone()];
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(bullet.position);
      
      // Update trail
      trailPoints.current.push(bullet.position.clone());
      if (trailPoints.current.length > 10) {
        trailPoints.current.shift();
      }
      
      if (trailRef.current && trailPoints.current.length > 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints(trailPoints.current);
        trailRef.current.geometry.dispose();
        trailRef.current.geometry = geometry;
      }
    }
  });

  return (
    <group>
      {/* Bullet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color="#FFD700" emissive="#FF8C00" />
      </mesh>
      
      {/* Bullet trail */}
      <line ref={trailRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#FFD700" transparent opacity={0.6} />
      </line>
    </group>
  );
}
