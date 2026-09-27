import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskLines, Reveal } from "./Motion";

export default function PageHero({ chapter, title, lines, desc, img }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const wmX = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  const innerY = useTransform(scrollYProgress, [0, 1], ["0px", "70px"]);
  const innerO = useTransform(scrollYProgress, [0, .8], [1, .15]);
  return (
    <header className="page-hero" ref={ref}>
      {img && <motion.div className="ph-bg" style={{ y: bgY }} aria-hidden="true"><img src={img} alt="" /></motion.div>}
      <div className="ph-veil" aria-hidden="true" />
      <motion.div className="container ph-inner" style={{ y: innerY, opacity: innerO }}>
        <Reveal as="span" className="ph-chapter" y={16}>{chapter}</Reveal>
        <h1 className="ph-title"><MaskLines lines={lines} delay={.1} /></h1>
        {desc && <Reveal as="p" className="ph-desc" delay={.3}>{desc}</Reveal>}
      </motion.div>
      <motion.span className="ph-watermark" style={{ x: wmX }} aria-hidden="true">{title}</motion.span>
    </header>
  );
}
