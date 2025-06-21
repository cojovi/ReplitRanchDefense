uniform float time;
uniform vec3 color;
uniform sampler2D map;
uniform float pixelSize;
uniform bool useTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// 256-color palette quantization
vec3 quantizeColor(vec3 color) {
  return floor(color * 8.0) / 8.0;
}

// Dithering pattern for retro effect
float dither(vec2 uv) {
  vec2 grid = floor(uv * 64.0);
  return mod(grid.x + grid.y, 2.0) * 0.1;
}

void main() {
  vec2 pixelatedUv = floor(vUv * pixelSize) / pixelSize;
  
  vec3 baseColor = color;
  
  if (useTexture) {
    baseColor *= texture2D(map, pixelatedUv).rgb;
  }
  
  // Apply retro color quantization
  baseColor = quantizeColor(baseColor);
  
  // Add dithering
  baseColor += dither(vUv);
  
  // Simple lighting
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  float lightDot = max(dot(vNormal, lightDirection), 0.2);
  baseColor *= lightDot;
  
  gl_FragColor = vec4(baseColor, 1.0);
}
