import { Card } from "@/components/ui/card"
import { Calendar, Clock, Users } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <Card className="p-12 bg-white/90 backdrop-blur-sm border-0 shadow-strong animate-fade-in-up">
        <div className="text-center space-y-8">
          {/* Enhanced Loading Animation */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '-1s' }}></div>
          </div>
          
          <div className="space-y-4">
            <div className="text-2xl font-bold text-gray-800">Lade Termine...</div>
            <div className="text-gray-500">Bitte warten Sie einen Moment</div>
          </div>

          {/* Loading Stats */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Termine laden</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="text-sm">Patienten laden</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4 animate-pulse" style={{ animationDelay: '0.4s' }} />
              <span className="text-sm">Kategorien laden</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
