import { motion } from 'framer-motion'

export default function SkeletonCard({ height = 80 }) {
  return (
    <motion.div
      animate={{
        opacity: [0.4, 0.8, 0.4],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      style={{
        height,
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '12px',
        margin: '0 16px 12px'
      }}
    />
  )
}
