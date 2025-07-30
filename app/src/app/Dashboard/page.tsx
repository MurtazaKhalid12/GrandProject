"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Trash2, X, Edit3, ChefHat, Clock } from "lucide-react"

type Recipe = {
  id: string
  title: string | null
  ingredients: string
  instructions: string
  tips: string | null
  created_at: string
}

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredientsInput, setIngredientsInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadRecipes = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        router.push("/")
        return
      }

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (err) {
      console.error("Error fetching recipes:", err)
    }
  }

  useEffect(() => {
    const initialLoad = async () => {
      await loadRecipes()
      setLoading(false)
    }
    initialLoad()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleGenerateRecipe = async () => {
    if (!ingredientsInput.trim()) return
    setSubmitting(true)
    setError(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/")
        return
      }

      // Trigger n8n webhook
      const response = await fetch("http://localhost:5678/webhook-test/recipe-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredientsInput,
          user_id: session.user.id,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`n8n error: ${text}`)
      }

      // Clear input after successful trigger
      setIngredientsInput("")

      // Start polling for new recipe
      let pollAttempts = 0
      const maxPollAttempts = 30 // 30 attempts * 2 seconds = 60 seconds max

      const pollForNewRecipe = async () => {
        try {
          const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false })

          if (error) throw error

          // Check if we have more recipes than before
          if (data && data.length > recipes.length) {
            // New recipe found, update the list
            setRecipes(data)
            setSubmitting(false)
            return true // Stop polling
          }

          pollAttempts++
          if (pollAttempts >= maxPollAttempts) {
            setError("Recipe generation is taking longer than expected. Please refresh the page to check if it was created.")
            setSubmitting(false)
            return true // Stop polling
          }

          // Continue polling
          setTimeout(pollForNewRecipe, 2000)
          return false
        } catch (err) {
          console.error("Error polling for new recipe:", err)
          setError("Error checking for new recipe. Please refresh the page.")
          setSubmitting(false)
          return true // Stop polling
        }
      }

      // Start polling after a short delay
      setTimeout(pollForNewRecipe, 2000)

    } catch (err) {
      console.error("Recipe generation error:", err)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Unable to connect to recipe generator. Please make sure your n8n webhook is running on localhost:5678")
      } else {
        setError("Failed to generate recipe. Please try again.")
      }
      setSubmitting(false)
    }
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    setDeletingId(recipeId)
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId)

      if (error) throw error
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
    } catch (err) {
      console.error("Error deleting recipe:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return "No content available"
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Recipe Collection</h1>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 border border-white/20"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Recipe Generator */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <ChefHat className="h-6 w-6 text-purple-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Create New Recipe</h2>
          </div>
          
          <Textarea
            placeholder="What ingredients do you have? (e.g., chicken, rice, broccoli, garlic...)"
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
            className="mb-6 bg-white/5 border-white/20 text-white placeholder:text-white/60 min-h-[100px] resize-none rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {submitting && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                <div>
                  <p className="text-blue-300 text-sm font-medium">Generating your recipe...</p>
                  <p className="text-blue-200/80 text-xs">This may take up to 60 seconds</p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleGenerateRecipe} 
            disabled={submitting || !ingredientsInput.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {submitting && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
            {submitting ? "Generating..." : "Generate Recipe"}
          </Button>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white/80 text-lg">Loading your recipes...</p>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <ChefHat className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 text-xl mb-2">No recipes yet</p>
            <p className="text-white/60">Generate your first recipe above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Card 
                key={recipe.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl group rounded-2xl overflow-hidden"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-white text-lg leading-tight">
                      {recipe.title || "Delicious Recipe"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteRecipe(recipe.id)
                      }}
                      disabled={deletingId === recipe.id}
                    >
                      {deletingId === recipe.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-purple-300 text-sm font-medium mb-1">Ingredients</p>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {truncateText(recipe.ingredients, 80)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-purple-300 text-sm font-medium mb-1">Instructions</p>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {truncateText(recipe.instructions, 100)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Clock className="h-3 w-3" />
                      {formatDate(recipe.created_at)}
                    </div>
                    <Edit3 className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRecipe.title || "Recipe Details"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Ingredients
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedRecipe.ingredients}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Instructions
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedRecipe.instructions}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Created {formatDate(selectedRecipe.created_at)}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteRecipe(selectedRecipe.id)
                    setSelectedRecipe(null)
                  }}
                  disabled={deletingId === selectedRecipe.id}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  {deletingId === selectedRecipe.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Recipe
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}