"use client";
import { memo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

function VideoPlayer({ gradient }: { gradient?: string }) {
  const { theme } = useTheme();
  const locale = useLocale();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const videoUrl = "/videos/video-project.mp4";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryAutoplay = async () => {
      try {
        await video.play();
        video.muted = true;
        setIsPlaying(true);
        setIsMuted(true);
      } catch (err) {
        console.warn("Autoplay prevented:", err);
      }
    };

    tryAutoplay();
  }, []);

  const isRTL = locale === "en";

  const controlBg =
    theme === "dark"
      ? "bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-pink-600/60 text-white hover:from-indigo-500/80 hover:to-pink-500/80"
      : "bg-gradient-to-br from-indigo-300/70 via-purple-300/70 to-pink-300/70 text-gray-900 hover:from-indigo-400/80 hover:to-pink-400/80";

  const playButton = (
    <motion.button
      key="play"
      onClick={() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "p-3 rounded-full backdrop-blur-md shadow-lg transition-colors border border-white/10",
        controlBg
      )}
      aria-label={isPlaying ? "Pause video" : "Play video"}
    >
      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
    </motion.button>
  );

  const muteButton = (
    <motion.button
      key="mute"
      onClick={() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
      }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "p-3 rounded-full backdrop-blur-md shadow-lg transition-colors border border-white/10",
        controlBg
      )}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </motion.button>
  );

  if (!mounted) return <div className="aspect-[20/9] w-full" />;

  return (
    <motion.section
      className="w-full flex justify-center py-12 sm:pt-20 sm:pb-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative w-[100%] sm:w-[95%] md:w-[90%] lg:w-[92%] xl:w-[94%] 2xl:w-[96%] rounded-3xl overflow-hidden shadow-[0_10px_60px_-10px_rgba(0,0,0,0.4)] transition-all aspect-[16/6]",
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-white to-gray-100",
          gradient
        )}
      >
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          loop
          preload="metadata"
          poster="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920"
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support playing this video.
        </video>

        <div
          className={cn(
            "absolute bottom-5 flex gap-3 z-20 transition-all",
            isRTL ? "left-6 flex-row-reverse" : "right-6"
          )}
        >
          {isRTL ? (
            <>
              {muteButton}
              {playButton}
            </>
          ) : (
            <>
              {playButton}
              {muteButton}
            </>
          )}
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0px rgba(0,0,0,0)",
              "0 0 40px rgba(99,102,241,0.25)",
              "0 0 0px rgba(0,0,0,0)",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </div>
    </motion.section>
  );
}

export default memo(VideoPlayer);
