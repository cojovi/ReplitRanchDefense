import { usePlayer } from "../../lib/stores/usePlayer";
import { useWeapons } from "../../lib/stores/useWeapons";
import { useGameState } from "../../lib/stores/useGameState";
import { useEnemies } from "../../lib/stores/useEnemies";
import { useAudio } from "../../lib/stores/useAudio";

export default function GameHUD() {
  const player = usePlayer((state) => state);
  const { currentWeapon, weapons } = useWeapons();
  const { gameTime, isPaused, togglePause, score } = useGameState();
  const { enemiesKilled } = useEnemies();
  const { isMuted } = useAudio();

  const weapon = weapons[currentWeapon];
  const health = Math.max(0, player?.health || 0);
  const healthPercentage = (health / (player?.maxHealth || 100)) * 100;

  return (
    <>
      {/* Main HUD */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Top bar - Score and stats */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/80 border-2 border-orange-600 p-3 pixel-font text-orange-300">
            <div className="text-sm">HOGS CULLED: <span className="text-yellow-400">{enemiesKilled}</span></div>
            <div className="text-sm">SCORE: <span className="text-yellow-400">{score}</span></div>
            <div className="text-sm">TIME: <span className="text-yellow-400">{Math.floor(gameTime)}s</span></div>
          </div>
          
          <div className="bg-black/80 border-2 border-orange-600 p-2 pixel-font text-orange-300 text-sm">
            {isMuted ? "🔇 MUTED" : "🔊 SOUND ON"}
          </div>
        </div>

        {/* Bottom left - Health */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/80 border-2 border-orange-600 p-3 min-w-[200px]">
            <div className="pixel-font text-orange-300 text-sm mb-2">HEALTH</div>
            <div className="w-full h-6 bg-red-900 border border-red-600">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
            <div className="pixel-font text-white text-center text-sm mt-1">
              {health} / {player?.maxHealth || 100}
            </div>
          </div>
        </div>

        {/* Bottom right - Weapon info */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/80 border-2 border-orange-600 p-3 min-w-[200px]">
            <div className="pixel-font text-orange-300 text-sm mb-2">
              {weapon.name.toUpperCase()}
            </div>
            
            {currentWeapon !== 'tnt' && (
              <div className="flex justify-between items-center">
                <div className="pixel-font text-white text-lg">
                  {weapon.ammo === Infinity ? '∞' : weapon.ammo} / {weapon.maxAmmo === Infinity ? '∞' : weapon.maxAmmo}
                </div>
                {weapon.isReloading && (
                  <div className="pixel-font text-yellow-400 text-sm">RELOADING...</div>
                )}
              </div>
            )}
            
            {currentWeapon === 'tnt' && (
              <div className="pixel-font text-white text-lg">
                {weapon.ammo} BUNDLES
              </div>
            )}
            
            {/* Weapon selection hints */}
            <div className="mt-2 text-xs text-orange-400">
              <div>1 - RIFLE {!weapons.rifle.unlocked && '(LOCKED)'}</div>
              <div>2 - SHOTGUN {!weapons.shotgun.unlocked && '(LOCKED)'}</div>
              <div>3 - TX-TNT {!weapons.tnt.unlocked && '(LOCKED)'}</div>
            </div>
          </div>
        </div>

        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg width="40" height="40" className="text-orange-400">
            <line x1="20" y1="10" x2="20" y2="15" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="25" x2="20" y2="30" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Damage indicator */}
        {health < (player?.maxHealth || 100) * 0.3 && (
          <div className="absolute inset-0 border-4 border-red-500 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Pause menu */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border-4 border-orange-600 p-8 max-w-md w-full mx-4">
            <h2 className="pixel-font text-orange-400 text-3xl text-center mb-6">PAUSED</h2>
            
            <div className="space-y-4 text-center">
              <button
                onClick={togglePause}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 pixel-font text-lg border-2 border-orange-400 pointer-events-auto"
              >
                RESUME
              </button>
              
              <div className="pixel-font text-orange-300 text-sm space-y-1">
                <div>WASD - Move around the ranch</div>
                <div>Mouse - Look around</div>
                <div>Space - Jump over obstacles</div>
                <div>Shift - Sprint when in danger</div>
                <div>Left Click - Fire weapon</div>
                <div>R - Reload weapon</div>
                <div>1/2/3 - Switch weapons</div>
                <div>Esc - Pause game</div>
                <div>M - Toggle sound</div>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 pixel-font border-2 border-red-400 pointer-events-auto"
              >
                QUIT TO PASTURE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
