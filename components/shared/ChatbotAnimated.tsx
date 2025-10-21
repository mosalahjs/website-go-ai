"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Sparkles, Zap, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    __CHAT_SFX_CTX__?: AudioContext;
    __CHAT_SFX_MASTER__?: GainNode;
  }
}

type Particle = { id: number; x: number; y: number };

const ChatbotAnimated: React.FC = React.memo(() => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modern closing sound - soft and smooth
  const playClosingSound = useCallback(() => {
    try {
      type AudioContextCtor = typeof AudioContext;
      const AC: AudioContextCtor = (window.AudioContext ??
        window.webkitAudioContext!) as AudioContextCtor;

      const ctx: AudioContext = (window.__CHAT_SFX_CTX__ ??= new AC());
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const now = ctx.currentTime;

      const master: GainNode = (window.__CHAT_SFX_MASTER__ ??= (() => {
        const g = ctx.createGain();
        g.gain.value = 0.75;
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

      // Soft closing swirl sound - modern and elegant
      const noise = ctx.createBuffer(
        1,
        Math.floor(ctx.sampleRate * 0.25),
        ctx.sampleRate
      );
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++)
        d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.6;
      const n = ctx.createBufferSource();
      n.buffer = noise;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2200;
      const ng = ctx.createGain();
      n.connect(lp);
      lp.connect(ng);
      ng.connect(master);
      ng.gain.setValueAtTime(0.0001, now);
      ng.gain.linearRampToValueAtTime(0.12, now + 0.03);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      // Reverse pitch sweep
      const v = ctx.createOscillator();
      v.type = "sine";
      const g = ctx.createGain();
      v.connect(g);
      g.connect(master);
      v.frequency.setValueAtTime(1800, now);
      v.frequency.exponentialRampToValueAtTime(600, now + 0.22);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.08, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      n.start(now);
      n.stop(now + 0.2);
      v.start(now);
      v.stop(now + 0.22);
    } catch {
      // Silently fail if audio context unavailable
    }
  }, []);

  // Opening whoosh sound
  const playOpeningSound = useCallback(() => {
    try {
      type AudioContextCtor = typeof AudioContext;
      const AC: AudioContextCtor = (window.AudioContext ??
        window.webkitAudioContext!) as AudioContextCtor;

      const ctx: AudioContext = (window.__CHAT_SFX_CTX__ ??= new AC());
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const now = ctx.currentTime;

      const master: GainNode = (window.__CHAT_SFX_MASTER__ ??= (() => {
        const g = ctx.createGain();
        g.gain.value = 0.75;
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
      ng.connect(master);
      ng.gain.setValueAtTime(0.0001, now);
      ng.gain.linearRampToValueAtTime(0.18, now + 0.02);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      const v = ctx.createOscillator();
      v.type = "triangle";
      const g = ctx.createGain();
      v.connect(g);
      g.connect(master);
      v.frequency.setValueAtTime(500, now + 0.04);
      v.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      g.gain.setValueAtTime(0.0001, now + 0.04);
      g.gain.linearRampToValueAtTime(0.24, now + 0.052);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      n.start(now);
      n.stop(now + 0.15);
      v.start(now + 0.04);
      v.stop(now + 0.22);
    } catch {
      // Silently fail if audio context unavailable
    }
  }, []);

  // Particles generation
  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  // Toggle handlers
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    playOpeningSound();
  }, [playOpeningSound]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    playClosingSound();
  }, [playClosingSound]);

  // Memoized transitions
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

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 100 }}
        transition={containerTransition}
        className="fixed bottom-11 right-8 z-50"
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
            onClick={isOpen ? handleClose : handleOpen}
            className="relative w-14 h-14 cursor-pointer bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden group"
            type="button"
            aria-label={isOpen ? "Close chat" : "Open chat"}
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
                prefersReducedMotion ? undefined : { rotate: isOpen ? 180 : 0 }
              }
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <MessageCircle className="w-6 h-6 text-white" />
              )}
            </motion.div>

            {/* Pulse Rings */}
            {!isOpen && (
              <>
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
              </>
            )}
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-1/2 -translate-y-1/2 right-20 whitespace-nowrap"
              >
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white font-medium">
                    Need help?
                  </span>
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Window */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-6 w-72"
              >
                {/* Header with close button */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Assistant</h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>

                  {/* Close button in popup */}
                  <motion.button
                    whileHover={
                      prefersReducedMotion ? undefined : { scale: 1.1 }
                    }
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    type="button"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                <div className="h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-transparent mb-4" />

                <p className="text-sm text-gray-600 mb-4">
                  Hello! How can I assist you today?
                </p>

                <motion.button
                  whileHover={
                    prefersReducedMotion ? undefined : { scale: 1.02 }
                  }
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                  type="button"
                >
                  <Link href={`/chat`} locale={locale}>
                    Start Chat
                  </Link>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

ChatbotAnimated.displayName = "ChatbotAnimated";

export default ChatbotAnimated;
