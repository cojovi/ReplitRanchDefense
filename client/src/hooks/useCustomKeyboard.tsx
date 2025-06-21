import { useEffect, useRef, useCallback } from 'react';

export interface KeyboardControls {
  forward: boolean;
  backward: boolean;
  leftward: boolean;
  rightward: boolean;
  jump: boolean;
  sprint: boolean;
  fire: boolean;
  reload: boolean;
  weapon1: boolean;
  weapon2: boolean;
  weapon3: boolean;
  pause: boolean;
}

const keyMappings: Record<string, keyof KeyboardControls> = {
  'KeyW': 'forward',
  'ArrowUp': 'forward',
  'KeyS': 'backward',
  'ArrowDown': 'backward',
  'KeyA': 'leftward',
  'ArrowLeft': 'leftward',
  'KeyD': 'rightward',
  'ArrowRight': 'rightward',
  'Space': 'jump',
  'ShiftLeft': 'sprint',
  'ShiftRight': 'sprint',
  'KeyR': 'reload',
  'Digit1': 'weapon1',
  'Digit2': 'weapon2',
  'Digit3': 'weapon3',
  'Escape': 'pause'
};

export function useCustomKeyboard() {
  const keysRef = useRef<KeyboardControls>({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    jump: false,
    sprint: false,
    fire: false,
    reload: false,
    weapon1: false,
    weapon2: false,
    weapon3: false,
    pause: false
  });

  const getKeys = useCallback(() => {
    return { ...keysRef.current };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = keyMappings[event.code];
      if (action) {
        keysRef.current[action] = true;
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const action = keyMappings[event.code];
      if (action) {
        keysRef.current[action] = false;
        event.preventDefault();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) { // Left mouse button
        keysRef.current.fire = true;
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) { // Left mouse button
        keysRef.current.fire = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return getKeys;
}