"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Sparkles, Zap, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    __CHAT_SFX_CTX__?: AudioContext;
    __CHAT_SFX_MASTER__?: GainNode;
  }
}

// Types
type Particle = { id: number; x: number; y: number };

// Memoized component to avoid unnecessary re-renders
const ChatbotAnimated: React.FC = React.memo(() => {
  const [isVisible] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // i18n
  const t = useTranslations("ChatBot");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Play sound function using Web Audio API (modern chat open SFX)
  const playSound = useCallback(
    (preset: "neon" | "glass" | "whoosh" = "neon") => {
      type AudioContextCtor = typeof AudioContext;
      const AC: AudioContextCtor = (window.AudioContext ??
        window.webkitAudioContext!) as AudioContextCtor;

      const ctx: AudioContext = (window.__CHAT_SFX_CTX__ ??= new AC());
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const now = ctx.currentTime;

      // ---- master (single) ----
      const master: GainNode = (window.__CHAT_SFX_MASTER__ ??= (() => {
        const g = ctx.createGain();
        g.gain.value = 0.85;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -24;
        comp.knee.value = 16;
        comp.ratio.value = 3;
        comp.attack.value = 0.003;
        comp.release.value = 0.15;
        g.connect(comp);
        comp.connect(ctx.destination);
        return g;
      })());

      const pan = new StereoPannerNode(ctx, {
        pan: preset === "glass" ? 0 : preset === "whoosh" ? -0.4 : 0.5,
      });
      pan.connect(master);
      pan.pan.linearRampToValueAtTime(0, now + 0.25);

      const connect = (n: AudioNode) => n.connect(pan);
      const env = (g: GainNode, a: number, d: number, peak = 0.3) => {
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peak, now + a);
        g.gain.exponentialRampToValueAtTime(0.001, now + d);
      };

      if (preset === "neon") {
        const delay = ctx.createDelay(0.3);
        delay.delayTime.value = 0.11;
        const fb = ctx.createGain();
        fb.gain.value = 0.2;
        delay.connect(fb);
        fb.connect(delay);
        delay.connect(pan);

        const v1 = ctx.createOscillator();
        v1.type = "sine";
        const g1 = ctx.createGain();
        v1.connect(g1);
        connect(g1);
        v1.frequency.setValueAtTime(620, now);
        v1.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        v1.frequency.exponentialRampToValueAtTime(900, now + 0.18);
        env(g1, 0.014, 0.22, 0.32);
        g1.connect(delay);

        const v2 = ctx.createOscillator();
        v2.type = "triangle";
        const g2 = ctx.createGain();
        v2.connect(g2);
        connect(g2);
        v2.frequency.setValueAtTime(1400, now);
        v2.frequency.exponentialRampToValueAtTime(2000, now + 0.06);
        env(g2, 0.01, 0.15, 0.16);
        g2.connect(delay);

        const nb = ctx.createBuffer(
          1,
          Math.floor(ctx.sampleRate * 0.07),
          ctx.sampleRate
        );
        const ch = nb.getChannelData(0);
        for (let i = 0; i < ch.length; i++)
          ch[i] = (Math.random() * 2 - 1) * 0.5;
        const n = ctx.createBufferSource();
        n.buffer = nb;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 3200;
        const gn = ctx.createGain();
        gn.gain.value = 0.0001;
        gn.gain.linearRampToValueAtTime(0.1, now + 0.004);
        gn.gain.exponentialRampToValueAtTime(0.0007, now + 0.06);
        n.connect(hp);
        hp.connect(gn);
        connect(gn);

        v1.start(now);
        v2.start(now + 0.005);
        n.start(now);
        v1.stop(now + 0.25);
        v2.stop(now + 0.18);
        n.stop(now + 0.06);
      }

      if (preset === "glass") {
        const v = ctx.createOscillator();
        v.type = "sine";
        const g = ctx.createGain();
        v.connect(g);

        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1800;
        bp.Q.value = 7;
        g.connect(bp);
        connect(bp);

        v.frequency.setValueAtTime(700, now);
        v.frequency.exponentialRampToValueAtTime(1500, now + 0.07);
        env(g, 0.01, 0.16, 0.22);

        v.start(now);
        v.stop(now + 0.18);
      }

      if (preset === "whoosh") {
        const noise = ctx.createBuffer(
          1,
          Math.floor(ctx.sampleRate * 0.18),
          ctx.sampleRate
        );
        const d = noise.getChannelData(0);
        for (let i = 0; i < d.length; i++)
          d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const n = ctx.createBufferSource();
        n.buffer = noise;

        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 1600;
        const ng = ctx.createGain();
        n.connect(lp);
        lp.connect(ng);
        connect(ng);
        ng.gain.setValueAtTime(0.0001, now);
        ng.gain.linearRampToValueAtTime(0.18, now + 0.02);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        const v = ctx.createOscillator();
        v.type = "triangle";
        const g = ctx.createGain();
        v.connect(g);
        connect(g);
        v.frequency.setValueAtTime(500, now + 0.04);
        v.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        env(g, 0.012, 0.18, 0.24);

        n.start(now);
        n.stop(now + 0.15);
        v.start(now + 0.04);
        v.stop(now + 0.22);
      }
    },
    []
  );

  // Particles interval
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-5),
        {
          id: Date.now(),
          x: Math.random() * 40 - 20,
          y: Math.random() * 40 - 20,
        },
      ]);
    }, 800);

    return () => window.clearInterval(intervalId);
  }, []);

  // Handlers
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) {
        // Play sound when opening
        playSound("whoosh");
      }
      return newState;
    });
  }, [playSound]);

  // Memoize static transitions/animations to avoid re-allocations each render
  const containerTransition = useMemo(
    () => ({ type: "spring", stiffness: 260, damping: 20 } as const),
    []
  );

  const glowTransition = useMemo(
    () =>
      ({
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      } as const),
    []
  );

  const shimmerTransition = useMemo(
    () =>
      ({
        repeat: Infinity,
        duration: 2,
        ease: "linear",
        repeatDelay: 1,
      } as const),
    []
  );

  const ringTransition = useMemo(
    () =>
      ({
        repeat: Infinity,
        duration: 1.5,
        ease: "easeOut",
      } as const),
    []
  );

  const anchorClass = isRTL ? "left-8" : "right-8";

  return (
    <>
      {/* Modern Chatbot Icon */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={containerTransition}
            className={`fixed bottom-11 ${anchorClass} z-50`}
          >
            <div className="relative">
              {/* Floating Particles */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          scale: [0, 1, 0],
                          x: particle.x,
                          y: particle.y,
                          opacity: [1, 0.5, 0],
                        }
                  }
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                />
              ))}

              {/* Glowing Background */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.6 }
                    : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }
                }
                transition={glowTransition}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl"
              />

              {/* Main Button */}
              <motion.button
                whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOpen}
                className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden group"
                type="button"
                aria-label={isOpen ? t("chat.close") : t("chat.open")}
                aria-pressed={isOpen}
              >
                {/* Shimmer Effect */}
                <motion.div
                  animate={
                    prefersReducedMotion ? undefined : { x: ["-100%", "200%"] }
                  }
                  transition={shimmerTransition}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />

                {/* Icon with rotation */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { rotate: isOpen ? 180 : 0 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <X className="w-7 h-7 text-white" />
                  ) : (
                    <MessageCircle className="w-7 h-7 text-white" />
                  )}
                </motion.div>

                {/* Pulse Rings */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { scale: [1, 1.5], opacity: [0.5, 0] }
                  }
                  transition={ringTransition}
                  className="absolute inset-0 border-2 border-white rounded-full"
                />
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { scale: [1, 1.8], opacity: [0.3, 0] }
                  }
                  transition={{ ...ringTransition, delay: 0.3 }}
                  className="absolute inset-0 border-2 border-white rounded-full"
                />
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap ${
                      isRTL ? "left-20" : "right-20"
                    }`}
                  >
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white font-medium">
                        {t("tooltip.needHelp")}
                      </span>
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mini Menu when open */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`absolute bottom-20 ${
                      isRTL ? "left-0" : "right-0"
                    } bg-white rounded-2xl shadow-2xl p-6 w-72`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {t("assistant.title")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {t("assistant.status")}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-transparent" />

                      <p className="text-sm text-gray-600">
                        {t("assistant.hello")}
                      </p>

                      <motion.button
                        whileHover={
                          prefersReducedMotion ? undefined : { scale: 1.02 }
                        }
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                        type="button"
                      >
                        {t("assistant.cta")}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ChatbotAnimated.displayName = "ChatbotAnimated";

export default ChatbotAnimated;
