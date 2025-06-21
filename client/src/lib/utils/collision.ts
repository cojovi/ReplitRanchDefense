import * as THREE from "three";

export interface AABB {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export function createAABB(position: THREE.Vector3, size: THREE.Vector3): AABB {
  const halfSize = size.clone().multiplyScalar(0.5);
  return {
    min: position.clone().sub(halfSize),
    max: position.clone().add(halfSize)
  };
}

export function checkAABBCollision(a: AABB, b: AABB): boolean {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y &&
    a.min.z <= b.max.z &&
    a.max.z >= b.min.z
  );
}

export function checkCollision(
  position1: THREE.Vector3,
  size1: THREE.Vector3,
  position2: THREE.Vector3,
  size2: THREE.Vector3
): boolean {
  const aabb1 = createAABB(position1, size1);
  const aabb2 = createAABB(position2, size2);
  return checkAABBCollision(aabb1, aabb2);
}

export function getCollisionNormal(
  position1: THREE.Vector3,
  size1: THREE.Vector3,
  position2: THREE.Vector3,
  size2: THREE.Vector3
): THREE.Vector3 {
  const direction = position1.clone().sub(position2);
  direction.y = 0; // Keep collision horizontal
  return direction.normalize();
}

// Simple ray-sphere intersection for bullet collision
export function rayIntersectsSphere(
  rayOrigin: THREE.Vector3,
  rayDirection: THREE.Vector3,
  sphereCenter: THREE.Vector3,
  sphereRadius: number
): boolean {
  const oc = rayOrigin.clone().sub(sphereCenter);
  const a = rayDirection.dot(rayDirection);
  const b = 2.0 * oc.dot(rayDirection);
  const c = oc.dot(oc) - sphereRadius * sphereRadius;
  const discriminant = b * b - 4 * a * c;
  
  return discriminant > 0;
}
