"use client"
// import { motion } from 'framer-motion' // Framer Motion import 제거

export default function HeroOverlay() {
  return (
    // <motion.div className="pointer-events-none absolute inset-0 z-[-1]">
    <div className="pointer-events-none absolute inset-0 z-[-1]">
      {/* <motion.div */}
      <div
        // initial={{ x: -200, y: -100 }} // 애니메이션 props 제거
        // animate={{ x: 200, y: 100 }} // 애니메이션 props 제거
        // transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} // 애니메이션 props 제거
        // 기본 위치 및 스타일은 유지하되, 애니메이션 없이 정적인 형태로 만듭니다.
        // style={{ transform: 'translate(0px, 0px)' }} // 불필요한 transform 제거, CSS 클래스로 위치 결정
        className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-red-500 to-yellow-500 opacity-10 rounded-full blur-3xl"
      />
      {/* <motion.div */}
      <div
        // initial={{ x: 200, y: 100 }} // 애니메이션 props 제거
        // animate={{ x: -200, y: -100 }} // 애니메이션 props 제거
        // transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} // 애니메이션 props 제거
        // style={{ transform: 'translate(0px, 0px)' }} // 불필요한 transform 제거, CSS 클래스로 위치 결정
        className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-10 rounded-full blur-3xl"
      />
      {/* </motion.div> */}
    </div>
  )
} 