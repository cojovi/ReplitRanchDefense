import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "menu" | "playing" | "paused" | "gameOver";
export type Difficulty = "easy" | "normal" | "hard";

interface GameStateStore {
  gameState: GameState;
  difficulty: Difficulty;
  score: number;
  gameTime: number;
  isPaused: boolean;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  endGame: () => void;
  restartGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  updateScore: (points: number) => void;
  updateGameTime: (delta: number) => void;
}

export const useGameState = create<GameStateStore>()(
  subscribeWithSelector((set, get) => ({
    gameState: "menu",
    difficulty: "normal",
    score: 0,
    gameTime: 0,
    isPaused: false,
    
    startGame: () => {
      console.log("Starting game...");
      
      set({ 
        gameState: "playing", 
        score: 0, 
        gameTime: 0, 
        isPaused: false 
      });
      
      console.log("Game started! State changed to playing");
    },
    
    pauseGame: () => {
      set({ isPaused: true, gameState: "paused" });
    },
    
    resumeGame: () => {
      set({ isPaused: false, gameState: "playing" });
    },
    
    togglePause: () => {
      const { isPaused } = get();
      if (isPaused) {
        set({ isPaused: false, gameState: "playing" });
      } else {
        set({ isPaused: true, gameState: "paused" });
      }
    },
    
    endGame: () => {
      console.log("Game ended with score:", get().score);
      set({ gameState: "gameOver" });
    },
    
    restartGame: () => {
      console.log("Restarting game...");
      
      set({ 
        gameState: "playing", 
        score: 0, 
        gameTime: 0, 
        isPaused: false 
      });
      
      console.log("Game restarted! State changed to playing");
    },
    
    setDifficulty: (difficulty) => {
      set({ difficulty });
    },
    
    updateScore: (points) => {
      set((state) => ({ score: state.score + points }));
    },
    
    updateGameTime: (delta) => {
      set((state) => ({ gameTime: state.gameTime + delta }));
    }
  }))
);

// Subscribe to ESC key for pause
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      const { gameState, togglePause } = useGameState.getState();
      if (gameState === 'playing' || gameState === 'paused') {
        togglePause();
        event.preventDefault();
      }
    }
  });
}
