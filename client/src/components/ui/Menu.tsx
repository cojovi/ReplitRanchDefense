import { useGameState } from "../../lib/stores/useGameState";

export default function Menu() {
  const { gameState, startGame, setDifficulty, difficulty } = useGameState();

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-orange-900 via-yellow-800 to-orange-900 flex items-center justify-center">
      {/* Background ranch silhouette */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1000 600" className="w-full h-full pointer-events-none">
          {/* Barn silhouette */}
          <polygon points="200,400 300,300 400,400 400,500 200,500" fill="#000" />
          {/* Fence silhouette */}
          <rect x="100" y="450" width="5" height="50" fill="#000" />
          <rect x="120" y="450" width="5" height="50" fill="#000" />
          <rect x="140" y="450" width="5" height="50" fill="#000" />
          <rect x="160" y="450" width="5" height="50" fill="#000" />
          {/* Tree silhouettes */}
          <circle cx="600" cy="420" r="40" fill="#000" />
          <rect x="595" y="460" width="10" height="40" fill="#000" />
          <circle cx="800" cy="440" r="30" fill="#000" />
          <rect x="796" y="470" width="8" height="30" fill="#000" />
        </svg>
      </div>

      <div className="w-full max-w-md mx-4 bg-black/80 border-orange-600 border-2 rounded-lg shadow-lg relative z-50" style={{ pointerEvents: 'all' }}>
        <div className="text-center p-6">
          <h1 className="text-4xl font-bold text-orange-400 pixel-font">
            ONESHOT
          </h1>
          <h2 className="text-3xl font-bold text-yellow-400 pixel-font">
            PREDATOR NUKEM
          </h2>
          <p className="text-orange-300 text-lg pixel-font">Ranch Defense</p>
          <p className="text-yellow-600 text-sm">Defend Your Cattle from Wild Boars!</p>
        </div>

        <div className="space-y-6 p-6">
          {/* Difficulty selection */}
          <div className="space-y-3">
            <h3 className="text-orange-300 font-bold text-center pixel-font">SELECT DIFFICULTY</h3>
            <div className="grid gap-2">
              {[
                { key: 'easy', label: 'EASY', description: 'For city folk' },
                { key: 'normal', label: 'RANCH HAND', description: 'True Texas style' },
                { key: 'hard', label: 'HARDCORE', description: 'Legendary hunter' }
              ].map(({ key, label, description }) => (
                <button
                  key={key}
                  className={`w-full pixel-font text-left p-3 border-2 cursor-pointer ${
                    difficulty === key 
                      ? "bg-orange-600 text-white border-orange-400" 
                      : "bg-black/60 text-orange-300 border-orange-600 hover:bg-orange-900/30"
                  }`}
                  onClick={() => {
                    console.log("Difficulty button clicked:", key);
                    setDifficulty(key as any);
                  }}
                >
                  <div>
                    <div className="font-bold">{label}</div>
                    <div className="text-xs opacity-80">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start game button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Start button clicked, current state:", gameState);
              startGame();
              console.log("After startGame called");
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 pixel-font text-lg border-2 border-orange-400 cursor-pointer relative z-10"
            style={{ 
              padding: '12px 24px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '4px',
              outline: 'none',
              pointerEvents: 'all',
              position: 'relative',
              zIndex: 1000
            }}
            onMouseEnter={() => console.log("Mouse entered start button")}
            onMouseLeave={() => console.log("Mouse left start button")}
          >
            START HUNTIN'
          </button>

          {/* Controls info */}
          <div className="text-center text-sm text-orange-400 space-y-1">
            <div className="font-bold pixel-font">CONTROLS</div>
            <div>WASD - Move • Mouse - Look • Space - Jump</div>
            <div>Shift - Sprint • Left Click - Fire • R - Reload</div>
            <div>1/2/3 - Weapons • Esc - Pause • M - Mute</div>
          </div>

          {/* Flavor text */}
          <div className="text-center text-xs text-yellow-600 italic">
            "Those hogs ain't gonna cull themselves!"
          </div>
        </div>
      </div>
    </div>
  );
}
