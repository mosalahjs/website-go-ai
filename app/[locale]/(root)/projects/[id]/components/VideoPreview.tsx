"use client";

import { memo, useMemo, useId, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface Props {
  videoUrl?: string;
  projectLink?: string;
  gallery?: string[];
}

function VideoPreviewComponent({ projectLink, gallery }: Props) {
  const id = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const demoGallery = useMemo(
    () =>
      gallery && gallery.length > 0
        ? gallery
        : [
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000",
            "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1000",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000",
            "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1000",
            "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1000",
            "https://images.unsplash.com/photo-1517430816045-df4b7de1cd0e?w=1000",
            "https://images.unsplash.com/photo-1581091012184-5c1d91a3ca61?w=1000",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000",
          ],
    [gallery]
  );

  const [selected, setSelected] = useState(demoGallery[0]);
  const [progress, setProgress] = useState(0);
  const [perimeter, setPerimeter] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      const calculatedPerimeter = 2 * (width + height);
      setPerimeter(calculatedPerimeter);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
    }
  };

  const galleryItems = useMemo(
    () =>
      demoGallery.map((img, i) => (
        <motion.div
          key={`${id}-${i}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`overflow-hidden rounded-xl shadow-md cursor-pointer relative group ${
            selected === img
              ? "ring-4 ring-blue-500 shadow-blue-500/30"
              : "hover:ring-2 hover:ring-blue-400/60"
          }`}
          onClick={() => setSelected(img)}
        >
          <Image
            src={img}
            alt={`Gallery image ${i + 1}`}
            width={400}
            height={200}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {selected === img && (
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-cyan-400/20 backdrop-blur-[2px]" />
          )}
        </motion.div>
      )),
    [demoGallery, id, selected]
  );

  return (
    <section className="py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <div className="container mx-auto px-6 space-y-8">
        {/* 🔹 Video Section with Progress Border */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[500px] rounded-2xl"
        >
          {/* SVG Progress Border */}
          <svg
            className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none z-20"
            style={{ transform: "translate(-4px, -4px)" }}
          >
            <defs>
              <linearGradient
                id={`grad-${id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <filter id={`glow-${id}`}>
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              x="4"
              y="4"
              width="calc(100% - 8px)"
              height="calc(100% - 8px)"
              rx="16"
              fill="none"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="4"
            />

            <rect
              x="4"
              y="4"
              width="calc(100% - 8px)"
              height="calc(100% - 8px)"
              rx="16"
              fill="none"
              stroke={`url(#grad-${id})`}
              strokeWidth="4"
              strokeDasharray={perimeter}
              strokeDashoffset={perimeter - (perimeter * progress) / 100}
              strokeLinecap="round"
              filter={`url(#glow-${id})`}
              style={{
                transition: "stroke-dashoffset 0.1s linear",
              }}
            />
          </svg>

          {/* Video Container */}
          <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent hover:from-black/60 transition-colors duration-500 z-10" />

            {/* Progress Percentage Display */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <span className="text-white font-semibold text-sm">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* External Link Button */}
            {projectLink && (
              <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center group z-20"
              >
                <div className="p-4 bg-white/15 rounded-full backdrop-blur-md border border-white/20 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                  <ExternalLink className="h-16 w-16 text-white/80" />
                </div>
              </a>
            )}
          </div>
        </motion.div>

        {/* 🔹 Selected Image Preview */}
        <motion.div
          key={selected}
          layoutId="selectedImage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/70 backdrop-blur-md"
        >
          <Image
            src={selected}
            alt="Selected preview"
            width={1200}
            height={800}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="text-white text-xl font-semibold">Selected Preview</p>
            <p className="text-white/60 text-sm mt-1">
              Click any image below to preview
            </p>
          </div>
        </motion.div>

        {/* 🔹 Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems}
        </div>
      </div>
    </section>
  );
}

export default memo(VideoPreviewComponent);
