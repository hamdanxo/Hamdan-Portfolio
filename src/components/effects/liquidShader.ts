/** Fragment shader for the liquid-metal background (domain-warped fbm). */
export const liquidFragment = /* glsl */ `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.3,.7);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes.y;float tt=uTime*.035;
  vec2 q=vec2(fbm(uv*1.3+vec2(0.,tt)),fbm(uv*1.3+vec2(5.2,1.3)-tt));
  vec2 w=vec2(fbm(uv*1.5+3.*q+vec2(1.7,9.2)+tt*1.4),fbm(uv*1.5+3.*q+vec2(8.3,2.8)-tt*1.1));
  float f=fbm(uv*1.7+3.4*w);
  float m=pow(sin(f*13.+w.x*5.)*.5+.5,12.);
  float m2=pow(sin(f*8.-w.y*4.+1.3)*.5+.5,18.);
  vec3 dark=vec3(0.016,0.021,0.023),vio=vec3(0.146,0.238,0.284),lil=vec3(0.781,0.989,0.982),tea=vec3(0.318,0.722,0.675);
  vec3 col=mix(dark,vio,f*f*f*.9);
  col+=(lil*m*.08+tea*m2*.15)*smoothstep(.3,.9,f);
  col+=tea*.06*smoothstep(.5,.95,w.y);
  vec2 v=gl_FragCoord.xy/uRes;
  col*=.45+.55*smoothstep(1.1,.1,length(v-vec2(.5,.55)));
  gl_FragColor=vec4(col,1.);
}`;

export const liquidVertex = /* glsl */ `
void main(){gl_Position=vec4(position.xy,0.,1.);}`;
