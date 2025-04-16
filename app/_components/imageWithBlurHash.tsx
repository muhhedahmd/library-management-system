"use client";

import React, { useEffect, useState } from "react";
import { BlurhashCanvas } from "react-blurhash";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  imageUrl: string;
  width: number;
  height: number;
  className: string;
  alt: string;
  quality: number;
  blurhash?: string | undefined;
}

const BlurredImage: React.FC<Props> = ({
  imageUrl,
  width,
  height,
  className,
  alt,
  quality,
  blurhash,
}) => {
  const [isError , setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const img = new window.Image();
    img.src = imageUrl;
    img.width = width || 1024;
    img.height = height || 768;

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsError(true)
      setIsLoading(false);
    };

    // generateBlurDataUrl(imageUrl);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, width, height]);

  // const baseUrl =
  //   process.env.NODE_ENV === "development"
  //     ? "http://localhost:3000"
  //     : process.env.NEXT_PUBLIC_DOMAIN;


  
  if(isError) {
    return (
      <div
      
      className={`text-center flex justify-center items-center ` + className}>
        <ImageIcon className="w-6 h-6 "/>
      </div>
    )
  }


  

  return (
    <>
      {isLoading && blurhash && (
        <AnimatePresence mode="sync">
          <motion.div
            transition={{
              duration: 0.4,
            }}
            className={className}
            animate={{ opacity: 1 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(0px)" }}
          >
            <BlurhashCanvas hash={blurhash} className={className} />
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        <motion.div
          className={`flex justify-center items-center ${className}`}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            alt={alt}
            src={imageUrl}
            quality={quality}
            loading="lazy"
            fill
            className={className}
            placeholder="blur"
            blurDataURL={imageUrl}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default BlurredImage;

