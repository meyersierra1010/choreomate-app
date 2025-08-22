import * as THREE from 'three';

export class ChromaKeyVideoShaderMaterial extends THREE.ShaderMaterial {

  constructor(video, options) {
    options = options || {};
    options.chromaKey = new THREE.Color( options.chromaKey || 0xd400 );
    options.range = options.range || 0.5;
    options.mult = options.mult || 7.0;

    const videoTexture = new THREE.VideoTexture( video );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    super({
      uniforms: {
        tex: {
          type: 't',
          value: videoTexture
        },
        chromaKey: {
          type: 'c',
          value: options.chromaKey
        },
        range: {
          type: 'r',
          value: options.range
        },
        mult: {
          type: 'r',
          value: options.mult
        }
      },
      
      vertexShader: '                                             \
        varying vec2 vUv;                                          \
        void main() {                                               \
          vUv = uv;                                                  \
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );  \
          gl_Position = projectionMatrix * mvPosition;                 \
        }                                                               \
      ',
      
      fragmentShader: '                                   \
        uniform sampler2D tex;                             \
        uniform vec3 chromaKey;                             \
        uniform float range;                                 \
        uniform float mult;                                   \
        varying vec2 vUv;                                      \
        void main() {                                           \
          vec3 tColor = texture2D( tex, vUv ).rgb;               \
          float a = (length(tColor - chromaKey) - range) * mult;  \
          gl_FragColor = vec4(tColor, a);                          \
        }                                                           \
      ',
  
      transparent: true
    });

    Object.defineProperty( this, 'chromaKey', {
      set: function( value ) {
        this.uniforms.chromaKey.value = new THREE.Color( value );
      },
      get: function() {
        return this.uniforms.chromaKey.value;
      }
    });
    
    Object.defineProperty( this, 'range', {
      set: function( value ) {
        this.uniforms.range.value = value;
      },
      get: function() {
        return this.uniforms.range.value;
      }
    });
    
    Object.defineProperty( this, 'mult', {
      set: function( value ) {
        this.uniforms.mult.value = value;
      },
      get: function() {
        return this.uniforms.mult.value;
      }
    });
    
    Object.defineProperty( this, 'map', {
      set: function( value ) {
        return this.uniforms.tex.value = value;
      },
      get: function() {
        return this.uniforms.tex.value;
      }
    });
    
    Object.defineProperty( this, 'video', {
      get: function() {
        return this.map.image;
      }
    });

  }
  
}