"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const recipeIngredients = [
  { name: "Tomato", emoji: "🍅", color: "text-red-500" },
  { name: "Chicken", emoji: "🍗", color: "text-amber-400" },
  { name: "Pasta", emoji: "🍝", color: "text-yellow-300" },
  { name: "Salad", emoji: "🥗", color: "text-green-400" },
  { name: "Cheese", emoji: "🧀", color: "text-yellow-200" },
  { name: "Bread", emoji: "🍞", color: "text-amber-200" },
  { name: "Egg", emoji: "🥚", color: "text-stone-100" },
  { name: "Fish", emoji: "🐟", color: "text-blue-300" },
]

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIngredient, setCurrentIngredient] = useState(0)
  const [showHeroContent, setShowHeroContent] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      setShowHeroContent(true)
    }, 500)

    const ingredientInterval = setInterval(() => {
      setCurrentIngredient((prev) => (prev + 1) % recipeIngredients.length)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(ingredientInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Floating ingredient animations */}
      <AnimatePresence>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [0, -100],
              x: Math.random() * 200 - 100
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 5
            }}
            className={`absolute text-4xl ${recipeIngredients[i % recipeIngredients.length].color}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {recipeIngredients[i % recipeIngredients.length].emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full filter blur-3xl"></div>
          
          <AnimatePresence>
            {showHeroContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative z-10"
              >
                <div className="text-center mb-8">
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 mb-4"
                  >
                    Culinary Alchemy
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg md:text-xl text-white/80 mb-8"
                  >
                    Transform your <span className={`font-semibold ${recipeIngredients[currentIngredient].color}`}>
                      {recipeIngredients[currentIngredient].name.toLowerCase()}
                    </span> into culinary masterpieces
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="text-3xl mb-3">🧑‍🍳</div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Recipes</h3>
                    <p className="text-white/70">Generate perfect recipes based on what you have</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="text-3xl mb-3">⏱️</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Quick & Easy</h3>
                    <p className="text-white/70">Find meals you can make in under 30 minutes</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="text-3xl mb-3">🌱</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Dietary Smart</h3>
                    <p className="text-white/70">Customized for your dietary preferences</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <Link href="/generate" passHref>
                    <Button
                      asChild
                      className="transform transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg"
                    >
                      <a className="px-8 py-6 text-lg font-semibold">
                        Generate Recipe
                      </a>
                    </Button>
                  </Link>
                  <Link href="/login" passHref>
                    <Button
                      asChild
                      variant="outline"
                      className="transform transition-all duration-300 hover:scale-105 border-white/30 hover:border-white/50 bg-transparent hover:bg-white/5 text-white shadow-lg"
                    >
                      <a className="px-8 py-6 text-lg font-semibold">
                        Log In
                      </a>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showHeroContent ? 1 : 0 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center text-white/50 text-sm"
        >
          <p>Join thousands of home chefs creating amazing meals</p>
        </motion.div>
      </motion.div>

      {/* Animated cookbook in background */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
      >
        <Image
          src="/cookbook.png"
          alt="Decorative cookbook"
          width={1200}
          height={300}
          className="w-full opacity-10"
        />
      </motion.div>
    </div>
  )
}