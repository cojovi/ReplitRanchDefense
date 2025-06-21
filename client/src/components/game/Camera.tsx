import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { usePlayer } from "../../lib/stores/usePlayer";

export default function Camera() {
  const { camera } = useThree();
  const player = usePlayer((state) => state);

  useEffect(() => {
    // Set initial camera position
    if (player?.position) {
      camera.position.copy(player.position);
    } else {
      camera.position.set(0, 1.7, 0);
    }
    camera.fov = 75;
    camera.updateProjectionMatrix();
  }, [camera, player?.position]);

  return null;
}
