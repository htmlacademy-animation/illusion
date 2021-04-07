import vertexShader from './shaders/simple-vertex-shader';

const THREE = require('three');

class ViewportRadialGradientMaterial extends THREE.RawShaderMaterial {
  constructor(outerColor = 0x000000, centerColor = 0xffffff) {
    super({
      uniforms: {
        tDiffuse: {
          value: null
        },
        outerColor: {
          value: new THREE.Color(outerColor)
        },
        centerColor: {
          value: new THREE.Color(centerColor)
        }
      },
      vertexShader,
      fragmentShader: `
        precision mediump float;
    
        uniform sampler2D tDiffuse;
        uniform vec3 outerColor;
        uniform vec3 centerColor;
    
        varying vec2 vUv;
    
        highp vec3 smoothstepvec3(vec3 color0, vec3 color1, float edge0, float edge1, float x) {
          highp float ratio = smoothstep(edge0, edge1, x);
          return mix(color0, color1, ratio);
        }
    
        void main() {
          vec4 texel = texture2D( tDiffuse, vUv );
    
          float scale = 1.3;
          vec2 centeredUv = 2.0 * (vUv - vec2(0.5));
          centeredUv /= scale;
          float ratio = sqrt(centeredUv.x * centeredUv.x + centeredUv.y * centeredUv.y);
    
          vec4 gradientColor = vec4(smoothstepvec3(centerColor, outerColor, 0.0, 1.0, ratio), 1.0);
    
          gl_FragColor = gradientColor;
        }`
    });
  }
}

export default ViewportRadialGradientMaterial;
