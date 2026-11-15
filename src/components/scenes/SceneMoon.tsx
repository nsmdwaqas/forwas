import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Moon,
  Award,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneMoonProps {
  onNext: () => void;
  onBack?: () => void;
}

type MoonStage = 'intro' | 'delivery' | 'unboxed';

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Composites the genuine NASA LROC 8K Color Mosaic & NASA LDEM Elevation Map
 * (from moon3dmap.com) with a subtle, physically bump-mapped "SHAJER" engraving
 * at the near-side prime meridian (u = 0.5, v = 0.5).
 */
async function buildEngravedNasaTextures(maxTexSize: number): Promise<{
  colorTexture: THREE.CanvasTexture;
  elevationTexture: THREE.CanvasTexture;
}> {
  const [colorImg, elevImg] = await Promise.all([
    loadHtmlImage('/assets/nasa/lroc_color_16bit_srgb_8k.webp'),
    loadHtmlImage('/assets/nasa/ldem_16_uint.webp')
  ]);

  const targetW = Math.min(maxTexSize, colorImg.naturalWidth || 4096, 4096);
  const targetH = Math.round(targetW / 2);

  // 1. Color Albedo Canvas (NASA LROC 8K)
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = targetW;
  colorCanvas.height = targetH;
  const cCtx = colorCanvas.getContext('2d')!;
  cCtx.drawImage(colorImg, 0, 0, targetW, targetH);

  // Subtle engraved "SHAJER" on the Lunar Near Side center (u = 0.5, v = 0.52)
  const fontSize = Math.round(targetW * 0.022);
  cCtx.save();
  cCtx.translate(targetW * 0.5, targetH * 0.52);
  cCtx.textAlign = 'center';
  cCtx.textBaseline = 'middle';
  cCtx.font = `600 ${fontSize}px Cinzel, Georgia, serif`;

  // Sunlit lower-right bevel highlight
  cCtx.fillStyle = 'rgba(255, 255, 255, 0.34)';
  cCtx.fillText('S H A J E R', fontSize * 0.04, fontSize * 0.04);

  // Recessed lunar regolith shadow
  cCtx.fillStyle = 'rgba(18, 18, 18, 0.58)';
  cCtx.fillText('S H A J E R', 0, 0);
  cCtx.restore();

  // 2. Elevation / Bump / Displacement Canvas (NASA LDEM)
  const elevW = Math.min(maxTexSize, elevImg.naturalWidth || 2048, 2048);
  const elevH = Math.round(elevW / 2);
  const elevCanvas = document.createElement('canvas');
  elevCanvas.width = elevW;
  elevCanvas.height = elevH;
  const eCtx = elevCanvas.getContext('2d')!;
  eCtx.drawImage(elevImg, 0, 0, elevW, elevH);

  // Carve "SHAJER" slightly into the elevation heightmap so Three.js bumpMap casts real 3D crater-like shadows
  const elevFontSize = Math.round(elevW * 0.022);
  eCtx.save();
  eCtx.translate(elevW * 0.5, elevH * 0.52);
  eCtx.textAlign = 'center';
  eCtx.textBaseline = 'middle';
  eCtx.font = `600 ${elevFontSize}px Cinzel, Georgia, serif`;
  eCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  eCtx.fillText('S H A J E R', 0, 0);
  eCtx.restore();

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.needsUpdate = true;

  const elevationTexture = new THREE.CanvasTexture(elevCanvas);
  elevationTexture.needsUpdate = true;

  return { colorTexture, elevationTexture };
}

/**
 * 3D Interactive Moon Component powered by the exact Three.js + NASA LROC/LDEM
 * setup from moon3dmap.com in a classic pure Black & White space aesthetic.
 */
function Moon3DMapViewport() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const zoomFnRef = useRef<((factor: number) => void) | null>(null);
  const resetFnRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hudCoords, setHudCoords] = useState({ lat: '00.0° N', lon: '00.0° E', zoomPct: 100 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;

    // Detect software WebGL per Three.js skill guidelines
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
    let goalDistance = 320;
    camera.position.set(0, 0, goalDistance);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);

    container.replaceChildren(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'none';

    const moonGroup = new THREE.Group();
    // Initial rotation facing the Lunar Near Side (exact same Euler(0, -Math.PI/2, 0) as moon3dmap.com)
    moonGroup.quaternion.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
    scene.add(moonGroup);

    // Classic monochrome 3D starfield in deep black space (from moon3dmap.com)
    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 1400; i += 1) {
      const r = 650 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starPoints = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.25,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.75
      })
    );
    scene.add(starPoints);

    // Pure classic black & white studio lunar lighting rig (from moon3dmap.com, neutral white/silver rim)
    const ambientLight = new THREE.AmbientLight(0x888888, 0.52);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(-180, 90, 240);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4d4d8, 0.35);
    rimLight.position.set(160, -80, -120);
    scene.add(rimLight);

    // High-resolution displaced sphere geometry (100 radius, 160x112 segments — exact moon3dmap.com spec)
    const geometry = new THREE.SphereGeometry(100, 160, 112);
    const material = new THREE.MeshPhongMaterial({
      color: 0xd4d4d4,
      shininess: 0,
      reflectivity: 0
    });
    const moonMesh = new THREE.Mesh(geometry, material);
    moonGroup.add(moonMesh);

    let loadedColorTex: THREE.Texture | null = null;
    let loadedElevTex: THREE.Texture | null = null;

    const maxTex = Math.min(4096, renderer.capabilities.maxTextureSize || 2048);
    buildEngravedNasaTextures(maxTex)
      .then(({ colorTexture, elevationTexture }) => {
        if (disposed) {
          colorTexture.dispose();
          elevationTexture.dispose();
          return;
        }
        loadedColorTex = colorTexture;
        loadedElevTex = elevationTexture;

        colorTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        material.color.setHex(0xffffff);
        material.map = colorTexture;
        material.bumpMap = elevationTexture;
        material.bumpScale = 0.85;
        material.displacementMap = elevationTexture;
        material.displacementScale = 0.65;
        material.displacementBias = -0.3;
        material.needsUpdate = true;
        setIsReady(true);
      })
      .catch((err) => {
        console.warn('Fallback to procedural moon surface:', err);
        setIsReady(true);
      });

    // Resize handling
    const resize = () => {
      if (!container || disposed) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Quaternion rotation & zoom state (exact moon3dmap.com interaction math)
    let targetQuaternion: THREE.Quaternion | null = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, -Math.PI / 2, 0)
    );
    let isDragging = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDistance = 0;

    const yAxis = new THREE.Vector3(0, 1, 0);
    const xAxis = new THREE.Vector3(1, 0, 0);
    const tmpQuatY = new THREE.Quaternion();
    const tmpQuatX = new THREE.Quaternion();
    const eulerHelper = new THREE.Euler();

    const aimDrag = (dx: number, dy: number) => {
      const sensitivity = 0.0032 * Math.max(0.25, (goalDistance - 100) / 260);
      const q = (targetQuaternion || moonGroup.quaternion).clone();
      tmpQuatY.setFromAxisAngle(yAxis, dx * sensitivity);
      tmpQuatX.setFromAxisAngle(xAxis, dy * sensitivity);
      q.premultiply(tmpQuatY);
      q.premultiply(tmpQuatX);
      targetQuaternion = q.normalize();
    };

    const aimZoom = (factor: number) => {
      goalDistance = THREE.MathUtils.clamp(100 + (goalDistance - 100) * factor, 145, 520);
    };

    const resetView = () => {
      goalDistance = 320;
      targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
    };

    zoomFnRef.current = aimZoom;
    resetFnRef.current = resetView;

    const canvas = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      canvas.style.cursor = 'grabbing';
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // ignore pointer capture errors
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      const prev = pointers.get(e.pointerId)!;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 0 && pinchDistance > 0) {
          aimZoom(pinchDistance / d);
        }
        pinchDistance = d;
      } else {
        aimDrag(dx, dy);
      }
    };

    const onPointerUpOrCancel = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      isDragging = pointers.size > 0;
      pinchDistance = 0;
      if (!isDragging) {
        canvas.style.cursor = 'grab';
      }
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = THREE.MathUtils.clamp(e.deltaY, -100, 100);
      aimZoom(Math.exp(delta * 0.0018));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUpOrCancel);
    canvas.addEventListener('pointercancel', onPointerUpOrCancel);
    canvas.addEventListener('lostpointercapture', onPointerUpOrCancel);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    let frameCounter = 0;
    const animate = () => {
      if (disposed) return;

      // Smooth quaternion slerp when dragging or resetting, or gentle axial rotation when idle
      if (targetQuaternion) {
        moonGroup.quaternion.slerp(targetQuaternion, 0.14);
        if (moonGroup.quaternion.angleTo(targetQuaternion) < 0.001) {
          targetQuaternion = null;
        }
      } else if (!isDragging && !isSoftwareGl) {
        tmpQuatY.setFromAxisAngle(yAxis, 0.0008);
        moonGroup.quaternion.premultiply(tmpQuatY);
      }

      // Smooth camera zoom interpolation
      camera.position.z += (goalDistance - camera.position.z) * 0.14;

      frameCounter += 1;
      if (frameCounter % 15 === 0) {
        eulerHelper.setFromQuaternion(moonGroup.quaternion, 'YXZ');
        const latDeg = THREE.MathUtils.radToDeg(eulerHelper.x);
        const lonDeg = THREE.MathUtils.radToDeg(eulerHelper.y + Math.PI / 2);
        const zoomPct = Math.round((320 / camera.position.z) * 100);
        setHudCoords({
          lat: `${Math.abs(latDeg).toFixed(1)}° ${latDeg >= 0 ? 'N' : 'S'}`,
          lon: `${Math.abs(lonDeg).toFixed(1)}° ${lonDeg >= 0 ? 'E' : 'W'}`,
          zoomPct
        });
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUpOrCancel);
      canvas.removeEventListener('pointercancel', onPointerUpOrCancel);
      canvas.removeEventListener('lostpointercapture', onPointerUpOrCancel);
      canvas.removeEventListener('wheel', onWheel);
      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
      (starPoints.material as THREE.Material).dispose();
      if (loadedColorTex) loadedColorTex.dispose();
      if (loadedElevTex) loadedElevTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full flex-1 min-h-[250px] sm:min-h-[320px] md:min-h-[360px] flex items-center justify-center">
      {/* Three.js Full-Stage Container */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[250px] sm:min-h-[320px] md:min-h-[360px] relative flex items-center justify-center"
      />

      {/* Loading Indicator while 8K NASA LROC texture initializes */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-zinc-900/90 border border-white/20 text-xs font-mono text-white/80 tracking-widest uppercase">
            Loading 4K NASA Lunar Mosaic...
          </div>
        </div>
      )}

      {/* Classic Monochrome Coordinates & Scale Telemetry Pill */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-950/90 border border-white/20 text-[10px] sm:text-[11px] font-mono text-white/90 shadow-lg whitespace-nowrap">
        <Navigation className="w-3 h-3 text-white/80" />
        <span>
          {hudCoords.lat} • {hudCoords.lon}
        </span>
        <span className="text-white/30">|</span>
        <span className="text-white/75">{hudCoords.zoomPct}%</span>
      </div>

      {/* Classic Black & White Zoom / Reset Controls */}
      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 bg-zinc-950/90 border border-white/20 rounded-2xl p-1 shadow-xl">
        <button
          type="button"
          onClick={() => zoomFnRef.current?.(0.84)}
          className="p-2 rounded-xl hover:bg-white/15 text-white/85 hover:text-white transition-colors cursor-pointer"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomFnRef.current?.(1.18)}
          className="p-2 rounded-xl hover:bg-white/15 text-white/85 hover:text-white transition-colors cursor-pointer"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => resetFnRef.current?.()}
          className="p-2 rounded-xl hover:bg-white/15 text-white/85 hover:text-white transition-colors cursor-pointer"
          aria-label="Reset view to SHAJER engraving"
          title="Center on SHAJER engraving"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function SceneMoon({ onNext, onBack }: SceneMoonProps) {
  const [stage, setStage] = useState<MoonStage>('intro');
  const [showCertificate, setShowCertificate] = useState(false);

  const hapticTap = (type: 'light' | 'unbox' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'unbox') {
        navigator.vibrate([40, 60, 80, 120]);
      } else {
        navigator.vibrate(15);
      }
    }
  };

  // Intro sequence stays ~6.5 seconds before transitioning to the night sky delivery
  useEffect(() => {
    if (stage === 'intro') {
      const timer = window.setTimeout(() => {
        setStage('delivery');
      }, 6500);
      return () => window.clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-30 w-full h-[100dvh] overflow-hidden select-none bg-black text-white flex flex-col justify-between">
      {/* Classic Pure Black Night Sky Background with Crisp White Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
        {Array.from({ length: 50 }).map((_, i) => {
          const top = (i * 19 + 7) % 98;
          const left = (i * 37 + 13) % 98;
          const size = i % 5 === 0 ? 2.4 : i % 3 === 0 ? 1.8 : 1.1;
          const duration = 2.6 + (i % 4) * 1.1;
          return (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: i % 5 === 0 ? '0 0 6px rgba(255,255,255,0.8)' : 'none'
              }}
              animate={{ opacity: [0.15, 0.9, 0.15] }}
              transition={{
                duration,
                repeat: Infinity,
                delay: (i % 7) * 0.3,
                ease: 'easeInOut'
              }}
            />
          );
        })}
      </div>

      {/* Top Navigation Bar: Back Button + Floating Certificate Button */}
      <div className="relative z-40 flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 pb-1 shrink-0">
        <div className="relative h-10 w-24 flex items-center">
          <BackButton onBack={onBack} />
        </div>

        {stage === 'unboxed' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticTap('light');
              setShowCertificate(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/30 text-white text-xs sm:text-sm font-medium shadow-[0_0_24px_rgba(255,255,255,0.18)] cursor-pointer transition-colors"
          >
            <Award className="w-4 h-4 text-white" />
            <span>Lunar Certificate</span>
          </motion.button>
        )}
      </div>

      {/* MAIN CONTENT STAGE */}
      <div className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center px-3 sm:px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STAGE 1: INTRO MEMORY (+2s extended duration, classic black & white theme) */}
          {stage === 'intro' && (
            <motion.div
              key="stage-intro"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, scale: 0.96 }}
              transition={{ duration: 1.1 }}
              className="max-w-lg mx-auto text-center px-6 py-9 rounded-3xl bg-zinc-950/90 border border-white/15 shadow-[0_0_50px_rgba(255,255,255,0.06)] flex flex-col items-center gap-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs tracking-widest uppercase">
                <Moon className="w-3.5 h-3.5 text-white" />
                <span>15 Nov • 11:00 PM</span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2 }}
                className="font-heading text-xl sm:text-3xl text-white leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
              >
                &ldquo;Remember when you asked me for the moon?&rdquo;
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.3 }}
                className="font-serif italic text-base sm:text-xl text-white/85 tracking-wide"
              >
                Well... I haven&apos;t forgotten.
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 3.8 }}
                onClick={() => setStage('delivery')}
                className="mt-2 text-xs text-white/60 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Continue to the night sky →
              </motion.button>
            </motion.div>
          )}

          {/* STAGE 2: NIGHT SKY TRANSITION & UNBOX PROMPT (Classic Black & White) */}
          {stage === 'delivery' && (
            <motion.div
              key="stage-delivery"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.12 }}
              transition={{ duration: 0.7 }}
              className="max-w-lg mx-auto text-center px-6 py-8 rounded-3xl bg-zinc-950/95 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.08)] flex flex-col items-center gap-5"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-white/15 blur-xl" />
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.45)] border border-white/50"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 32%, #ffffff 0%, #dcdcdc 42%, #8c8c8c 78%, #2e2e2e 100%)'
                  }}
                />
              </motion.div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/70 font-mono">
                  Celestial Parcel • Addressed to Shajer
                </p>
                <h2 className="font-heading text-2xl sm:text-4xl text-white tracking-wide">
                  &ldquo;Your delivery has finally arrived.&rdquo;
                </h2>
                <p className="text-xs sm:text-sm text-white/75 max-w-md mx-auto leading-relaxed">
                  On 15 Nov at 11:00 PM, I promised that if you ever asked for the moon, I would bring it to you. You jokingly said <span className="text-white font-semibold">YES</span> — so I brought your moon down into our universe.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => {
                  hapticTap('unbox');
                  setStage('unboxed');
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.35)' }}
                whileTap={{ scale: 0.95 }}
                className="mt-1 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(255,255,255,0.3)] inline-flex items-center gap-2.5 cursor-pointer hover:bg-zinc-100 transition-colors"
              >
                <span>Unbox your moon 🌙</span>
              </motion.button>
            </motion.div>
          )}

          {/* STAGE 3: 4K NASA 3D INTERACTIVE MOON (moon3dmap.com Engine, Classic Black & White) */}
          {stage === 'unboxed' && (
            <motion.div
              key="stage-unboxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-4xl h-full flex flex-col items-center justify-between overflow-y-auto custom-scrollbar px-1 sm:px-2 py-1 gap-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Classic Monochrome Header */}
              <div className="text-center shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-xs text-white/90 tracking-widest uppercase mb-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>15 Nov • 11:00 PM • Our Moon</span>
                </div>
                <h1 className="font-heading text-xl sm:text-2xl md:text-3xl text-white tracking-[0.2em] uppercase">
                  THE MOON OF SHAJER
                </h1>
                <p className="text-[11px] sm:text-xs text-white/65">
                  Drag to rotate 360° • Pinch or scroll to zoom • Engraved with SHAJER
                </p>
              </div>

              {/* 3D NASA LROC + LDEM Moon Viewport */}
              <Moon3DMapViewport />

              {/* Classic Black & White Emotional Ending Card */}
              <div className="w-full max-w-xl bg-zinc-950/90 border border-white/20 rounded-2xl p-3.5 sm:p-4 text-center shadow-[0_0_30px_rgba(255,255,255,0.05)] shrink-0">
                <div className="inline-flex items-center gap-1.5 text-white/80 text-xs font-medium mb-1 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>For The Girl Who Asked For The Moon</span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm md:text-base text-white/95 leading-relaxed">
                  &ldquo;Some people ask for flowers. Some ask for diamonds.
                  <br />
                  You asked me for the moon.
                  <br />
                  And although I couldn&apos;t bring the real one down...
                  <br />
                  I hope this little universe reminds you that I&apos;ll never stop trying to give you everything your heart wishes for.&rdquo;
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation: Continue to Promise (Classic Black & White) */}
      <div className="relative z-30 shrink-0 pb-3 sm:pb-4 pt-2 flex items-center justify-center border-t border-white/15 bg-black">
        <motion.button
          onClick={() => {
            hapticTap();
            onNext();
          }}
          className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full font-medium text-sm sm:text-base transition-all inline-flex items-center gap-2 min-h-[44px] cursor-pointer"
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,255,255,0.25)' }}
          whileTap={{ scale: 0.98 }}
        >
          Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>

      {/* POPUP MODAL: AUTHENTIC ROMANTIC CERTIFICATE OF MOON OWNERSHIP */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setShowCertificate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl bg-[#070707] border border-white/35 p-3 sm:p-4 text-center shadow-[0_0_80px_rgba(255,255,255,0.14)]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="absolute top-5 right-5 z-10 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
                aria-label="Close certificate"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Inner Formal Certificate Double-Frame */}
              <div className="relative border-2 border-double border-white/40 rounded-xl px-5 py-6 sm:px-7 sm:py-8 flex flex-col items-center">
                {/* Corner Certificate Filigree Accents */}
                <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/60" />
                <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/60" />
                <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/60" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/60" />

                {/* Top Emblem & Header */}
                <Moon className="w-6 h-6 text-white/90 mb-2" />
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.32em] text-white/60">
                  Celestial Registry of Love
                </p>
                <h2 className="font-heading text-lg sm:text-xl text-white tracking-[0.2em] uppercase mt-1">
                  Certificate of Ownership
                </h2>

                <div className="w-20 h-[1px] bg-white/30 my-3.5" />

                {/* Formal Presentation Line */}
                <p className="text-[11px] sm:text-xs text-white/70 font-serif italic">
                  This certifies that the Moon in our night sky belongs forever to
                </p>

                {/* Recipient Name on Formal Line */}
                <div className="w-full max-w-[240px] border-b border-white/40 pb-1.5 mt-3 mb-3.5">
                  <span className="font-heading text-2xl sm:text-3xl text-white tracking-[0.28em] uppercase">
                    SHAJER
                  </span>
                </div>

                {/* Concise Romantic Dedication */}
                <p className="text-xs sm:text-sm text-white/85 font-serif italic leading-relaxed max-w-xs">
                  &ldquo;You asked for the moon, and my heart promised to bring the universe to your feet.&rdquo;
                </p>

                {/* Authentic Certificate Footer: Date, Official Seal & Signature */}
                <div className="w-full grid grid-cols-3 items-end gap-2 mt-6 pt-4 border-t border-white/15">
                  {/* Date Column */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] sm:text-xs font-serif text-white/90 pb-1 border-b border-white/30 w-full">
                      15 Nov • 11 PM
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-white/50 mt-1">
                      Date Sealed
                    </span>
                  </div>

                  {/* Center Embossed Lunar Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-11 h-11 rounded-full border border-dashed border-white/50 bg-white/[0.06] flex flex-col items-center justify-center shadow-inner">
                      <Award className="w-4 h-4 text-white/90" />
                      <span className="text-[6px] font-mono tracking-widest uppercase text-white/75 mt-0.5">
                        FOREVER
                      </span>
                    </div>
                  </div>

                  {/* Signature Column */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-serif italic text-white/95 pb-1 border-b border-white/30 w-full">
                      Waqas
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-white/50 mt-1">
                      Yours Always
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
