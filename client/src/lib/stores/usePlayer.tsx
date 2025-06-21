import { create } from "zustand";
import * as THREE from "three";
import { useGameState } from "./useGameState";

interface PlayerState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  health: number;
  maxHealth: number;
  moveSpeed: number;
  sprintSpeed: number;
  jumpPower: number;
  gravity: number;
  isGrounded: boolean;
  mouseSensitivity: number;
  
  // Actions
  updatePosition: (position: THREE.Vector3) => void;
  updateRotation: (rotation: THREE.Euler) => void;
  updateVelocity: (velocity: THREE.Vector3) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  jump: () => void;
  setMouseSensitivity: (sensitivity: number) => void;
  resetPlayer: () => void;
}

const initialState = {
  position: new THREE.Vector3(0, 1.7, 0),
  rotation: new THREE.Euler(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  health: 100,
  maxHealth: 100,
  moveSpeed: 8,
  sprintSpeed: 12,
  jumpPower: 10,
  gravity: 30,
  isGrounded: true,
  mouseSensitivity: 0.002
};

export const usePlayer = create<PlayerState>((set, get) => ({
  ...initialState,
  
  updatePosition: (position) => {
    set({ position: position.clone() });
  },
  
  updateRotation: (rotation) => {
    set({ rotation: rotation.clone() });
  },
  
  updateVelocity: (velocity) => {
    const isGrounded = velocity.y === 0;
    set({ velocity: velocity.clone(), isGrounded });
  },
  
  takeDamage: (amount) => {
    const { health } = get();
    const newHealth = Math.max(0, health - amount);
    console.log(`Player took ${amount} damage. Health: ${newHealth}`);
    set({ health: newHealth });
    
    // Check for game over
    if (newHealth <= 0) {
      console.log("Player died! Game over.");
      setTimeout(() => {
        useGameState.getState().endGame();
      }, 1000);
    }
  },
  
  heal: (amount) => {
    const { health, maxHealth } = get();
    const newHealth = Math.min(maxHealth, health + amount);
    set({ health: newHealth });
  },
  
  jump: () => {
    const { isGrounded } = get();
    if (isGrounded) {
      console.log("Player jumping");
      set({ isGrounded: false });
    }
  },
  
  setMouseSensitivity: (sensitivity) => {
    set({ mouseSensitivity: sensitivity });
  },
  
  resetPlayer: () => {
    console.log("Resetting player");
    set({
      ...initialState,
      position: new THREE.Vector3(0, 1.7, 0),
      rotation: new THREE.Euler(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0)
    });
  }
}));
