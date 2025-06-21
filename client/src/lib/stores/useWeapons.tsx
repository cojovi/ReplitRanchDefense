import { create } from "zustand";
import * as THREE from "three";
import { useEnemies } from "./useEnemies";
import { useGameState } from "./useGameState";
import { playSound } from "../utils/audio";

export type WeaponType = "rifle" | "shotgun" | "tnt";

export interface Weapon {
  name: string;
  damage: number;
  ammo: number;
  maxAmmo: number;
  fireRate: number; // seconds between shots
  reloadTime: number; // seconds to reload
  isReloading: boolean;
  unlocked: boolean;
  range: number;
}

export interface Bullet {
  id: string;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  damage: number;
  life: number;
  maxLife: number;
}

interface WeaponsState {
  currentWeapon: WeaponType;
  weapons: Record<WeaponType, Weapon>;
  bullets: Bullet[];
  shotsFired: number;
  
  // Actions
  switchWeapon: (weapon: WeaponType) => void;
  fire: (position: THREE.Vector3, rotation: THREE.Euler) => void;
  reload: () => void;
  canFire: () => boolean;
  updateBullets: (delta: number, enemies: any[]) => void;
  unlockWeapon: (weapon: WeaponType) => void;
  resetWeapons: () => void;
}

const initialWeapons: Record<WeaponType, Weapon> = {
  rifle: {
    name: "Lever-Action Rifle",
    damage: 25,
    ammo: Infinity,
    maxAmmo: Infinity,
    fireRate: 1.2,
    reloadTime: 2.0,
    isReloading: false,
    unlocked: true,
    range: 100
  },
  shotgun: {
    name: "Pump Shotgun",
    damage: 15, // per pellet
    ammo: 8,
    maxAmmo: 8,
    fireRate: 0.8,
    reloadTime: 3.0,
    isReloading: false,
    unlocked: false,
    range: 30
  },
  tnt: {
    name: "TX-TNT Bundle",
    damage: 100,
    ammo: 3,
    maxAmmo: 3,
    fireRate: 1.5,
    reloadTime: 0,
    isReloading: false,
    unlocked: false,
    range: 50
  }
};

export const useWeapons = create<WeaponsState>((set, get) => ({
  currentWeapon: "rifle",
  weapons: { ...initialWeapons },
  bullets: [],
  shotsFired: 0,
  
  switchWeapon: (weapon) => {
    const { weapons } = get();
    if (weapons[weapon].unlocked) {
      console.log(`Switching to ${weapon}`);
      set({ currentWeapon: weapon });
    }
  },
  
  fire: (position: THREE.Vector3, rotation: THREE.Euler) => {
    const { currentWeapon, weapons, bullets, shotsFired } = get();
    const weapon = weapons[currentWeapon];
    
    if (!weapon.unlocked || weapon.isReloading || weapon.ammo <= 0) {
      return;
    }
    
    // Validate inputs
    if (!position || !rotation) {
      console.error('Invalid position or rotation passed to fire:', { position, rotation });
      return;
    }
    
    // Use the validated inputs directly
    const bulletPosition = position;
    const bulletRotation = rotation;
    
    console.log(`Firing ${currentWeapon}`);
    
    // Create bullets based on weapon type
    const newBullets: Bullet[] = [];
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyEuler(bulletRotation);
    
    if (currentWeapon === "rifle") {
      // Single precise bullet
      newBullets.push({
        id: Math.random().toString(36).substr(2, 9),
        position: bulletPosition.clone(),
        direction: forward.clone(),
        speed: 100,
        damage: weapon.damage,
        life: 0,
        maxLife: weapon.range / 100
      });
    } else if (currentWeapon === "shotgun") {
      // Multiple pellets with spread
      for (let i = 0; i < 8; i++) {
        const spread = new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2,
          0
        );
        const pelletDirection = forward.clone().add(spread).normalize();
        
        newBullets.push({
          id: Math.random().toString(36).substr(2, 9),
          position: bulletPosition.clone(),
          direction: pelletDirection,
          speed: 80,
          damage: weapon.damage,
          life: 0,
          maxLife: weapon.range / 80
        });
      }
    } else if (currentWeapon === "tnt") {
      // Explosive projectile
      newBullets.push({
        id: Math.random().toString(36).substr(2, 9),
        position: bulletPosition.clone(),
        direction: forward.clone(),
        speed: 30,
        damage: weapon.damage,
        life: 0,
        maxLife: weapon.range / 30
      });
    }
    
    // Update weapon ammo
    const updatedWeapons = { ...weapons };
    if (weapon.ammo !== Infinity) {
      updatedWeapons[currentWeapon] = {
        ...weapon,
        ammo: weapon.ammo - 1
      };
    }
    
    set({
      weapons: updatedWeapons,
      bullets: [...bullets, ...newBullets],
      shotsFired: shotsFired + 1
    });
  },
  
  reload: () => {
    const { currentWeapon, weapons } = get();
    const weapon = weapons[currentWeapon];
    
    if (weapon.ammo === weapon.maxAmmo || weapon.ammo === Infinity || weapon.isReloading) {
      return;
    }
    
    console.log(`Reloading ${currentWeapon}`);
    
    const updatedWeapons = { ...weapons };
    updatedWeapons[currentWeapon] = {
      ...weapon,
      isReloading: true
    };
    
    set({ weapons: updatedWeapons });
    
    // Complete reload after delay
    setTimeout(() => {
      const { weapons } = get();
      const updatedWeapons = { ...weapons };
      updatedWeapons[currentWeapon] = {
        ...updatedWeapons[currentWeapon],
        ammo: updatedWeapons[currentWeapon].maxAmmo,
        isReloading: false
      };
      set({ weapons: updatedWeapons });
      console.log(`${currentWeapon} reloaded`);
    }, weapon.reloadTime * 1000);
  },
  
  canFire: () => {
    const { currentWeapon, weapons } = get();
    const weapon = weapons[currentWeapon];
    return weapon.unlocked && !weapon.isReloading && weapon.ammo > 0;
  },
  
  updateBullets: (delta, enemies) => {
    const { bullets } = get();
    const hitRadius = 1;
    
    const updatedBullets = bullets.filter((bullet) => {
      // Safety check for bullet properties
      if (!bullet || !bullet.position || !bullet.direction) {
        console.warn('Invalid bullet detected, removing:', bullet);
        return false;
      }
      
      try {
        // Update bullet position
        bullet.position.add(bullet.direction.clone().multiplyScalar(bullet.speed * delta));
        bullet.life += delta;
        
        // Check if bullet expired
        if (bullet.life >= bullet.maxLife) {
          return false;
        }
        
        // Check collision with enemies
        for (const enemy of enemies) {
          if (!enemy || !enemy.position || enemy.state === "dead") continue;
          
          const distance = bullet.position.distanceTo(enemy.position);
          if (distance < hitRadius) {
            console.log(`Bullet hit enemy ${enemy.id} for ${bullet.damage} damage`);
            
            // Damage enemy
            useEnemies.getState().damageEnemy(enemy.id, bullet.damage);
            
            // Add score
            useGameState.getState().updateScore(10);
            
            // Play hit sound
            playSound('/sounds/hit.mp3', 0.4);
            
            // Remove bullet
            return false;
          }
        }
        
        // Check ground collision
        if (bullet.position.y < 0) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Error updating bullet:', error, bullet);
        return false; // Remove problematic bullet
      }
    });
    
    set({ bullets: updatedBullets });
  },
  
  unlockWeapon: (weapon) => {
    const { weapons } = get();
    console.log(`Unlocking weapon: ${weapon}`);
    
    const updatedWeapons = { ...weapons };
    updatedWeapons[weapon] = {
      ...updatedWeapons[weapon],
      unlocked: true
    };
    
    set({ weapons: updatedWeapons });
  },
  
  resetWeapons: () => {
    console.log("Resetting weapons");
    set({
      currentWeapon: "rifle",
      weapons: { ...initialWeapons },
      bullets: [],
      shotsFired: 0
    });
  }
}));
