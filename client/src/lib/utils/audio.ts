import { useAudio } from "../stores/useAudio";

// Global audio instances for reuse
const audioCache = new Map<string, HTMLAudioElement>();

export function playSound(src: string, volume: number = 0.5): void {
  const { isMuted } = useAudio.getState();
  
  if (isMuted) {
    console.log(`Sound skipped (muted): ${src}`);
    return;
  }
  
  try {
    // Get or create audio instance
    let audio = audioCache.get(src);
    if (!audio) {
      audio = new Audio(src);
      audio.preload = 'auto';
      audioCache.set(src, audio);
    }
    
    // Clone the audio to allow overlapping playback
    const audioClone = audio.cloneNode() as HTMLAudioElement;
    audioClone.volume = volume;
    audioClone.currentTime = 0;
    
    audioClone.play().catch(error => {
      console.log(`Audio play prevented for ${src}:`, error);
    });
  } catch (error) {
    console.error(`Error playing sound ${src}:`, error);
  }
}

export function preloadSounds(sources: string[]): Promise<void[]> {
  const promises = sources.map(src => {
    return new Promise<void>((resolve, reject) => {
      if (audioCache.has(src)) {
        resolve();
        return;
      }
      
      const audio = new Audio(src);
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        audioCache.set(src, audio);
        resolve();
      });
      
      audio.addEventListener('error', reject);
    });
  });
  
  return Promise.all(promises);
}

// Hunter one-liners
const oneLiners = [
  "That'll do, pig!",
  "Groovy, baby!",
  "Time to chew bubblegum and cull hogs!",
  "These hogs picked the wrong ranch!",
  "Yee-haw! That's Texas style!",
  "Come get some!",
  "Hail to the king, baby!",
  "Let's rock and roll!"
];

export function playOneLiner(): void {
  const line = oneLiners[Math.floor(Math.random() * oneLiners.length)];
  console.log(`Hunter says: "${line}"`);
  
  // In a real implementation, this would use text-to-speech or pre-recorded audio
  // For now, we'll just log it and play a success sound
  playSound('/sounds/success.mp3', 0.3);
}

// Trigger one-liners on multi-kills
let killStreak = 0;
let lastKillTime = 0;

export function onEnemyKilled(): void {
  const currentTime = Date.now();
  
  // Reset streak if too much time has passed
  if (currentTime - lastKillTime > 3000) {
    killStreak = 0;
  }
  
  killStreak++;
  lastKillTime = currentTime;
  
  // Play one-liner on triple kill or higher
  if (killStreak >= 3) {
    setTimeout(() => playOneLiner(), 500);
    killStreak = 0; // Reset after one-liner
  }
  
  // Play regular kill sound
  playSound('/sounds/boar_squeal.mp3', 0.4);
}
