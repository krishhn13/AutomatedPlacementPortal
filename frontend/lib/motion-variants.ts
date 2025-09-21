// Motion system with Framer Motion variants
export const fadeInUp = {
  initial: { y: 10, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    y: 8,
    opacity: 0,
    transition: {
      duration: 0.18,
    },
  },
}

export const buttonTap = {
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.12,
    },
  },
}

export const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    x: 10,
    opacity: 0,
    transition: {
      duration: 0.18,
    },
  },
}

export const modalVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}
