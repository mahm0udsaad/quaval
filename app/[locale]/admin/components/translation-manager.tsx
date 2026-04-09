'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Languages, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  Info,
  RefreshCcw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  translateAllContentAction,
  getTranslationStatusAction,
  type TranslationResult
} from '@/app/actions/translation'

export default function TranslationManager() {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationStatus, setTranslationStatus] = useState<{
    isAvailable: boolean
    supportedLanguages: string[]
    message?: string
  }>({ isAvailable: false, supportedLanguages: [] })
  const [lastResults, setLastResults] = useState<TranslationResult | null>(null)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    checkTranslationStatus()
  }, [])

  const checkTranslationStatus = async () => {
    try {
      const status = await getTranslationStatusAction()
      setTranslationStatus(status)
    } catch (error) {
      console.error('Error checking translation status:', error)
    }
  }

  const handleTranslateAll = async () => {
    if (!translationStatus.isAvailable) {
      toast({
        title: "Translation Not Available",
        description: translationStatus.message || "Translation service is not configured",
        variant: "destructive",
      })
      return
    }

    if (confirm("This will translate all home page content to Spanish and French. This may take several minutes. Continue?")) {
      setIsTranslating(true)
      setProgress(0)
      setLastResults(null)
      
      // Simulate progress (since we can't get real-time progress from server action)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 1000)
      
      try {
        const result = await translateAllContentAction(['es', 'fr'])
        setLastResults(result)
        setProgress(100)
        
        if (result.success) {
          toast({
            title: "Translation Complete",
            description: result.message,
          })
        } else {
          toast({
            title: "Translation Failed",
            description: result.error || "Unknown error occurred",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Translation error:', error)
        toast({
          title: "Translation Error",
          description: "Failed to translate content. Please try again.",
          variant: "destructive",
        })
      } finally {
        clearInterval(progressInterval)
        setIsTranslating(false)
        setProgress(0)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          AI Translation Manager
        </CardTitle>
        <CardDescription>
          Automatically translate all home page content using Google Gemini AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Translation Status */}
        <Alert>
          <div className="flex items-center gap-2">
            {translationStatus.isAvailable ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            )}
            <AlertTitle>
              {translationStatus.isAvailable ? 'Translation Ready' : 'Translation Unavailable'}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {translationStatus.message}
            {translationStatus.isAvailable && (
              <div className="mt-2">
                <p>Supported languages: {translationStatus.supportedLanguages.map(lang => (
                  <Badge key={lang} variant="outline" className="ml-1">
                    {lang.toUpperCase()}
                  </Badge>
                ))}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Translation Controls */}
        <div className="space-y-3">
          <Button 
            onClick={handleTranslateAll}
            disabled={!translationStatus.isAvailable || isTranslating}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            size="lg"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${isTranslating ? 'animate-spin' : ''}`} />
            {isTranslating ? 'Translating Content...' : 'Translate All Content'}
          </Button>

          <Button 
            variant="outline" 
            onClick={checkTranslationStatus}
            className="w-full"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Check Translation Status
          </Button>
        </div>

        {/* Progress Bar */}
        {isTranslating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Translation Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Last Results */}
        {lastResults && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Last Translation Results</h4>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>
                {lastResults.success ? 'Success' : 'Failed'}
              </AlertTitle>
              <AlertDescription>
                {lastResults.message}
                {lastResults.results && (
                  <div className="mt-2 text-xs">
                    <p>✅ Successful: {lastResults.results.success}</p>
                    <p>❌ Failed: {lastResults.results.failed}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Setup Instructions */}
        {!translationStatus.isAvailable && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Setup Required</AlertTitle>
            <AlertDescription>
              To enable AI translation, you need to:
              <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                <li>Get a Google AI API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                <li>Add <code className="bg-gray-100 px-1 rounded">GOOGLE_AI_API_KEY=your_key_here</code> to your environment variables</li>
                <li>Restart your application</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 