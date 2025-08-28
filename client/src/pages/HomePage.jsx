import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="horror-background min-h-screen bg-gemini flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-navy/40 via-dark-navy/20 to-transparent"></div>
      
      {/* Floating horror elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-turquoise/40 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-red/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-plum/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="text-center space-y-12 relative z-10">
        {/* Enhanced header section */}
        <div className="page-header mt-18">
          <div className="space-y-6">
            <h1 className="eerie-text text-xl md:text-3xl lg:text-7xl font-bold mb-4 leading-snug">
              Hopeless Opus
            </h1>
            <div className="w-32 h-1 bg-turquoise mx-auto rounded-full shadow-lg shadow-turquoise/50"></div>
            <p className="text-2xl md:text-2xl lg:text-2xl mb-6 font-medium leading-relaxed text-shadow-horror" style={{ color: "#FFD700" }}>
              Enter the Ultimate Story Mode Experience
            </p>
          </div>
          
          {/* Enhanced subtitle */}
          <p className="text-lg md:text-xl text-shadow-strong max-w-3xl mx-auto leading-relaxed" style={{ color: "white" }}>
            Embark on a journey through darkness and mystery. Your fate awaits in the shadows of the unknown.
          </p>
        </div>

        {/* Enhanced action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Link to="/login" className="w-full sm:w-auto">
            <Button className="horror-button px-12 py-4 font-bold text-xl w-full sm:w-auto transform hover:scale-105 transition-all duration-300">
              <span className="ancient-text">Enter the Darkness</span>
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="outline" className="horror-button px-12 py-4 font-bold text-xl w-full sm:w-auto transform hover:scale-105 transition-all duration-300">
              <span className="ancient-text" style={{ color: "white" }}>Forge Your Team</span>
            </Button>
          </Link>
        </div>

        {/* Enhanced feature highlights */}
        <div className="pt-16 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-red/20 rounded-full flex items-center justify-center mx-auto border-2 border-turquoise/40 group-hover:border-turquoise/60 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">⚔️</span>
              </div>
              <h3 className="text-xl font-semibold text-red text-shadow-horror" style={{ color: "#FFD700" }}>Epic Battles</h3>
              <p className="text-sm text-shadow-strong" style={{ color: "#00FFFF" }}>Face challenges that test your limits</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-red/20 rounded-full flex items-center justify-center mx-auto border-2 border-plum/40 group-hover:border-plum/60 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-red text-shadow-horror" style={{ color: "#FFD700" }}>Mystical Powers</h3>
              <p className="text-sm text-shadow-strong" style={{ color: "#00FFFF" }}>Unlock ancient secrets and abilities</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-red/20 rounded-full flex items-center justify-center mx-auto border-2 border-red/40 group-hover:border-red/60 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">💀</span>
              </div>
              <h3 className="text-xl font-semibold text-red text-shadow-horror" style={{ color: "#FFD700" }}>Dark Realms</h3>
              <p className="text-sm text-shadow-strong" style={{ color: "#00FFFF" }}>Explore forbidden territories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 