"use client";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "@/i18n/routing";
import GoAILogo from "./GoAILogo";

const MotionLink = motion.create(Link);

const Logo: React.FC = () => {
  // const { theme } = useTheme();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // const logoSrc = !mounted
  //   ? "/logo/logo.png" // fallback
  //   : theme === "dark"
  //   ? "/logo/logo.png"
  //   : "/logo/logo.png";

  return (
    <MotionLink
      href="/"
      aria-label="Home"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* <div className="relative h-16 w-40 sm:w-48">
        <Image
          src={logoSrc}
          alt="logo"
          fill
          priority
          className="object-contain"
        />
      </div> */}
      <GoAILogo
        src="/logo/logo.png"
        width={115}
        // trimSides={{ bottom: true }}
        trimSides={{ top: true, right: true, bottom: true, left: true }}
        darkRecolorWordmark
        priority
      />
    </MotionLink>
  );
};

export default React.memo(Logo);
