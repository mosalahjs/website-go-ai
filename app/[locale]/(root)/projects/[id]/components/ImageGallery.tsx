"use client";
import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
}

const MotionImage = motion.create(Image);

function ImageGalleryComponent({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Project Gallery
          </h2>
        </div>
        {/* Main Selected Image (height reduced by 1/3 via aspect ratio) */}
        <motion.div
          layoutId={`gallery-main-${selectedIndex}`}
          className="relative aspect-[3/1] rounded-3xl overflow-hidden shadow-intense cursor-pointer group"
          onClick={() => openModal(selectedIndex)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-primary opacity-75 blur-sm group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-background rounded-3xl overflow-hidden">
            <MotionImage
              key={selectedIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={images[selectedIndex]}
              alt={`Project image ${selectedIndex + 1}`}
              className="w-full h-full object-cover select-none"
              decoding="async"
              priority
              width={1280}
              height={720}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-8"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                className="text-white text-lg font-semibold"
              >
                Click to view full size
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              layoutId={`gallery-thumb-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
                <div
                  className={`w-20 h-20 rounded-full transition-all duration-700 ease-out
      ${
        selectedIndex === index
          ? "bg-gradient-to-br from-cyan-400/50 via-blue-500/50 to-purple-500/50 blur-2xl animate-pulse opacity-100 shadow-[0_0_40px_-5px_rgba(6,182,212,0.6)]"
          : "opacity-0 group-hover:opacity-90 group-hover:blur-xl group-hover:bg-gradient-to-br group-hover:from-cyan-400/30 group-hover:via-blue-500/30 group-hover:to-purple-500/30"
      }`}
                />
              </div>
              {selectedIndex === index && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-[6]">
                  <span
                    className="relative w-6 h-6 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
                      boxShadow: "0 0 12px rgba(99,102,241,0.45)",
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: "0 0 0 0 rgba(99,102,241,0.45)",
                        mixBlendMode: "screen",
                      }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(99,102,241,0.45)",
                          "0 0 0 10px rgba(99,102,241,0.0)",
                        ],
                        opacity: [0.8, 0],
                        scale: [1, 1.25],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: "2px solid rgba(255,255,255,0.85)",
                        mixBlendMode: "screen",
                      }}
                      initial={{ scale: 0.85, opacity: 0.9 }}
                      animate={{
                        scale: [0.85, 1.4],
                        opacity: [0.9, 0],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </span>
                </span>
              )}

              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-card bg-background">
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                />
                <div
                  className={`absolute inset-0  rounded-2xl transition-all duration-300
            ${
              selectedIndex === index
                ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20"
                : "bg-black/40 group-hover:bg-black/20 dark:bg-white/10 dark:group-hover:bg-white/20"
            }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <MotionImage
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[selectedIndex]}
              alt={`Project image ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              decoding="async"
              priority
              width={1280}
              height={720}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(ImageGalleryComponent);
