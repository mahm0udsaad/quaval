"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Languages, Sparkles } from "lucide-react"
import {
  type HomeSection,
  type HomeContentBlock,
  type FooterContent,
  getHomeSections,
  getHomeContentBlocks,
  getFooterContent,
  updateHomeSection,
  updateHomeContentBlock,
  createHomeContentBlock,
  deleteHomeContentBlock
} from "@/lib/api"
import {
  translateAllContentAction,
  translateHomeContentAction,
  translateFooterContentAction,
  type TranslationResult
} from "@/app/actions/translation"

// Import our organized components
import {
  SectionPreview,
  SectionManagement,
  FooterContentManagement,
  ContentBlockModal,
  HeaderControls
} from "./components"

export default function HomeContentManagement() {
  const [sections, setSections] = useState<HomeSection[]>([])
  const [contentBlocks, setContentBlocks] = useState<HomeContentBlock[]>([])
  const [footerContent, setFooterContent] = useState<FooterContent[]>([])
  const [selectedLocale, setSelectedLocale] = useState('en')
  const [isLoading, setIsLoading] = useState(true)
  const [editingBlock, setEditingBlock] = useState<HomeContentBlock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationProgress, setTranslationProgress] = useState<string>('')
  const [showPreview, setShowPreview] = useState(true)
  const [previewData, setPreviewData] = useState<{
    sections: (HomeSection & { content_blocks: HomeContentBlock[] })[];
    footer: FooterContent[];
  }>({ sections: [], footer: [] })
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [selectedLocale])

  // Update preview data whenever content changes
  useEffect(() => {
    const sectionsWithContent = sections.map(section => ({
      ...section,
      content_blocks: contentBlocks.filter(block => block.section_id === section.id)
    }))
    
    setPreviewData({
      sections: sectionsWithContent,
      footer: footerContent
    })
  }, [sections, contentBlocks, footerContent])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [sectionsData, blocksData, footerData] = await Promise.all([
        getHomeSections(),
        getHomeContentBlocks(selectedLocale),
        getFooterContent(selectedLocale)
      ])
      setSections(sectionsData)
      setContentBlocks(blocksData)
      setFooterContent(footerData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSectionToggle = async (sectionId: number, enabled: boolean) => {
    try {
      const updatedSection = await updateHomeSection(sectionId, { is_enabled: enabled })
      if (updatedSection) {
        setSections(sections.map(s => s.id === sectionId ? updatedSection : s))
        toast({
          title: "Success",
          description: `Section ${enabled ? 'enabled' : 'disabled'} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      })
    }
  }

  const handleBlockToggle = async (blockId: number, enabled: boolean) => {
    try {
      const updatedBlock = await updateHomeContentBlock(blockId, { is_enabled: enabled })
      if (updatedBlock) {
        setContentBlocks(contentBlocks.map(b => b.id === blockId ? updatedBlock : b))
        toast({
          title: "Success",
          description: `Content block ${enabled ? 'enabled' : 'disabled'} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content block",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBlock = async (blockId: number) => {
    if (confirm("Are you sure you want to delete this content block?")) {
      try {
        const success = await deleteHomeContentBlock(blockId)
        if (success) {
          setContentBlocks(contentBlocks.filter(b => b.id !== blockId))
          toast({
            title: "Success",
            description: "Content block deleted successfully",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete content block",
          variant: "destructive",
        })
      }
    }
  }

  const handleTranslateAll = async () => {
    if (confirm("This will translate all content to Spanish and French. This may take a few minutes. Continue?")) {
      setIsTranslating(true)
      setTranslationProgress('Starting translation...')
      
      try {
        const result = await translateAllContentAction(['es', 'fr'])
        
        if (result.success) {
          toast({
            title: "Translation Complete",
            description: result.message,
          })
          if (result.results) {
            setTranslationProgress(`Completed: ${result.results.success} successful, ${result.results.failed} failed`)
          }
          fetchData()
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
        setIsTranslating(false)
        setTimeout(() => setTranslationProgress(''), 3000)
      }
    }
  }

  const handleTranslateSingle = async (contentId: number, contentType: 'home' | 'footer') => {
    setIsTranslating(true)
    setTranslationProgress(`Translating ${contentType} content...`)
    
    try {
      let result: TranslationResult
      
      if (contentType === 'home') {
        result = await translateHomeContentAction(contentId, ['es', 'fr'])
      } else {
        result = await translateFooterContentAction(contentId, ['es', 'fr'])
      }
      
      if (result.success) {
        toast({
          title: "Translation Complete",
          description: result.message,
        })
        fetchData()
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
      setIsTranslating(false)
      setTimeout(() => setTranslationProgress(''), 2000)
    }
  }

  const handleEditBlock = (block: HomeContentBlock | null) => {
    setEditingBlock(block)
    setIsModalOpen(true)
  }

  const handleAddContent = () => {
    setEditingBlock(null)
    setIsModalOpen(true)
  }

  const handleModalSave = (savedBlock: HomeContentBlock) => {
    if (editingBlock) {
      setContentBlocks(contentBlocks.map(b => b.id === savedBlock.id ? savedBlock : b))
    } else {
      setContentBlocks([...contentBlocks, savedBlock])
    }
    setIsModalOpen(false)
    setEditingBlock(null)
    toast({
      title: "Success",
      description: "Content block saved successfully",
    })
  }

  const handleFooterUpdate = (updatedItem: FooterContent) => {
    setFooterContent(footerContent.map(i => i.id === updatedItem.id ? updatedItem : i))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Controls */}
      <HeaderControls
        selectedLocale={selectedLocale}
        showPreview={showPreview}
        isLoading={isLoading}
        isTranslating={isTranslating}
        onLocaleChange={setSelectedLocale}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onRefresh={fetchData}
        onTranslateAll={handleTranslateAll}
      />

      {/* Translation Progress */}
      {(isTranslating || translationProgress) && (
        <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Sparkles className={`h-5 w-5 text-purple-600 ${isTranslating ? 'animate-spin' : ''}`} />
              <Languages className="h-5 w-5 text-blue-600 ml-1" />
            </div>
            <div>
              <p className="font-medium text-purple-800">AI Translation Status</p>
              <p className="text-sm text-purple-600">{translationProgress || 'Processing...'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Left Column - Content Management */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto max-h-screen`}>
          <Tabs defaultValue="sections" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sections">Page Sections</TabsTrigger>
              <TabsTrigger value="footer">Footer Content</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <SectionManagement
                  sections={sections}
                  contentBlocks={contentBlocks}
                  isTranslating={isTranslating}
                  onSectionToggle={handleSectionToggle}
                  onBlockToggle={handleBlockToggle}
                  onDeleteBlock={handleDeleteBlock}
                  onTranslateSingle={handleTranslateSingle}
                  onEditBlock={handleEditBlock}
                  onAddContent={handleAddContent}
                />
              )}
            </TabsContent>

            <TabsContent value="footer" className="space-y-4">
              <FooterContentManagement
                footerContent={footerContent}
                locale={selectedLocale}
                isTranslating={isTranslating}
                onTranslate={(id) => handleTranslateSingle(id, 'footer')}
                onUpdate={handleFooterUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Live Preview */}
        {showPreview && (
          <div className="w-1/2 bg-white border-l overflow-y-auto max-h-screen">
            <SectionPreview 
              previewData={previewData} 
              locale={selectedLocale}
            />
          </div>
        )}
      </div>

      {/* Content Block Edit Modal */}
      <ContentBlockModal
        block={editingBlock}
        sections={sections}
        locale={selectedLocale}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBlock(null)
        }}
        onSave={handleModalSave}
      />
    </div>
  )
} 