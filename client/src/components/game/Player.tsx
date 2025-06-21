import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { usePlayer } from "../../lib/stores/usePlayer";
import { useGameState } from "../../lib/stores/useGameState";
import { checkCollision } from "../../lib/utils/collision";
import Weapon from "./Weapon";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
  sprint = 'sprint',
  fire = 'fire',
  reload = 'reload',
  weapon1 = 'weapon1',
  weapon2 = 'weapon2',
  weapon3 = 'weapon3'
}

export default function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const [subscribe, getKeys] = useKeyboardControls<Controls>();
  const player = usePlayer((state) => state);
  const { 
    updatePosition, 
    updateVelocity, 
    jump, 
    takeDamage, 
    setMouseSensitivity 
  } = usePlayer();
  const { gameState, isPaused } = useGameState();

  const mouseMovement = useRef({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);

  // Mouse look controls
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gameState !== 'playing' || isPaused || document.pointerLockElement !== gl.domElement) return;

      const sensitivity = player?.mouseSensitivity || 0.002;
      yaw.current -= event.movementX * sensitivity;
      pitch.current -= event.movementY * sensitivity;
      
      // Clamp pitch to prevent over-rotation
      pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
    };

    const handleClick = () => {
      if (gameState === 'playing' && !isPaused) {
        gl.domElement.requestPointerLock();
      }
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [gameState, isPaused, gl.domElement, player?.mouseSensitivity]);

  // Movement and physics
  useFrame((state, delta) => {
    if (gameState !== 'playing' || isPaused || !playerRef.current || !player) return;

    const keys = getKeys();
    const moveSpeed = keys?.sprint ? player.sprintSpeed : player.moveSpeed;
    
    // Calculate movement direction based on camera rotation
    const direction = new THREE.Vector3();
    const rightVector = new THREE.Vector3();
    
    camera.getWorldDirection(direction);
    direction.y = 0; // Keep movement horizontal
    direction.normalize();
    
    rightVector.crossVectors(direction, new THREE.Vector3(0, 1, 0));

    const moveVector = new THREE.Vector3();
    
    if (keys?.forward) moveVector.add(direction);
    if (keys?.backward) moveVector.sub(direction);
    if (keys?.rightward) moveVector.add(rightVector);
    if (keys?.leftward) moveVector.sub(rightVector);
    
    moveVector.normalize().multiplyScalar(moveSpeed);
    
    // Apply gravity and jumping
    let newVelocity = new THREE.Vector3(
      moveVector.x,
      player.velocity.y - player.gravity * delta,
      moveVector.z
    );

    if (keys?.jump && player?.isGrounded) {
      newVelocity.y = player.jumpPower;
      jump();
    }

    // Update position with collision detection
    const newPosition = player.position.clone().add(newVelocity.clone().multiplyScalar(delta));
    
    // Simple ground collision
    if (newPosition.y < 1.7) {
      newPosition.y = 1.7;
      newVelocity.y = 0;
    }

    updatePosition(newPosition);
    updateVelocity(newVelocity);

    // Update camera position and rotation
    camera.position.copy(newPosition);
    camera.rotation.set(pitch.current, yaw.current, 0);

    // Log movement for debugging
    if (moveVector.length() > 0) {
      console.log('Player moving:', { 
        position: newPosition.toArray(), 
        keys: Object.entries(keys).filter(([, pressed]) => pressed).map(([key]) => key)
      });
    }
  });

  return (
    <group ref={playerRef} position={player?.position?.toArray() || [0, 1.7, 0]}>
      <Weapon />
    </group>
  );
}
