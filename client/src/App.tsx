import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useGameState } from "./lib/stores/useGameState";
import { useAudio } from "./lib/stores/useAudio";
import Game from "./components/game/Game";
import Menu from "./components/ui/Menu";
import GameHUD from "./components/ui/GameHUD";
import GameOverScreen from "./components/ui/GameOverScreen";
import "@fontsource/inter";

// Define control keys for the FPS game
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
  weapon3 = 'weapon3',
  pause = 'pause'
}

const controlMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.leftward, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.rightward, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.sprint, keys: ['ShiftLeft', 'ShiftRight'] },
  { name: Controls.fire, keys: ['Mouse0'] },
  { name: Controls.reload, keys: ['KeyR'] },
  { name: Controls.weapon1, keys: ['Digit1'] },
  { name: Controls.weapon2, keys: ['Digit2'] },
  { name: Controls.weapon3, keys: ['Digit3'] },
  { name: Controls.pause, keys: ['Escape'] }
];

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

  // Request pointer lock for mouse look
  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = document.querySelector('canvas');
      if (canvas && !isPaused) {
        canvas.requestPointerLock();
      }
    }
  }, [gameState, isPaused]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', cursor: gameState === 'playing' && !isPaused ? 'none' : 'default' }}>
      {gameState === 'menu' && <Menu />}
      
      {gameState === 'gameOver' && <GameOverScreen />}
      
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <KeyboardControls map={controlMap}>
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
          </KeyboardControls>
          
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
