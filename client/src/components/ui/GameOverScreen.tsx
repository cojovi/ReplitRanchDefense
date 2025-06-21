import { useGameState } from "../../lib/stores/useGameState";
import { useEnemies } from "../../lib/stores/useEnemies";
import { useWeapons } from "../../lib/stores/useWeapons";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function GameOverScreen() {
  const { score, gameTime, restartGame, difficulty } = useGameState();
  const { enemiesKilled, totalEnemiesSpawned } = useEnemies();
  const { shotsFired } = useWeapons();

  const accuracy = shotsFired > 0 ? Math.round((enemiesKilled / shotsFired) * 100) : 0;
  const timeMinutes = Math.floor(gameTime / 60);
  const timeSeconds = Math.floor(gameTime % 60);

  // Calculate performance rating
  const getPerformanceRating = () => {
    if (accuracy >= 80 && enemiesKilled >= 20) return "LEGENDARY HUNTER";
    if (accuracy >= 60 && enemiesKilled >= 15) return "SEASONED RANCHER";
    if (accuracy >= 40 && enemiesKilled >= 10) return "DECENT SHOT";
    if (accuracy >= 20 && enemiesKilled >= 5) return "ROOKIE HUNTER";
    return "CITY SLICKER";
  };

  // One-liners based on performance
  const getOneLiner = () => {
    const rating = getPerformanceRating();
    const oneLiners = {
      "LEGENDARY HUNTER": [
        "That'll do, pig! That'll do!",
        "Time to chew bubblegum and cull hogs... and I'm all outta gum!",
        "Groovy, baby!"
      ],
      "SEASONED RANCHER": [
        "Not bad for a day's work!",
        "These hogs picked the wrong ranch!",
        "Yee-haw! That's how we do it in Texas!"
      ],
      "DECENT SHOT": [
        "Could use some target practice!",
        "Better than nothin', I reckon.",
        "At least the cattle are safe!"
      ],
      "ROOKIE HUNTER": [
        "Might want to stick to herdin' cattle.",
        "Those hogs ain't gonna fear you anytime soon.",
        "Better luck next time, partner."
      ],
      "CITY SLICKER": [
        "Maybe try a different profession?",
        "The hogs are laughing at you.",
        "Time to head back to the city!"
      ]
    };
    
    const lines = oneLiners[rating] || oneLiners["CITY SLICKER"];
    return lines[Math.floor(Math.random() * lines.length)];
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-red-900 via-orange-800 to-yellow-900 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-4 bg-black/80 border-orange-600 border-4">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-red-400 pixel-font mb-2">
            RANCH CLEARED
          </CardTitle>
          <p className="text-orange-300 text-lg pixel-font">{getPerformanceRating()}</p>
          <p className="text-yellow-600 italic">"{getOneLiner()}"</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/60 border border-orange-600 p-3 text-center">
              <div className="text-orange-300 text-sm pixel-font">HOGS CULLED</div>
              <div className="text-yellow-400 text-2xl font-bold pixel-font">{enemiesKilled}</div>
            </div>
            
            <div className="bg-black/60 border border-orange-600 p-3 text-center">
              <div className="text-orange-300 text-sm pixel-font">ACCURACY</div>
              <div className="text-yellow-400 text-2xl font-bold pixel-font">{accuracy}%</div>
            </div>
            
            <div className="bg-black/60 border border-orange-600 p-3 text-center">
              <div className="text-orange-300 text-sm pixel-font">TIME</div>
              <div className="text-yellow-400 text-xl font-bold pixel-font">
                {timeMinutes}:{timeSeconds.toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="bg-black/60 border border-orange-600 p-3 text-center">
              <div className="text-orange-300 text-sm pixel-font">FINAL SCORE</div>
              <div className="text-yellow-400 text-2xl font-bold pixel-font">{score}</div>
            </div>
          </div>

          {/* Detailed stats */}
          <div className="bg-black/60 border border-orange-600 p-4">
            <div className="text-orange-300 text-sm pixel-font mb-2">DETAILED STATS</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-yellow-600">
              <div>Shots Fired: {shotsFired}</div>
              <div>Difficulty: {difficulty.toUpperCase()}</div>
              <div>Hit Rate: {shotsFired > 0 ? Math.round((enemiesKilled / shotsFired) * 100) : 0}%</div>
              <div>Hogs Spawned: {totalEnemiesSpawned}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={restartGame}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 pixel-font text-lg border-2 border-orange-400"
            >
              HUNT AGAIN
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full bg-black/60 text-orange-300 border-orange-600 hover:bg-orange-900/30 pixel-font border-2"
            >
              BACK TO MENU
            </Button>
          </div>

          {/* Easter egg hint */}
          <div className="text-center text-xs text-yellow-700 italic">
            Explore the ranch thoroughly for hidden secrets...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
