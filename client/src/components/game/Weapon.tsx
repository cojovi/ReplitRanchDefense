import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useWeapons } from "../../lib/stores/useWeapons";
import { usePlayer } from "../../lib/stores/usePlayer";
import { useGameState } from "../../lib/stores/useGameState";
import { playSound } from "../../lib/utils/audio";

enum Controls {
  fire = 'fire',
  reload = 'reload',
  weapon1 = 'weapon1',
  weapon2 = 'weapon2',
  weapon3 = 'weapon3'
}

export default function Weapon() {
  const weaponRef = useRef<THREE.Group>(null);
  const [subscribe, getKeys] = useKeyboardControls<Controls>();
  const { 
    currentWeapon, 
    weapons, 
    switchWeapon, 
    reload, 
    fire,
    canFire 
  } = useWeapons();
  const player = usePlayer((state) => state);
  const { gameState, isPaused } = useGameState();
  
  const lastFireTime = useRef(0);
  const recoilAmount = useRef(0);
  const firePressed = useRef(false);

  // Handle mouse clicks for firing
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (gameState !== 'playing' || isPaused) return;
      if (event.button === 0) { // Left mouse button
        console.log("Mouse clicked - attempting to fire");
        if (canFire() && player?.position && player?.rotation) {
          fire(player.position, player.rotation);
          recoilAmount.current = 0.1;
          
          // Play weapon sound
          if (currentWeapon === 'rifle') {
            playSound('/sounds/rifle.mp3', 0.3);
          } else if (currentWeapon === 'shotgun') {
            playSound('/sounds/shotgun.mp3', 0.5);
          }
          console.log("Weapon fired!");
        } else {
          console.log("Cannot fire:", { canFire: canFire(), hasPlayer: !!player });
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [gameState, isPaused, canFire, fire, player, currentWeapon]);

  // Handle weapon switching and other controls
  useFrame((state, delta) => {
    if (gameState !== 'playing' || isPaused) return;

    const keys = getKeys();

    // Weapon switching
    if (keys?.weapon1) switchWeapon('rifle');
    if (keys?.weapon2 && weapons.shotgun.unlocked) switchWeapon('shotgun');
    if (keys?.weapon3 && weapons.tnt.unlocked) switchWeapon('tnt');

    // Reload
    if (keys?.reload) {
      reload();
    }

    // Animate recoil
    if (recoilAmount.current > 0) {
      recoilAmount.current -= delta * 5;
      if (weaponRef.current) {
        weaponRef.current.position.z = -recoilAmount.current * 0.2;
        weaponRef.current.rotation.x = -recoilAmount.current * 0.5;
      }
    }
  });

  // Weapon model (simple geometric representation)
  const renderWeapon = () => {
    const weapon = weapons[currentWeapon];
    
    switch (currentWeapon) {
      case 'rifle':
        return (
          <group>
            {/* Rifle barrel */}
            <mesh position={[0, -0.1, -0.8]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
              <meshLambertMaterial color="#444444" />
            </mesh>
            {/* Rifle stock */}
            <mesh position={[0, -0.05, 0.3]}>
              <boxGeometry args={[0.1, 0.15, 0.6]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Lever action */}
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.05, 0.1, 0.3]} />
              <meshLambertMaterial color="#CD853F" />
            </mesh>
          </group>
        );
        
      case 'shotgun':
        return (
          <group>
            {/* Shotgun barrel */}
            <mesh position={[0, -0.1, -0.6]}>
              <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
              <meshLambertMaterial color="#333333" />
            </mesh>
            {/* Shotgun stock */}
            <mesh position={[0, -0.05, 0.2]}>
              <boxGeometry args={[0.12, 0.18, 0.5]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            {/* Pump */}
            <mesh position={[0, -0.15, -0.2]}>
              <boxGeometry args={[0.08, 0.06, 0.2]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
          </group>
        );
        
      case 'tnt':
        return (
          <group>
            {/* TNT stick */}
            <mesh position={[0, -0.1, -0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
              <meshLambertMaterial color="#DC143C" />
            </mesh>
            {/* TNT fuse */}
            <mesh position={[0, 0.1, -0.1]}>
              <cylinderGeometry args={[0.005, 0.005, 0.1, 4]} />
              <meshLambertMaterial color="#000000" />
            </mesh>
          </group>
        );
        
      default:
        return null;
    }
  };

  return (
    <group 
      ref={weaponRef}
      position={[0.3, -0.3, -0.5]}
      rotation={[0, 0, 0]}
    >
      {renderWeapon()}
    </group>
  );
}
