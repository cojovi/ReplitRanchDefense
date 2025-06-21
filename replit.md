# OneShot Predator Nukem: Ranch Defense

## Overview

This is a retro-style first-person shooter (FPS) game built with React Three Fiber and TypeScript. Players defend their ranch from wild boars using various weapons in a pixelated, retro-gaming aesthetic. The game features 3D graphics rendered in a browser, complete with physics, enemy AI, and multiple weapon systems.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Core application framework with strict typing
- **React Three Fiber**: 3D graphics rendering engine built on Three.js
- **React Three Drei**: Helper components for common 3D operations
- **React Three Postprocessing**: Visual effects and shaders
- **Zustand**: State management for game logic, player data, enemies, and weapons
- **Tailwind CSS**: Utility-first CSS framework for UI styling
- **Radix UI**: Accessible component primitives for UI elements

### Backend Architecture
- **Express.js**: HTTP server handling API routes
- **TypeScript**: Server-side code with type safety
- **In-memory storage**: Current implementation uses MemStorage class for data persistence
- **Drizzle ORM**: Database toolkit configured for PostgreSQL (ready for future database integration)

### 3D Game Engine Components
- **Custom shaders**: GLSL shaders for retro visual effects and pixelated rendering
- **Physics system**: Custom collision detection using AABB (Axis-Aligned Bounding Box)
- **Enemy AI**: State machine-based AI with patrolling, charging, and combat behaviors
- **Weapon system**: Multiple weapon types with different damage, fire rates, and ammo systems
- **Audio system**: HTML5 audio with caching and overlap support

## Key Components

### Game State Management
- **useGameState**: Central game state (menu, playing, paused, gameOver)
- **usePlayer**: Player position, health, movement, and physics
- **useEnemies**: Enemy spawning, AI behavior, and lifecycle management
- **useWeapons**: Weapon switching, ammunition, bullet physics, and combat
- **useAudio**: Sound effects, background music, and mute controls

### 3D Rendering
- **Canvas**: React Three Fiber root component
- **Camera**: First-person camera controller
- **Game**: Main game scene container
- **Floor**: Ground plane with retro texturing
- **Enemies**: 3D enemy models with animations
- **Bullets**: Projectile rendering with trail effects

### UI Components
- **Menu**: Main menu with difficulty selection
- **GameHUD**: In-game overlay showing health, ammo, score, and controls
- **GameOverScreen**: End game statistics and restart options

## Data Flow

1. **Game Initialization**: Menu loads → difficulty selection → game state transitions to "playing"
2. **Game Loop**: 
   - Input handling via KeyboardControls
   - Player movement and camera updates
   - Enemy AI updates (patrol → aggro → attack states)
   - Bullet physics and collision detection
   - UI updates (health, score, timer)
3. **Combat System**:
   - Weapon firing creates bullet entities
   - Collision detection between bullets and enemies
   - Damage calculation and enemy health reduction
   - Score updates and enemy cleanup
4. **Game End**: Player death or time limit triggers game over state

## External Dependencies

### 3D Graphics
- **@react-three/fiber**: Core 3D rendering
- **@react-three/drei**: 3D utilities (KeyboardControls, etc.)
- **@react-three/postprocessing**: Visual effects pipeline
- **three**: Underlying 3D graphics library

### UI Framework
- **@radix-ui/react-***: Complete set of accessible UI primitives
- **class-variance-authority**: Component variant management
- **clsx + tailwind-merge**: Conditional CSS class utilities

### State & Data
- **zustand**: Lightweight state management
- **@tanstack/react-query**: Server state management (prepared for API integration)
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL driver

### Development Tools
- **vite**: Fast build tool with HMR
- **vite-plugin-glsl**: GLSL shader support
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling

## Deployment Strategy

The application is configured for deployment on Replit with autoscaling:

- **Development**: `npm run dev` - runs Express server with Vite HMR
- **Production Build**: `npm run build` - bundles client and server code
- **Production**: `npm run start` - serves bundled application
- **Database**: Drizzle configured for PostgreSQL with migrations support

The build process:
1. Vite builds the React client to `dist/public`
2. esbuild bundles the Express server to `dist/index.js`
3. Static files are served from the server in production

## Changelog

- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.