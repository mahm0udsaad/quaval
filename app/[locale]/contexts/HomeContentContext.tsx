'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  HomeSection, 
  HomeContentBlock, 
  FooterContent,
  getHomeSections,
  getHomeContentBlocks,
  getFooterContent,
  updateHomeContentBlock,
  updateFooterContent,
  createHomeContentBlock,
  deleteHomeContentBlock
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface HomeContentContextType {
  sections: (HomeSection & { content_blocks: HomeContentBlock[] })[];
  footerContent: FooterContent[];
  isLoading: boolean;
  isAddingPartnerLogo: boolean;
  isDeletingPartnerLogo: number | null; // ID of the block being deleted
  
  // Actions
  fetchData: () => Promise<void>;
  updateBlock: (block: HomeContentBlock) => Promise<void>;
  updateFooterItem: (item: FooterContent) => Promise<void>;
  addPartnerLogo: (sectionId: number) => Promise<void>;
  deletePartnerLogo: (blockId: number) => Promise<void>;
}

const HomeContentContext = createContext<HomeContentContextType | undefined>(undefined);

export function useHomeContent() {
  const context = useContext(HomeContentContext);
  if (context === undefined) {
    throw new Error('useHomeContent must be used within a HomeContentProvider');
  }
  return context;
}

interface HomeContentProviderProps {
  children: ReactNode;
  locale?: string;
}

export function HomeContentProvider({ children, locale = 'en' }: HomeContentProviderProps) {
  const [sections, setSections] = useState<(HomeSection & { content_blocks: HomeContentBlock[] })[]>([]);
  const [footerContent, setFooterContent] = useState<FooterContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPartnerLogo, setIsAddingPartnerLogo] = useState(false);
  const [isDeletingPartnerLogo, setIsDeletingPartnerLogo] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sectionsData, blocksData, footerData] = await Promise.all([
        getHomeSections(),
        getHomeContentBlocks(locale),
        getFooterContent(locale),
      ]);

      const sectionsWithContent = sectionsData.map(section => ({
        ...section,
        content_blocks: blocksData.filter(block => block.section_id === section.id),
      }));

      setSections(sectionsWithContent);
      setFooterContent(footerData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error fetching data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [locale, toast]);

  const updateBlock = useCallback(async (block: HomeContentBlock) => {
    try {
      const updatedBlock = await updateHomeContentBlock(block.id, { content: block.content });
      if (updatedBlock) {
        // Optimistic update - update local state immediately
        setSections(prevSections => 
          prevSections.map(section => ({
            ...section,
            content_blocks: section.content_blocks.map(b => 
              b.id === updatedBlock.id ? updatedBlock : b
            ),
          }))
        );
        toast({ title: "Content updated!" });
      }
    } catch (error) {
      console.error("Error updating block:", error);
      toast({ title: "Error updating content", variant: "destructive" });
    }
  }, [toast]);

  const updateFooterItem = useCallback(async (item: FooterContent) => {
    try {
      const updatedItem = await updateFooterContent(item.id, { content: item.content });
      if (updatedItem) {
        // Optimistic update
        setFooterContent(prevContent => 
          prevContent.map(c => c.id === updatedItem.id ? updatedItem : c)
        );
        toast({ title: "Footer content updated!" });
      }
    } catch (error) {
      console.error("Error updating footer content:", error);
      toast({ title: "Error updating footer content", variant: "destructive" });
    }
  }, [toast]);

  const addPartnerLogo = useCallback(async (sectionId: number) => {
    if (isAddingPartnerLogo) return; // Prevent multiple simultaneous adds
    
    setIsAddingPartnerLogo(true);
    try {
      const tempId = Date.now();
      const tempBlock: HomeContentBlock = {
        id: -tempId, // Negative temporary ID
        section_id: sectionId,
        block_key: `partner_logo_${tempId}`,
        block_type: 'image',
        content: {
          url: 'https://via.placeholder.com/200x100?text=Loading...',
          alt: 'Partner logo'
        },
        sort_order: 0,
        is_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Optimistic update - add to local state immediately
      setSections(prevSections => 
        prevSections.map(section => 
          section.id === sectionId 
            ? { ...section, content_blocks: [...section.content_blocks, tempBlock] }
            : section
        )
      );

      // Create the actual block
      const newBlock = await createHomeContentBlock({
        section_id: sectionId,
        block_key: `partner_logo_${tempId}`,
        block_type: 'image',
        content: {
          url: 'https://via.placeholder.com/200x100?text=Partner+Logo',
          alt: 'Partner logo'
        },
        sort_order: 0,
        is_enabled: true
      });

      if (newBlock) {
        // Replace temp block with real block
        setSections(prevSections => 
          prevSections.map(section => 
            section.id === sectionId 
              ? { 
                  ...section, 
                  content_blocks: section.content_blocks.map(block => 
                    block.id === -tempId ? newBlock : block
                  )
                }
              : section
          )
        );
        toast({ title: "Partner logo added!" });
      } else {
        // Remove temp block if creation failed
        setSections(prevSections => 
          prevSections.map(section => 
            section.id === sectionId 
              ? { 
                  ...section, 
                  content_blocks: section.content_blocks.filter(block => block.id !== -tempId)
                }
              : section
          )
        );
        throw new Error('Failed to create partner logo');
      }
    } catch (error) {
      console.error("Error adding partner logo:", error);
      toast({ title: "Error adding partner logo", variant: "destructive" });
    } finally {
      setIsAddingPartnerLogo(false);
    }
  }, [isAddingPartnerLogo, toast]);

  const deletePartnerLogo = useCallback(async (blockId: number) => {
    if (isDeletingPartnerLogo === blockId) return; // Prevent multiple delete attempts
    
    setIsDeletingPartnerLogo(blockId);
    try {
      // Optimistic update - remove from local state immediately
      let removedBlock: HomeContentBlock | null = null;
      setSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          content_blocks: section.content_blocks.filter(block => {
            if (block.id === blockId) {
              removedBlock = block;
              return false;
            }
            return true;
          })
        }))
      );

      const success = await deleteHomeContentBlock(blockId);
      if (success) {
        toast({ title: "Partner logo deleted!" });
      } else {
        // Restore the block if deletion failed
        if (removedBlock) {
          setSections(prevSections => 
            prevSections.map(section => 
              section.id === removedBlock!.section_id 
                ? { ...section, content_blocks: [...section.content_blocks, removedBlock!] }
                : section
            )
          );
        }
        throw new Error('Failed to delete partner logo');
      }
    } catch (error) {
      console.error("Error deleting partner logo:", error);
      toast({ title: "Error deleting partner logo", variant: "destructive" });
    } finally {
      setIsDeletingPartnerLogo(null);
    }
  }, [isDeletingPartnerLogo, toast]);

  const value: HomeContentContextType = {
    sections,
    footerContent,
    isLoading,
    isAddingPartnerLogo,
    isDeletingPartnerLogo,
    fetchData,
    updateBlock,
    updateFooterItem,
    addPartnerLogo,
    deletePartnerLogo,
  };

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
}