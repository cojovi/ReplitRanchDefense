import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Enemy as EnemyType } from "../../lib/stores/useEnemies";

interface EnemyProps {
  enemy: EnemyType;
}

export default function Enemy({ enemy }: EnemyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  
  // Create a simple sprite texture for the boar
  const spriteTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // Draw a simple pixel-art boar sprite
    ctx.fillStyle = '#4A4A4A'; // Dark grey body
    ctx.fillRect(8, 24, 48, 24); // Body
    
    ctx.fillStyle = '#8B4513'; // Brown fur
    ctx.fillRect(10, 26, 44, 20); // Fur overlay
    
    ctx.fillStyle = '#000000'; // Black features
    ctx.fillRect(12, 28, 4, 4); // Eye
    ctx.fillRect(8, 32, 8, 4); // Snout
    
    ctx.fillStyle = '#FFFFFF'; // White tusks
    ctx.fillRect(6, 34, 2, 4); // Left tusk
    ctx.fillRect(16, 34, 2, 4); // Right tusk
    
    ctx.fillStyle = '#654321'; // Dark brown legs
    ctx.fillRect(16, 48, 4, 12); // Front leg
    ctx.fillRect(32, 48, 4, 12); // Back leg
    
    // Red eyes when angry or blood when damaged
    if (enemy.state === 'charging') {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(12, 28, 4, 4);
    }
    
    // Blood splatter when damaged
    if (enemy.health < enemy.maxHealth && enemy.state !== 'dead') {
      ctx.fillStyle = '#AA0000';
      ctx.fillRect(20, 26, 2, 2);
      ctx.fillRect(24, 28, 2, 2);
      ctx.fillRect(18, 30, 2, 2);
    }
    
    // Death state - make darker
    if (enemy.state === 'dead') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, 64, 64);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    
    return texture;
  }, [enemy.state]);

  // Update sprite to always face camera
  useFrame(({ camera }) => {
    if (spriteRef.current) {
      spriteRef.current.lookAt(camera.position);
      
      // Scale based on distance for retro effect
      const distance = spriteRef.current.position.distanceTo(camera.position);
      const scale = Math.max(0.5, Math.min(2, 20 / distance));
      
      // Add death animation
      if (enemy.state === 'dead') {
        spriteRef.current.scale.setScalar(scale * 0.8); // Shrink when dead
        spriteRef.current.rotation.z = Math.PI / 2; // Tilt when dead
      } else {
        spriteRef.current.scale.setScalar(scale);
        spriteRef.current.rotation.z = 0;
      }
    }
  });

  // Collision box for debugging (invisible)
  const collisionBox = useMemo(() => (
    <mesh ref={meshRef} position={enemy.position.toArray()} visible={false}>
      <boxGeometry args={[2, 1.5, 2]} />
      <meshBasicMaterial color="red" transparent opacity={0.3} />
    </mesh>
  ), [enemy.position]);

  return (
    <group>
      {/* Sprite billboard */}
      <sprite
        ref={spriteRef}
        position={[enemy.position.x, enemy.position.y + 0.75, enemy.position.z]}
        scale={[2, 1.5, 1]}
      >
        <spriteMaterial map={spriteTexture} transparent />
      </sprite>
      
      {/* Collision box */}
      {collisionBox}
      
      {/* Health bar for damaged enemies */}
      {enemy.health < enemy.maxHealth && (
        <group position={[enemy.position.x, enemy.position.y + 2, enemy.position.z]}>
          <sprite scale={[2, 0.2, 1]}>
            <spriteMaterial color="red" transparent />
          </sprite>
          <sprite scale={[2 * (enemy.health / enemy.maxHealth), 0.2, 1]} position={[0, 0, 0.01]}>
            <spriteMaterial color="green" transparent />
          </sprite>
        </group>
      )}
    </group>
  );
}
