import { create } from "zustand";
import * as THREE from "three";

export type EnemyState = "patrolling" | "charging" | "dead";

export interface Enemy {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  health: number;
  maxHealth: number;
  state: EnemyState;
  speed: number;
  damage: number;
  lastAttackTime: number;
  patrolTarget: THREE.Vector3;
  aggroRange: number;
  attackRange: number;
  type: "boar" | "tusker";
}

interface EnemiesState {
  enemies: Enemy[];
  enemiesKilled: number;
  totalEnemiesSpawned: number;
  
  // Actions
  spawnEnemy: (position: THREE.Vector3, type?: "boar" | "tusker") => void;
  updateEnemies: (delta: number, playerPosition: THREE.Vector3) => void;
  damageEnemy: (enemyId: string, damage: number) => void;
  removeEnemy: (enemyId: string) => void;
  resetEnemies: () => void;
}

const createEnemy = (position: THREE.Vector3, type: "boar" | "tusker" = "boar"): Enemy => {
  const baseStats = {
    boar: { health: 30, speed: 6, damage: 15, aggroRange: 20 },
    tusker: { health: 60, speed: 4, damage: 25, aggroRange: 25 }
  };
  
  const stats = baseStats[type];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    position: position.clone(),
    velocity: new THREE.Vector3(),
    rotation: Math.random() * Math.PI * 2,
    health: stats.health,
    maxHealth: stats.health,
    state: "patrolling",
    speed: stats.speed,
    damage: stats.damage,
    lastAttackTime: 0,
    patrolTarget: position.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20
    )),
    aggroRange: stats.aggroRange,
    attackRange: 2,
    type
  };
};

export const useEnemies = create<EnemiesState>((set, get) => ({
  enemies: [],
  enemiesKilled: 0,
  totalEnemiesSpawned: 0,
  
  spawnEnemy: (position, type = "boar") => {
    const enemy = createEnemy(position, type);
    console.log(`Spawning ${type} enemy at`, position.toArray());
    
    set((state) => ({
      enemies: [...state.enemies, enemy],
      totalEnemiesSpawned: state.totalEnemiesSpawned + 1
    }));
  },
  
  updateEnemies: (delta, playerPosition) => {
    const { enemies } = get();
    
    const updatedEnemies = enemies.map((enemy) => {
      if (enemy.state === "dead") return enemy;
      
      const distanceToPlayer = enemy.position.distanceTo(playerPosition);
      
      // State transitions
      if (enemy.state === "patrolling" && distanceToPlayer < enemy.aggroRange) {
        console.log(`Enemy ${enemy.id} is now charging player`);
        enemy.state = "charging";
      }
      
      // Behavior based on state
      if (enemy.state === "patrolling") {
        // Move towards patrol target
        const direction = enemy.patrolTarget.clone().sub(enemy.position);
        if (direction.length() < 2) {
          // Pick new patrol target
          enemy.patrolTarget = enemy.position.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            0,
            (Math.random() - 0.5) * 30
          ));
        } else {
          direction.normalize().multiplyScalar(enemy.speed * 0.3);
          enemy.velocity.copy(direction);
        }
      } else if (enemy.state === "charging") {
        // Charge towards player with zig-zag pattern
        const direction = playerPosition.clone().sub(enemy.position);
        direction.normalize();
        
        // Add zig-zag pattern
        const time = Date.now() * 0.005;
        const zigzag = new THREE.Vector3(
          Math.sin(time) * 2,
          0,
          Math.cos(time) * 2
        );
        
        direction.add(zigzag.normalize().multiplyScalar(0.3));
        direction.normalize().multiplyScalar(enemy.speed);
        enemy.velocity.copy(direction);
        
        // Attack if close enough
        if (distanceToPlayer < enemy.attackRange) {
          const currentTime = Date.now();
          if (currentTime - enemy.lastAttackTime > 2000) { // Reduced attack frequency
            console.log(`Enemy ${enemy.id} attacks player for ${enemy.damage} damage`);
            enemy.lastAttackTime = currentTime;
            
            // Actually damage the player
            const { usePlayer } = require("./usePlayer");
            usePlayer.getState().takeDamage(enemy.damage);
          }
        }
      }
      
      // Update position
      enemy.position.add(enemy.velocity.clone().multiplyScalar(delta));
      
      // Update rotation to face movement direction
      if (enemy.velocity.length() > 0) {
        enemy.rotation = Math.atan2(enemy.velocity.x, enemy.velocity.z);
      }
      
      return enemy;
    });
    
    set({ enemies: updatedEnemies });
  },
  
  damageEnemy: (enemyId, damage) => {
    const { enemies } = get();
    
    set({
      enemies: enemies.map((enemy) => {
        if (enemy.id === enemyId) {
          const newHealth = Math.max(0, enemy.health - damage);
          console.log(`Enemy ${enemyId} took ${damage} damage. Health: ${newHealth}`);
          
          if (newHealth <= 0 && enemy.state !== "dead") {
            console.log(`Enemy ${enemyId} died`);
            
            // Play death sound
            const { onEnemyKilled } = require("../utils/audio");
            onEnemyKilled();
            
            // Remove enemy after delay
            setTimeout(() => {
              get().removeEnemy(enemyId);
            }, 2000); // Keep body for 2 seconds
            
            return { ...enemy, health: 0, state: "dead" as EnemyState };
          }
          
          // Change to charging state when damaged
          const newState = enemy.state === "patrolling" ? "charging" : enemy.state;
          return { ...enemy, health: newHealth, state: newState };
        }
        return enemy;
      })
    });
  },
  
  removeEnemy: (enemyId) => {
    const { enemies, enemiesKilled } = get();
    const enemy = enemies.find(e => e.id === enemyId);
    
    if (enemy && enemy.state === "dead") {
      console.log(`Removing dead enemy ${enemyId}`);
      set({
        enemies: enemies.filter(e => e.id !== enemyId),
        enemiesKilled: enemiesKilled + 1
      });
    }
  },
  
  resetEnemies: () => {
    console.log("Resetting enemies");
    set({
      enemies: [],
      enemiesKilled: 0,
      totalEnemiesSpawned: 0
    });
  }
}));
