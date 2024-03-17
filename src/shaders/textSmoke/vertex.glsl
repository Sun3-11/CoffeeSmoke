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
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5
    );
        windOffset *= pow(uv.x, 0.9) * 0.3;

    newPosition.xz += windOffset;

    //fade
    float fadeAmount = smoothstep(0.5, 0.02, uv.x ); // 
    fadeAmount = smoothstep(10.5, 0.00, uv.y ); 

    newPosition.y += fadeAmount * 2.5 * uTime * 0.02; 



    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}


