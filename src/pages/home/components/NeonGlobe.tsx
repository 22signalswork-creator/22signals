import { useEffect, useRef, useState } from "react";

export default function NeonGlobe() {
  const globeCanvasRef = useRef<HTMLDivElement>(null);
  const specCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const toggleUiRef = useRef<HTMLButtonElement>(null);

  const emissiveIntRef = useRef<HTMLInputElement>(null);
  const fresPowRef = useRef<HTMLInputElement>(null);
  const distortStrRef = useRef<HTMLInputElement>(null);
  const distortRadRef = useRef<HTMLInputElement>(null);
  const rotSpeedRef = useRef<HTMLInputElement>(null);
  const specHeightRef = useRef<HTMLInputElement>(null);
  const specGlowRef = useRef<HTMLInputElement>(null);
  const primColorRef = useRef<HTMLInputElement>(null);
  const accentColorRef = useRef<HTMLInputElement>(null);

  const [uiHidden, setUiHidden] = useState(false);

  useEffect(() => {
    let animFrameId: number;
    let renderer: any;

    const script = document.createElement("script");
    script.type = "importmap";
    script.textContent = JSON.stringify({
      imports: {
        three: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",
      },
    });
    document.head.appendChild(script);

    const moduleScript = document.createElement("script");
    moduleScript.type = "module";
    moduleScript.textContent = `
import * as THREE from 'three';

const NOISE_GLSL = \`
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ * ns.x + ns.yyyy;
    vec4 y  = y_ * ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){
    float f = 0.0, amp = 0.5, freq = 1.0;
    for(int i = 0; i < 5; i++){ f += amp * snoise(p * freq); freq *= 2.0; amp *= 0.5; }
    return f;
}
float fbm3(vec3 p){
    float f = 0.0, amp = 0.5, freq = 1.0;
    for(int i = 0; i < 3; i++){ f += amp * snoise(p * freq); freq *= 2.0; amp *= 0.5; }
    return f;
}
vec3 hash3(vec3 p){
    p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6)));
    return fract(sin(p)*43758.5453123) * 2.0 - 1.0;
}
vec2 voronoi3D(vec3 x){
    vec3 p = floor(x); vec3 f = fract(x);
    float d1 = 8.0, d2 = 8.0;
    for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
        vec3 b = vec3(float(i),float(j),float(k));
        vec3 r = b - f + (hash3(p+b)*0.5+0.5);
        float d = dot(r,r);
        if(d<d1){d2=d1;d1=d;} else if(d<d2){d2=d;}
    }
    return vec2(sqrt(d1), sqrt(d2)-sqrt(d1));
}
\`;

const DISTORT_GLSL = \`
uniform vec3 u_cursorHit;
uniform float u_distortStrength;
uniform float u_distortRadius;
uniform float u_cursorActive;
vec3 applyDistortion(vec3 pos, vec3 normal){
    float dist = distance(pos, u_cursorHit);
    float influence = u_cursorActive * exp(-dist*dist / (u_distortRadius*u_distortRadius*0.5));
    vec3 toHit = normalize(u_cursorHit - pos);
    vec3 pull = toHit * influence * u_distortStrength * 0.18;
    pull -= normal * influence * u_distortStrength * 0.08;
    return pos + pull;
}
float distortionAmount(vec3 worldPos){
    float dist = distance(worldPos, u_cursorHit);
    return u_cursorActive * exp(-dist*dist / (u_distortRadius*u_distortRadius*0.5));
}
\`;

const _grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
const _perm = new Uint8Array(512);
const _p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
for(let i=0;i<256;i++){_perm[i]=_perm[i+256]=_p[i];}

function simplex2(xin,yin){
    const F2=0.5*(Math.sqrt(3)-1), G2=(3-Math.sqrt(3))/6;
    const s=(xin+yin)*F2; const i=Math.floor(xin+s), j=Math.floor(yin+s);
    const t=(i+j)*G2; const x0=xin-(i-t), y0=yin-(j-t);
    const i1=x0>y0?1:0, j1=x0>y0?0:1;
    const x1=x0-i1+G2, y1=y0-j1+G2, x2=x0-1+2*G2, y2=y0-1+2*G2;
    const ii=i&255, jj=j&255;
    const gi0=_perm[ii+_perm[jj]]%12, gi1=_perm[ii+i1+_perm[jj+j1]]%12, gi2=_perm[ii+1+_perm[jj+1]]%12;
    let n0=0,n1=0,n2=0;
    let t0=0.5-x0*x0-y0*y0; if(t0>0){t0*=t0;n0=t0*t0*(_grad3[gi0][0]*x0+_grad3[gi0][1]*y0);}
    let t1=0.5-x1*x1-y1*y1; if(t1>0){t1*=t1;n1=t1*t1*(_grad3[gi1][0]*x1+_grad3[gi1][1]*y1);}
    let t2=0.5-x2*x2-y2*y2; if(t2>0){t2*=t2;n2=t2*t2*(_grad3[gi2][0]*x2+_grad3[gi2][1]*y2);}
    return 70*(n0+n1+n2);
}

function simplex3(x,y,z){
    return simplex2(x+z*0.3,y+z*0.7)*0.6 + simplex2(x*2.1+0.5,y*2.1+z*0.5)*0.4;
}

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
let lowQuality = 1;

const state = {
    emissiveIntensity: 2.0,
    fresnelPower: 3.5,
    rotationSpeed: 0.004,
    distortStrength: 0.65,
    distortRadius: 0.55,
    spectrumHeight: 35,
    spectrumGlow: 18,
    primaryColor: new THREE.Color(0x2266ee),
    accentColor: new THREE.Color(0x44ccff),
    primaryHex: '#2266ee',
    accentHex: '#44ccff',
};

const renderer = new THREE.WebGLRenderer({ antialias: !lowQuality, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowQuality ? 1.0 : 1.5));
renderer.setClearColor(0x000000, 1);
renderer.domElement.id = 'globe-canvas';
renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;z-index:0;cursor:none;';
document.getElementById('globe-canvas-container').appendChild(renderer.domElement);

const specCanvas = document.getElementById('spectrum-canvas');
const ctx = specCanvas.getContext('2d');
specCanvas.width = window.innerWidth;
specCanvas.height = window.innerHeight;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 2.2, 10);
camera.lookAt(0, 0.3, 0);

const globeGroup = new THREE.Group();
globeGroup.position.set(0, 0.5, 0);
globeGroup.scale.setScalar(2.2);
scene.add(globeGroup);

const sphereSegs = lowQuality ? 48 : 128;

const sharedDistort = {
    u_cursorHit: { value: new THREE.Vector3(0, 0, 10) },
    u_distortStrength: { value: state.distortStrength },
    u_distortRadius: { value: state.distortRadius },
    u_cursorActive: { value: 0.0 },
};

const baseMat = new THREE.ShaderMaterial({
    uniforms: { u_opacity: { value: 0.4 }, ...sharedDistort },
    vertexShader: \`
        \${NOISE_GLSL}
        \${DISTORT_GLSL}
        varying vec3 v_worldPos; varying vec3 v_normal; varying vec3 v_objPos;
        void main(){
            v_objPos = position;
            v_normal = normalize(normalMatrix * normal);
            vec4 wp = modelMatrix * vec4(position, 1.0);
            wp.xyz = applyDistortion(wp.xyz, normalize((modelMatrix * vec4(normal, 0.0)).xyz));
            v_worldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
        }
    \`,
    fragmentShader: \`
        \${NOISE_GLSL}
        \${DISTORT_GLSL}
        uniform float u_opacity;
        varying vec3 v_worldPos; varying vec3 v_normal; varying vec3 v_objPos;
        void main(){
            vec3 dir = normalize(v_objPos);
            vec2 vor = voronoi3D(dir * 5.0 + vec3(0.0, 0.0, 0.3));
            float cellEdge = 1.0 - smoothstep(0.0, 0.08, vor.y);
            vec3 darkBase = vec3(0.008, 0.012, 0.03);
            vec3 edgeColor = vec3(0.02, 0.04, 0.10);
            vec3 col = mix(darkBase, edgeColor, cellEdge * 0.5);
            float dAmt = distortionAmount(v_worldPos);
            col += vec3(0.01, 0.03, 0.08) * dAmt * 1.0;
            gl_FragColor = vec4(col, u_opacity);
        }
    \`,
    transparent: true, depthWrite: true, side: THREE.FrontSide,
});
const baseMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, sphereSegs, sphereSegs), baseMat);
baseMesh.renderOrder = 0;
globeGroup.add(baseMesh);

const FILAMENT_THICKNESS = 0.096;
const filamentMat = new THREE.ShaderMaterial({
    uniforms: {
        u_emissiveIntensity: { value: 2.0 },
        u_color: { value: new THREE.Color(0x2266ee) },
        u_accentColor: { value: new THREE.Color(0x44ccff) },
        u_cameraPos: { value: new THREE.Vector3() }, ...sharedDistort,
    },
    vertexShader: \`
        \${NOISE_GLSL}
        \${DISTORT_GLSL}
        varying vec3 v_worldPos; varying vec3 v_normal; varying vec3 v_objPos;
        void main(){
            v_objPos = position;
            v_normal = normalize(normalMatrix * normal);
            vec4 wp = modelMatrix * vec4(position, 1.0);
            wp.xyz = applyDistortion(wp.xyz, normalize((modelMatrix * vec4(normal, 0.0)).xyz));
            v_worldPos = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
        }
    \`,
    fragmentShader: \`
        \${NOISE_GLSL}
        \${DISTORT_GLSL}
        uniform float u_emissiveIntensity;
        uniform vec3 u_color, u_accentColor, u_cameraPos;
        varying vec3 v_worldPos; varying vec3 v_normal; varying vec3 v_objPos;
        void main(){
            vec3 dir = normalize(v_objPos);
            vec3 viewDir = normalize(u_cameraPos - v_worldPos);
            float thick = ${(0.096).toFixed(4)};
            vec3 sc = dir * 6.0;
            float n = fbm(sc);
            float vein = sin(n * 10.0);
            float ridge = smoothstep(0.62 - thick, 0.62, vein) *
                          (1.0 - smoothstep(0.62, 0.62 + thick, vein));
            float core = ridge * 2.0;
            float n2 = fbm(sc.zxy * 1.5);
            float vein2 = sin(n2 * 8.0);
            float ridge2 = smoothstep(0.6-thick, 0.6, vein2) * (1.0-smoothstep(0.6, 0.6+thick, vein2));
            float intersection = core * ridge2 * 8.0;
            float fres = pow(1.0-max(0.0, dot(v_normal, viewDir)), 2.0);
            float rimBoost = 0.4 + 0.6 * fres;
            float intensity = (core + ridge2*0.5 + intersection) * rimBoost * u_emissiveIntensity;
            float crossness = clamp(intersection / (intensity+0.01), 0.0, 1.0);
            vec3 col = mix(u_color, u_accentColor, crossness * 0.6);
            col = mix(col, vec3(1.0), crossness * 0.5);
            float dAmt = distortionAmount(v_worldPos);
            intensity *= 1.0 + dAmt * 0.5;
            gl_FragColor = vec4(col * intensity, clamp(intensity, 0.0, 1.0));
        }
    \`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
});
const filamentMesh = new THREE.Mesh(new THREE.SphereGeometry(1.01, sphereSegs, sphereSegs), filamentMat);
filamentMesh.renderOrder = 2;
globeGroup.add(filamentMesh);

const rimMat = new THREE.ShaderMaterial({
    uniforms: {
        u_fresnelPower: { value: 3.5 }, u_fresnelIntensity: { value: 1.2 },
        u_color: { value: new THREE.Color(0x4488ff) },
        u_cameraPos: { value: new THREE.Vector3() }, u_time: { value: 0 }, ...sharedDistort,
    },
    vertexShader: \`
        \${NOISE_GLSL}
        \${DISTORT_GLSL}
        varying vec3 v_worldPos; varying vec3 v_normal; varying vec3 v_objPos;
        void main(){
            v_objPos = position;
            v_normal = normalize(normalMatrix * normal);
            vec4 wp = modelMatrix * vec4(position, 1.0);
            wp.xyz = applyDistortion(wp.xyz, normalize((modelMatrix * vec4(normal, 0.0)).xyz));
            v_worldPos = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
        }
    \`,
    fragmentShader: \`
        \${NOISE_GLSL}
        \${DISTORT_GLSL}
        uniform float u_fresnelPower, u_fresnelIntensity, u_time;
        uniform vec3 u_color, u_cameraPos;
        varying vec3 v_worldPos; varying vec3 v_normal; varying vec3 v_objPos;
        void main(){
            vec3 viewDir = normalize(u_cameraPos - v_worldPos);
            float fres = pow(1.0 - max(0.0, dot(v_normal, viewDir)), u_fresnelPower);
            vec3 dir = normalize(v_objPos);
            float scanLine = step(0.6, sin(dir.y * 60.0 + u_time * 1.5) * 0.5 + 0.5);
            float variation = 0.5 + 0.5 * scanLine;
            float alpha = smoothstep(0.0, 1.0, fres * u_fresnelIntensity * variation);
            vec3 col = mix(u_color, vec3(0.5, 0.7, 1.0), fres * 0.3) * fres * 0.8;
            float dAmt = distortionAmount(v_worldPos);
            col += vec3(0.3, 0.5, 1.0) * dAmt * 0.5; alpha += dAmt * 0.15;
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
        }
    \`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
});
const rimMesh = new THREE.Mesh(new THREE.SphereGeometry(1.03, sphereSegs, sphereSegs), rimMat);
rimMesh.renderOrder = 3;
globeGroup.add(rimMesh);

const INNER_DOT_COUNT = lowQuality ? 2000 : 4000;
const dotPositions = new Float32Array(INNER_DOT_COUNT * 3);
const goldenAngle = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < INNER_DOT_COUNT; i++) {
    const y = 1 - (i / (INNER_DOT_COUNT - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const r = 0.96;
    dotPositions[i * 3]     = Math.cos(theta) * radiusAtY * r;
    dotPositions[i * 3 + 1] = y * r;
    dotPositions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
}
const dotGeom = new THREE.BufferGeometry();
dotGeom.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
const dotMat = new THREE.PointsMaterial({
    color: 0x3388ff, size: 0.018, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
});
const innerDots = new THREE.Points(dotGeom, dotMat);
innerDots.renderOrder = -1;
globeGroup.add(innerDots);

const SPEC_POINTS = lowQuality ? 3000 : 6000;
let specNoiseTime = 0;
const specBaseRadius = 1.06;
const specPositions = new Float32Array(SPEC_POINTS * 3);
const specBaseDirs = new Float32Array(SPEC_POINTS * 3);
const specGA = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < SPEC_POINTS; i++) {
    const y = 1 - (i / (SPEC_POINTS - 1)) * 2;
    const radAtY = Math.sqrt(1 - y * y);
    const theta = specGA * i;
    const dx = Math.cos(theta) * radAtY, dy = y, dz = Math.sin(theta) * radAtY;
    specBaseDirs[i * 3] = dx; specBaseDirs[i * 3 + 1] = dy; specBaseDirs[i * 3 + 2] = dz;
    specPositions[i * 3] = dx * specBaseRadius; specPositions[i * 3 + 1] = dy * specBaseRadius; specPositions[i * 3 + 2] = dz * specBaseRadius;
}
const specGeom = new THREE.BufferGeometry();
specGeom.setAttribute('position', new THREE.BufferAttribute(specPositions, 3));

const specPointsMat = new THREE.PointsMaterial({
    color: 0x2266ee, size: 0.012, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
});
const specPointsMesh = new THREE.Points(specGeom, specPointsMat);
specPointsMesh.renderOrder = 5;
globeGroup.add(specPointsMesh);

const specGlowMat = new THREE.PointsMaterial({
    color: 0x2266ee, size: 0.04, transparent: true, opacity: 0.1,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
});
const specGlowMesh = new THREE.Points(specGeom, specGlowMat);
specGlowMesh.renderOrder = 4;
globeGroup.add(specGlowMesh);

const specFillSegs = lowQuality ? 32 : 48;
const specFillGeom = new THREE.SphereGeometry(specBaseRadius, specFillSegs, specFillSegs);
const specFillBasePosArray = specFillGeom.attributes.position.array.slice();
const specFillMat = new THREE.MeshBasicMaterial({
    color: 0x1144aa, transparent: true, opacity: 0.04,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide,
});
const specFillMesh = new THREE.Mesh(specFillGeom, specFillMat);
specFillMesh.renderOrder = 3;
globeGroup.add(specFillMesh);

function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return \`rgba(\${r},\${g},\${b},\${a})\`;
}

function updateSpectrumSphere(t, dt) {
    specNoiseTime += dt * 0.4;
    const maxH = state.spectrumHeight * 0.012;
    const pos = specGeom.attributes.position.array;
    const cursorDistortStr = smoothActive * 0.18;
    const cursorDistortRad = 0.7;

    for (let i = 0; i < SPEC_POINTS; i++) {
        const dx = specBaseDirs[i * 3], dy = specBaseDirs[i * 3 + 1], dz = specBaseDirs[i * 3 + 2];
        const nx = dx * 2.0, ny = dy * 2.0, nz = dz * 2.0;
        const n1 = simplex3(nx + specNoiseTime * 0.3, ny + specNoiseTime * 0.2, nz);
        const n2 = simplex3(nx * 2.5 + specNoiseTime * 0.5 + 10, ny * 2.5 + specNoiseTime * 0.35, nz * 2.5);
        const n3 = simplex3(nx * 5.0 + specNoiseTime * 0.8 + 20, ny * 5.0 + specNoiseTime * 0.6, nz * 5.0);
        let raw = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
        raw = Math.max(0, raw); raw = Math.pow(raw, 1.2);
        const burst = Math.pow(Math.max(0, simplex3(nx * 1.2 + specNoiseTime * 0.15, ny * 1.2, nz * 1.2)), 4.0);
        const height = (raw + burst * 1.5) * maxH;
        const r = specBaseRadius + height;
        let px = dx * r, py = dy * r, pz = dz * r;
        if (cursorDistortStr > 0.01) {
            const ddx = smoothHit.x - px, ddy = smoothHit.y - py, ddz = smoothHit.z - pz;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
            const influence = Math.exp(-dist * dist / (cursorDistortRad * cursorDistortRad));
            const pullStr = influence * cursorDistortStr;
            const dLen = dist || 1;
            px += (ddx / dLen) * pullStr * 0.6; py += (ddy / dLen) * pullStr * 0.6; pz += (ddz / dLen) * pullStr * 0.6;
            px -= dx * pullStr * 0.3; py -= dy * pullStr * 0.3; pz -= dz * pullStr * 0.3;
        }
        pos[i * 3] = px; pos[i * 3 + 1] = py; pos[i * 3 + 2] = pz;
    }
    specGeom.attributes.position.needsUpdate = true;

    const fillPos = specFillGeom.attributes.position.array;
    const fillCount = fillPos.length / 3;
    for (let i = 0; i < fillCount; i++) {
        const bx = specFillBasePosArray[i * 3], by = specFillBasePosArray[i * 3 + 1], bz = specFillBasePosArray[i * 3 + 2];
        const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        const ndx = bx / len, ndy = by / len, ndz = bz / len;
        const nx = ndx * 2.0, ny = ndy * 2.0, nz = ndz * 2.0;
        const n1 = simplex3(nx + specNoiseTime * 0.3, ny + specNoiseTime * 0.2, nz);
        let raw = Math.max(0, n1 * 0.55 + simplex3(nx * 2.5 + specNoiseTime * 0.5 + 10, ny * 2.5, nz * 2.5) * 0.3);
        raw = Math.pow(raw, 1.2);
        const height = raw * maxH;
        const r = specBaseRadius + height;
        let px = ndx * r, py = ndy * r, pz = ndz * r;
        if (cursorDistortStr > 0.01) {
            const ddx = smoothHit.x - px, ddy = smoothHit.y - py, ddz = smoothHit.z - pz;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
            const influence = Math.exp(-dist * dist / (cursorDistortRad * cursorDistortRad));
            const pullStr = influence * cursorDistortStr;
            const dLen = dist || 1;
            px += (ddx / dLen) * pullStr * 0.6; py += (ddy / dLen) * pullStr * 0.6; pz += (ddz / dLen) * pullStr * 0.6;
            px -= ndx * pullStr * 0.3; py -= ndy * pullStr * 0.3; pz -= ndz * pullStr * 0.3;
        }
        fillPos[i * 3] = px; fillPos[i * 3 + 1] = py; fillPos[i * 3 + 2] = pz;
    }
    specFillGeom.attributes.position.needsUpdate = true;

    const primCol = state.primaryColor;
    specPointsMat.color.copy(primCol); specGlowMat.color.copy(primCol);
    specPointsMat.size = 0.008 + maxH * 0.03; specGlowMat.size = 0.025 + maxH * 0.08;

    const w = specCanvas.width, h = specCanvas.height;
    ctx.clearRect(0, 0, w, h);
    const glowSize = state.spectrumGlow;
    if (glowSize < 1) return;
    const primHex = state.primaryHex;
    ctx.save();
    const projVec = new THREE.Vector3();
    const peakThreshold = maxH * 0.5;
    for (let i = 0; i < SPEC_POINTS; i += 4) {
        const px = pos[i * 3], py = pos[i * 3 + 1], pz = pos[i * 3 + 2];
        const r = Math.sqrt(px * px + py * py + pz * pz);
        const height = r - specBaseRadius;
        if (height > peakThreshold) {
            projVec.set(px, py, pz).project(camera);
            if (projVec.z > 1) continue;
            const sx = (projVec.x * 0.5 + 0.5) * w;
            const sy = (-projVec.y * 0.5 + 0.5) * h;
            const intensity = (height - peakThreshold) / (maxH * 0.6);
            const alpha = Math.min(0.4, intensity * 0.35);
            ctx.shadowBlur = glowSize * (1.5 + intensity * 2.5);
            ctx.shadowColor = hexToRgba(primHex, alpha);
            ctx.fillStyle = hexToRgba(primHex, alpha * 0.25);
            ctx.beginPath();
            ctx.arc(sx, sy, 2 + intensity * 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

const RIPPLE_WIDTH = 300;
const RIPPLE_DEPTH = 300;
const RIPPLE_SPACING = 0.2;
const rippleCount = RIPPLE_WIDTH * RIPPLE_DEPTH;
const ripplePositions = new Float32Array(rippleCount * 3);

let idx = 0;
for (let ix = 0; ix < RIPPLE_WIDTH; ix++) {
    for (let iz = 0; iz < RIPPLE_DEPTH; iz++) {
        ripplePositions[idx]     = (ix - RIPPLE_WIDTH / 2) * RIPPLE_SPACING;
        ripplePositions[idx + 1] = 0;
        ripplePositions[idx + 2] = (iz - RIPPLE_DEPTH / 2) * RIPPLE_SPACING;
        idx += 3;
    }
}

const rippleGeom = new THREE.BufferGeometry();
rippleGeom.setAttribute('position', new THREE.BufferAttribute(ripplePositions, 3));

const rippleMat = new THREE.PointsMaterial({
    color: 0x325FEC,
    size: 0.03,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
});

const rippleParticles = new THREE.Points(rippleGeom, rippleMat);
rippleParticles.position.y = -2.0;
scene.add(rippleParticles);

let rippleTime = 0;
function updateRipple(dt) {
    rippleTime += dt * 2.0;
    const rPos = rippleGeom.attributes.position.array;
    let i = 0;
    for (let ix = 0; ix < RIPPLE_WIDTH; ix++) {
        for (let iz = 0; iz < RIPPLE_DEPTH; iz++) {
            const x = (ix - RIPPLE_WIDTH / 2) * RIPPLE_SPACING;
            const z = (iz - RIPPLE_DEPTH / 2) * RIPPLE_SPACING;
            const distFromCenter = Math.sqrt(x * x + z * z);
            rPos[i + 1] = Math.sin(distFromCenter * 2.5 - rippleTime) * 0.25;
            i += 3;
        }
    }
    rippleGeom.attributes.position.needsUpdate = true;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const cursorDot = document.getElementById('cursor-dot');
let mouseScreenX = window.innerWidth / 2, mouseScreenY = window.innerHeight / 2;
let cursorOnGlobe = false;
const smoothHit = new THREE.Vector3(0, 0, 10);
let smoothActive = 0;

const springPos = new THREE.Vector3(0, 0, 10);
const springVel = new THREE.Vector3(0, 0, 0);
const springTarget = new THREE.Vector3(0, 0, 10);
const SPRING_STIFFNESS = 12.0;
const SPRING_DAMPING = 3.5;
const SPRING_MASS = 1.0;
let springActiveVel = 0;
let springActiveTarget = 0;

document.addEventListener('mousemove', (e) => {
    mouseScreenX = e.clientX; mouseScreenY = e.clientY;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    cursorDot.style.left = e.clientX + 'px'; cursorDot.style.top = e.clientY + 'px';
});

if (window.DeviceOrientationEvent) {
    const requestGyro = () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(s => { if (s === 'granted') window.addEventListener('deviceorientation', onGyro); });
        } else { window.addEventListener('deviceorientation', onGyro); }
    };
    document.addEventListener('touchstart', requestGyro, { once: true });
    requestGyro();
}
function onGyro(e) {
    mouse.x = Math.max(-1, Math.min(1, (e.gamma || 0) / 40));
    mouse.y = Math.max(-1, Math.min(1, -((e.beta || 0) - 45) / 40));
    mouseScreenX = (mouse.x * 0.5 + 0.5) * window.innerWidth;
    mouseScreenY = (-mouse.y * 0.5 + 0.5) * window.innerHeight;
}
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    mouseScreenX = t.clientX; mouseScreenY = t.clientY;
    mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
}, { passive: false });

const ui = {
    emissiveInt: document.getElementById('emissiveInt'),
    fresPow: document.getElementById('fresPow'),
    distortStr: document.getElementById('distortStr'),
    distortRad: document.getElementById('distortRad'),
    rotSpeed: document.getElementById('rotSpeed'),
    specHeight: document.getElementById('specHeight'),
    specGlow: document.getElementById('specGlow'),
    primColor: document.getElementById('primColor'),
    accentColor: document.getElementById('accentColor'),
};
function readUI() {
    state.emissiveIntensity = parseFloat(ui.emissiveInt.value);
    state.fresnelPower = parseFloat(ui.fresPow.value);
    state.distortStrength = parseFloat(ui.distortStr.value);
    state.distortRadius = parseFloat(ui.distortRad.value);
    state.rotationSpeed = parseFloat(ui.rotSpeed.value);
    state.spectrumHeight = parseFloat(ui.specHeight.value);
    state.spectrumGlow = parseFloat(ui.specGlow.value);
    state.primaryColor.set(ui.primColor.value);
    state.accentColor.set(ui.accentColor.value);
    state.primaryHex = ui.primColor.value;
    state.accentHex = ui.accentColor.value;
}
Object.values(ui).forEach(el => el.addEventListener('input', readUI));

document.getElementById('toggleLowQ').addEventListener('click', () => {
    lowQuality = !lowQuality;
    document.getElementById('toggleLowQ').textContent = lowQuality ? 'Low Quality (ON)' : 'Low Quality (OFF)';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowQuality ? 1.0 : 1.5));
    onResize();
});

const uiPanel = document.getElementById('ui');
const toggleBtn = document.getElementById('toggle-ui');
function toggleUI() {
    if (uiPanel.classList.contains('hidden')) { uiPanel.classList.remove('hidden'); toggleBtn.style.display = 'none'; }
    else { uiPanel.classList.add('hidden'); toggleBtn.style.display = 'block'; }
}
document.getElementById('hideUI').addEventListener('click', toggleUI);
toggleBtn.addEventListener('click', toggleUI);
document.addEventListener('keydown', (e) => { if (e.key === 'h' || e.key === 'H') toggleUI(); });

function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    specCanvas.width = w;
    specCanvas.height = h;
}
window.addEventListener('resize', onResize);

const clock = new THREE.Clock();
let frameCount = 0, lastFpsTime = 0;
const fpsEl = document.getElementById('fps');

const hitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 32, 32),
    new THREE.MeshBasicMaterial({ visible: false })
);
globeGroup.add(hitSphere);

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    frameCount++;
    if (t - lastFpsTime > 0.5) {
        fpsEl.textContent = Math.round(frameCount / (t - lastFpsTime)) + ' fps';
        frameCount = 0; lastFpsTime = t;
    }

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(hitSphere);
    if (hits.length > 0) {
        cursorOnGlobe = true;
        cursorDot.classList.add('on-globe');
        springTarget.copy(hits[0].point);
        springActiveTarget = 1.0;
    } else {
        cursorOnGlobe = false;
        cursorDot.classList.remove('on-globe');
        springActiveTarget = 0.0;
    }

    const sDt = Math.min(dt, 0.05);
    const springForce = new THREE.Vector3().subVectors(springTarget, springPos).multiplyScalar(SPRING_STIFFNESS);
    const dampForce = springVel.clone().multiplyScalar(-SPRING_DAMPING);
    const accel = springForce.add(dampForce).divideScalar(SPRING_MASS);
    springVel.add(accel.multiplyScalar(sDt));
    springPos.add(springVel.clone().multiplyScalar(sDt));

    const activeForce = (springActiveTarget - smoothActive) * SPRING_STIFFNESS;
    const activeDamp = -springActiveVel * SPRING_DAMPING;
    springActiveVel += (activeForce + activeDamp) / SPRING_MASS * sDt;
    smoothActive += springActiveVel * sDt;
    smoothActive = Math.max(0, Math.min(2.0, smoothActive));

    smoothHit.copy(springPos);
    sharedDistort.u_cursorHit.value.copy(smoothHit);
    sharedDistort.u_distortStrength.value = state.distortStrength;
    sharedDistort.u_distortRadius.value = state.distortRadius;
    sharedDistort.u_cursorActive.value = smoothActive;

    const targetRotX = mouse.y * 0.12;
    globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.03;
    globeGroup.rotation.y += state.rotationSpeed;

    const camWorldPos = camera.getWorldPosition(new THREE.Vector3());

    filamentMat.uniforms.u_emissiveIntensity.value = state.emissiveIntensity;
    filamentMat.uniforms.u_color.value.copy(state.primaryColor);
    filamentMat.uniforms.u_accentColor.value.copy(state.accentColor);
    filamentMat.uniforms.u_cameraPos.value.copy(camWorldPos);

    rimMat.uniforms.u_fresnelPower.value = state.fresnelPower;
    rimMat.uniforms.u_color.value.copy(state.primaryColor);
    rimMat.uniforms.u_cameraPos.value.copy(camWorldPos);
    rimMat.uniforms.u_time.value = t;

    updateSpectrumSphere(t, dt);
    updateRipple(dt);

    renderer.render(scene, camera);
}

animate();
    `;
    document.body.appendChild(moduleScript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(moduleScript);
      const canvas = document.getElementById("globe-canvas");
      if (canvas) canvas.remove();
    };
  }, []);

  return (
    <>
      <style>{`
      
       
        #globe-canvas { position: fixed; top: 0; left: 0; z-index: 0; }
        #spectrum-canvas { position: fixed; top: 0; left: 0; z-index: 1; pointer-events: none; }
        #cursor-dot {
          position: fixed; width: 8px; height: 8px; border-radius: 50%;
          background: rgba(100,160,255,0.6); box-shadow: 0 0 12px rgba(80,140,255,0.5);
          pointer-events: none; z-index: 100; transform: translate(-50%,-50%);
          transition: width 0.15s, height 0.15s, background 0.15s;
        }
        #cursor-dot.on-globe {
          width: 14px; height: 14px; background: rgba(100,200,255,0.3);
          box-shadow: 0 0 24px rgba(80,180,255,0.6);
        }
        #ui {
          position: fixed; top: 106px; right: 16px; background: rgba(0,0,0,0.75);
          border: 1px solid rgba(100,140,255,0.12); border-radius: 8px;
          padding: 14px 18px; min-width: 230px; z-index: 10;
          backdrop-filter: blur(6px); font-size: 12px; user-select: none;
          transition: opacity 0.3s;
        }
        #ui.hidden { opacity: 0; pointer-events: none; }
        #ui h3 { margin: 0 0 10px; color: #7eaaff; font-size: 13px; letter-spacing: 1px; }
        .ctrl { margin: 4px 0; display: flex; align-items: center; justify-content: space-between; }
        .ctrl label { flex: 1; }
        .ctrl input[type=range] { width: 100px; accent-color: #5588ff; }
        .ctrl input[type=color] { width: 28px; height: 20px; border: none; background: none; cursor: pointer; }
        button.toggle {
          margin-top: 8px; width: 100%; padding: 5px;
          background: rgba(80,130,255,0.12); color: #8ab4ff;
          border: 1px solid rgba(80,130,255,0.25); border-radius: 4px;
          cursor: pointer; font-size: 11px;
        }
        button.toggle:hover { background: rgba(80,130,255,0.22); }
        #fps { position: fixed; bottom: 10px; left: 10px; font-size: 11px; color: rgba(255,255,255,0.25); z-index: 10; }
        #toggle-ui {
          position: fixed; top: 16px; right: 16px; z-index: 11;
          background: rgba(0,0,0,0.5); border: 1px solid rgba(100,140,255,0.2);
          color: #7eaaff; border-radius: 4px; padding: 4px 10px;
          cursor: pointer; font-size: 11px; display: none;
        }
      `}</style>

      <div className="relative w-full h-full overflow-hidden" id="globe-canvas-container" />
      <canvas id="spectrum-canvas" ref={specCanvasRef} />
      <div id="cursor-dot" ref={cursorDotRef} />

      <div id="ui" ref={uiRef} className="hidden">
        <h3>GLOBE CONTROLS</h3>
        <div className="ctrl"><label>Emissive Intensity</label><input ref={emissiveIntRef} type="range" id="emissiveInt" min="0.2" max="4.0" step="0.1" defaultValue="2.0" /></div>
        <div className="ctrl"><label>Fresnel Power</label><input ref={fresPowRef} type="range" id="fresPow" min="1.0" max="10.0" step="0.1" defaultValue="3.5" /></div>
        <div className="ctrl"><label>Distort Strength</label><input ref={distortStrRef} type="range" id="distortStr" min="0" max="1.5" step="0.05" defaultValue="0.65" /></div>
        <div className="ctrl"><label>Distort Radius</label><input ref={distortRadRef} type="range" id="distortRad" min="0.1" max="1.5" step="0.05" defaultValue="0.55" /></div>
        <div className="ctrl"><label>Rotation Speed</label><input ref={rotSpeedRef} type="range" id="rotSpeed" min="0" max="0.02" step="0.0005" defaultValue="0.004" /></div>
        <div className="ctrl"><label>Spectrum Height</label><input ref={specHeightRef} type="range" id="specHeight" min="5" max="80" step="1" defaultValue="35" /></div>
        <div className="ctrl"><label>Spectrum Glow</label><input ref={specGlowRef} type="range" id="specGlow" min="0" max="40" step="1" defaultValue="18" /></div>
        <div className="ctrl"><label>Primary Color</label><input ref={primColorRef} type="color" id="primColor" defaultValue="#2266ee" /></div>
        <div className="ctrl"><label>Accent Color</label><input ref={accentColorRef} type="color" id="accentColor" defaultValue="#44ccff" /></div>
        <button className="toggle" id="toggleLowQ">Low Quality Mode</button>
        <button className="toggle" id="hideUI">Hide UI (H)</button>
      </div>
      <button id="toggle-ui" ref={toggleUiRef} style={{ display: "none" }}>Show UI (H)</button>
      <div id="fps" ref={fpsRef} />
    </>
  );
}
