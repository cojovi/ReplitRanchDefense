import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Bullet as BulletType } from "../../lib/stores/useWeapons";

interface BulletProps {
  bullet: BulletType;
}

export default function Bullet({ bullet }: BulletProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(bullet.position);
    }
  });

  return (
    <group>
      {/* Bullet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshStandardMaterial color="#FFD700" emissive="#FF8C00" />
      </mesh>
    </group>
  );
}
