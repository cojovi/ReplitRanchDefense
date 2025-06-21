import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Player from "./Player";
import Level from "./Level";
import Camera from "./Camera";
import { useGameState } from "../../lib/stores/useGameState";
import { useEnemies } from "../../lib/stores/useEnemies";
import { usePlayer } from "../../lib/stores/usePlayer";
import { useWeapons } from "../../lib/stores/useWeapons";
import Enemy from "./Enemy";
import Bullet from "./Bullet";

export default function Game() {
  const groupRef = useRef<THREE.Group>(null);
  const { gameState, isPaused, gameTime, updateGameTime } = useGameState();
  const { enemies, updateEnemies, spawnEnemy } = useEnemies();
  const player = usePlayer((state) => state);
  const { bullets, updateBullets } = useWeapons();

  // Game loop
  useFrame((state, delta) => {
    if (gameState !== 'playing' || isPaused) return;

    // Update game time
    updateGameTime(delta);

    // Update enemies
    if (player?.position) {
      updateEnemies(delta, player.position);
    }

    // Update bullets
    updateBullets(delta, enemies);

    // Spawn enemies periodically
    if (Math.random() < 0.001 && enemies.length < 8) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const spawnPos = new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );
      spawnEnemy(spawnPos);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#4a4a4a" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
        color="#ffd700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#8B4513", 30, 80]} />

      {/* Player and camera */}
      <Camera />
      <Player />

      {/* Level geometry */}
      <Level />

      {/* Enemies */}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}

      {/* Bullets */}
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} bullet={bullet} />
      ))}
    </group>
  );
}
