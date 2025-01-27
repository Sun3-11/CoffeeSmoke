uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main() {
    
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;


    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

     // Remap
    smoke = smoothstep(3.4, 0.05, smoke);

    // Edges
    smoke *= smoothstep(9.5, 1.9, vUv.x);//6.5, 0.9
    smoke *= smoothstep(9.5, 0.0, vUv.x);//0.0, 0.3,

    //FadeOUt
    // float fadeOut = smoothstep(1.0, 0.0, vUv.y);
    // fadeOut = smoothstep(10.5, 0.2, vUv.y);

    // smoke -= fadeOut * uTime * 0.05;
//------------------------
  
    float fadeIn = smoothstep(0.0, 1.0, mod(uTime /  2.8,0.0* vUv.x) ); 
    float fadeOut = smoothstep(1.0, 0.0, mod(uTime /  3.8, 0.5* vUv.y)) ; 

   

    smoke -=  fadeIn - (9.0 - fadeOut) / fadeOut + uTime * 0.07 ;

    // Final color
        gl_FragColor = vec4(0.6, 0.3, 0.2,  fadeIn /smoke  /fadeOut );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}