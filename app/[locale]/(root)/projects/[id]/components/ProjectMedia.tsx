"use client";

import { memo, useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useTranslations } from "next-intl";

interface ProjectMediaProps {
  videoUrl?: string;
  thumbnail?: string;
  gallery?: string[];
}

function ProjectMediaComponent({
  videoUrl,
  thumbnail,
  gallery = [],
}: ProjectMediaProps) {
  // const t = useTranslations("Project");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const progressValue = useMotionValue(0);
  const circumference = 1000;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateProgress = () => {
      if (video.duration) {
        const percentage = (video.currentTime / video.duration) * 100;
        progressValue.set(percentage);
      }
    };
    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, [progressValue]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted((prev) => !prev);
  }, []);

  const strokeDashoffset = useTransform(
    progressValue,
    [0, 100],
    [circumference, 0]
  );
  const progressBarWidth = useTransform(
    progressValue,
    [0, 100],
    ["0%", "100%"]
  );

  const videoSection = useMemo(
    () =>
      videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          <div className="relative rounded-2xl overflow-visible">
            <svg
              className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none z-20"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect
                x="0.5"
                y="0.5"
                width="99"
                height="99"
                fill="none"
                stroke="hsl(var(--border) / 0.3)"
                strokeWidth="0.5"
                rx="3"
                vectorEffect="non-scaling-stroke"
              />
              <motion.rect
                x="0.5"
                y="0.5"
                width="99"
                height="99"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="0.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rx="3"
                vectorEffect="non-scaling-stroke"
                style={{
                  filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))",
                }}
              />
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="hsl(186 100% 50%)" />
                  <stop offset="50%" stopColor="hsl(217 91% 60%)" />
                  <stop offset="100%" stopColor="hsl(271 76% 53%)" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative rounded-xl overflow-hidden shadow-card">
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover cursor-pointer"
                poster={thumbnail}
                onClick={togglePlay}
                loop
                muted={isMuted}
                playsInline
              >
                <source src={videoUrl} type="video/mp4" />
              </video>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls && !isPlaying ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="lg"
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-gradient-primary shadow-glow"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: showControls ? 1 : 0,
                  y: showControls ? 0 : 10,
                }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              >
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>

                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                      style={{ width: progressBarWidth }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ),

    [
      videoUrl,
      isPlaying,
      isMuted,
      showControls,
      strokeDashoffset,
      progressBarWidth,
      thumbnail,
      toggleMute,
      togglePlay,
    ]
  );

  const gallerySection = useMemo(() => {
    if (!gallery.length) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-8"
      ></motion.div>
    );
  }, [gallery]);

  return (
    <div className="space-y-12">
      {videoSection}
      {gallerySection}
    </div>
  );
}

export const ProjectMedia = memo(ProjectMediaComponent);
