import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export default function Level() {
  const grassTexture = useTexture("/textures/grass.png");
  const woodTexture = useTexture("/textures/wood.jpg");
  const asphaltTexture = useTexture("/textures/asphalt.png");

  // Configure textures for retro look
  useMemo(() => {
    [grassTexture, woodTexture, asphaltTexture].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
    });
    
    grassTexture.repeat.set(20, 20);
    woodTexture.repeat.set(4, 4);
    asphaltTexture.repeat.set(8, 8);
  }, [grassTexture, woodTexture, asphaltTexture]);

  return (
    <group>
      {/* Ground plane - ranch pasture */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>

      {/* Barn structure */}
      <group position={[15, 0, -10]}>
        {/* Barn walls */}
        <mesh castShadow position={[0, 5, 0]}>
          <boxGeometry args={[12, 10, 8]} />
          <meshLambertMaterial map={woodTexture} color="#8B4513" />
        </mesh>
        
        {/* Barn roof */}
        <mesh castShadow position={[0, 10, 0]}>
          <coneGeometry args={[8, 4, 4]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        
        {/* Barn door */}
        <mesh position={[-6.1, 2.5, 0]}>
          <boxGeometry args={[0.2, 5, 4]} />
          <meshLambertMaterial map={woodTexture} color="#654321" />
        </mesh>
      </group>

      {/* Equipment shed */}
      <group position={[-20, 0, 5]}>
        <mesh castShadow position={[0, 3, 0]}>
          <boxGeometry args={[8, 6, 6]} />
          <meshLambertMaterial map={asphaltTexture} color="#666666" />
        </mesh>
      </group>

      {/* Fencing */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={`fence-${i}`} castShadow position={[i * 4 - 40, 1.5, 25]}>
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshLambertMaterial map={woodTexture} color="#8B4513" />
        </mesh>
      ))}

      {/* Water trough */}
      <mesh castShadow position={[5, 0.5, 15]}>
        <boxGeometry args={[4, 1, 1]} />
        <meshLambertMaterial color="#4169E1" />
      </mesh>

      {/* Hay bales scattered around */}
      {[
        [10, 1, 10],
        [-5, 1, 18],
        [25, 1, -5],
        [-15, 1, -8]
      ].map((pos, i) => (
        <mesh key={`hay-${i}`} castShadow position={pos as [number, number, number]}>
          <cylinderGeometry args={[1.5, 1.5, 2, 8]} />
          <meshLambertMaterial color="#DAA520" />
        </mesh>
      ))}

      {/* Trees for atmosphere */}
      {[
        [-30, 0, -20],
        [40, 0, 15],
        [-25, 0, 30],
        [35, 0, -25]
      ].map((pos, i) => (
        <group key={`tree-${i}`} position={pos as [number, number, number]}>
          {/* Trunk */}
          <mesh castShadow position={[0, 4, 0]}>
            <cylinderGeometry args={[0.8, 1, 8, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          {/* Foliage */}
          <mesh castShadow position={[0, 10, 0]}>
            <sphereGeometry args={[4, 8, 6]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
        </group>
      ))}

      {/* Invisible collision walls around the playable area */}
      <mesh position={[0, 10, 100]} visible={false}>
        <boxGeometry args={[200, 20, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[0, 10, -100]} visible={false}>
        <boxGeometry args={[200, 20, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[100, 10, 0]} visible={false}>
        <boxGeometry args={[1, 20, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[-100, 10, 0]} visible={false}>
        <boxGeometry args={[1, 20, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
