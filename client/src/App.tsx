import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useGameState } from "./lib/stores/useGameState";
import { useAudio } from "./lib/stores/useAudio";
import Game from "./components/game/Game";
import Menu from "./components/ui/Menu";
import GameHUD from "./components/ui/GameHUD";
import GameOverScreen from "./components/ui/GameOverScreen";
import "@fontsource/inter";



function App() {
  const { gameState, isPaused } = useGameState();
  const { toggleMute } = useAudio();

  // Handle global key events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle mute with M key
      if (event.code === 'KeyM') {
        toggleMute();
      }
      
      // Prevent default behavior for game keys
      const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyR', 'Digit1', 'Digit2', 'Digit3', 'Escape'];
      if (gameKeys.includes(event.code)) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);

  // Handle pointer lock requests safely
  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = document.querySelector('canvas');
      if (canvas && !isPaused && document.pointerLockElement !== canvas) {
        // Only request pointer lock on user interaction
        const handleUserClick = () => {
          try {
            canvas.requestPointerLock();
          } catch (error) {
            // Pointer lock errors are not critical for gameplay
          }
        };
        canvas.addEventListener('click', handleUserClick, { once: true });
        return () => canvas.removeEventListener('click', handleUserClick);
      }
    }
  }, [gameState, isPaused]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', cursor: gameState === 'playing' && !isPaused ? 'none' : 'default' }}>
      {gameState === 'menu' && <Menu />}
      
      {gameState === 'gameOver' && <GameOverScreen />}
      
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <Canvas
            shadows
            camera={{
              position: [0, 1.7, 0],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: false, // Disable for retro look
              powerPreference: "high-performance",
              alpha: false
            }}
            style={{ 
              imageRendering: 'pixelated',
              filter: 'contrast(1.1) saturate(1.2)'
            }}
          >
            <color attach="background" args={["#2d1810"]} />
            
            <Suspense fallback={null}>
              <Game />
            </Suspense>
          </Canvas>
          
          <GameHUD />
        </>
      )}
      
      {/* Instructions overlay */}
      <div style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        textShadow: '1px 1px 0px black',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        Press M to toggle sound
      </div>
    </div>
  );
}

export default App;
