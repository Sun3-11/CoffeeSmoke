uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include ../includes/rotate2D.glsl


void main() {

    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(
        uPerlinTexture , 
        vec2(5.0, uv.y * 0.001 - uTime * 0.005)
        ).r - 0.5;
    float angle = twistPerlin * 1.5 ;// 1.0
    newPosition.yx = Rotate2D(newPosition.xy, -angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.001)).r - 0.5,
        texture(uPerlinTexture, vec2(0.25, uTime * 0.001)).r - 0.5
    );
        windOffset *= pow(uv.y, 0.9) * 0.3;

    newPosition.xz += windOffset;

    //fade
    float fadeAmount = smoothstep(0.5, 0.002, uv.x ); // 
    fadeAmount = smoothstep(10.5, 0.00, uv.y ); 

    newPosition.y += fadeAmount * 0.5 *  0.02; 

       float distortion = sin(position.y * 2.9 + uTime) * 0.1;
    newPosition.x += distortion;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 2.5);

    vUv = uv;
}

