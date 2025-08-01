
"use client"

import { HomeContentBlock } from '@/lib/api';
import { EditableText, EditableMultilineText, EditableImage, IconSelector, ColorPicker } from './editable-components';
import { Button } from '@/components/ui/button';

interface SectionEditorProps {
  blocks: HomeContentBlock[];
  onUpdate: (block: HomeContentBlock) => void;
  onAddPartnerLogo?: () => void;
  onDeletePartnerLogo?: (blockId: number) => void;
  isAddingPartnerLogo?: boolean;
  isDeletingPartnerLogo?: number | null;
}

const findBlock = (blocks: HomeContentBlock[], key: string) => blocks.find(b => b.block_key === key);


export function AboutSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const heading = findBlock(blocks, 'about_heading');
    const title = findBlock(blocks, 'about_title');
    const image = findBlock(blocks, 'about_image');
    
    const highlight1Icon = findBlock(blocks, 'about_highlight_1_icon');
    const highlight1Title = findBlock(blocks, 'about_highlight_1_title');
    const highlight1Desc = findBlock(blocks, 'about_highlight_1_desc');

    const highlight2Icon = findBlock(blocks, 'about_highlight_2_icon');
    const highlight2Title = findBlock(blocks, 'about_highlight_2_title');
    const highlight2Desc = findBlock(blocks, 'about_highlight_2_desc');

    const button1 = findBlock(blocks, 'about_button_1');
    const button2 = findBlock(blocks, 'about_button_2');

    // New content blocks
    const policyTitle = findBlock(blocks, 'about_policy_title');
    const policyContent = findBlock(blocks, 'about_policy_content');
    const missionTitle = findBlock(blocks, 'about_mission_title');
    const missionContent = findBlock(blocks, 'about_mission_content');
    const missionBenefits = findBlock(blocks, 'about_mission_benefits');
    const historyTitle = findBlock(blocks, 'about_history_title');
    const historyContent = findBlock(blocks, 'about_history_content');
    const historySource = findBlock(blocks, 'about_history_source');

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 border-b pb-2">Section Headers</h4>
                        {heading && (
                            <EditableText 
                                initialValue={heading.content.text} 
                                onSave={text => onUpdate({ ...heading, content: { ...heading.content, text } })} 
                                label="Badge/Heading Text"
                                placeholder="e.g., About Us"
                            />
                        )}
                        {title && (
                            <EditableText 
                                initialValue={title.content.text} 
                                onSave={text => onUpdate({ ...title, content: { text } })} 
                                label="Main Title"
                                placeholder="e.g., Learn more about our company"
                            />
                        )}
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 border-b pb-2">Key Highlights</h4>
                        <div className="space-y-4">
                            <div className="p-3 border rounded-md bg-white">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Highlight 1</h5>
                        <div className="flex items-start gap-4">
                                    {highlight1Icon && (
                                        <div className="flex-shrink-0">
                                            <label className="text-xs text-gray-500 block mb-2">Icon</label>
                                            <IconSelector initialValue={highlight1Icon.content.icon} onSave={icon => onUpdate({ ...highlight1Icon, content: { icon } })} />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        {highlight1Title && (
                                            <EditableText 
                                                initialValue={highlight1Title.content.text} 
                                                onSave={text => onUpdate({ ...highlight1Title, content: { text } })} 
                                                label="Title"
                                                placeholder="e.g., Quality Products"
                                            />
                                        )}
                                        {highlight1Desc && (
                                            <EditableText 
                                                initialValue={highlight1Desc.content.text} 
                                                onSave={text => onUpdate({ ...highlight1Desc, content: { text } })} 
                                                label="Description"
                                                placeholder="e.g., We provide high-quality products..."
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border rounded-md bg-white">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Highlight 2</h5>
                                <div className="flex items-start gap-4">
                                    {highlight2Icon && (
                                        <div className="flex-shrink-0">
                                            <label className="text-xs text-gray-500 block mb-2">Icon</label>
                                            <IconSelector initialValue={highlight2Icon.content.icon} onSave={icon => onUpdate({ ...highlight2Icon, content: { icon } })} />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        {highlight2Title && (
                                            <EditableText 
                                                initialValue={highlight2Title.content.text} 
                                                onSave={text => onUpdate({ ...highlight2Title, content: { text } })} 
                                                label="Title"
                                                placeholder="e.g., Expert Support"
                                            />
                                        )}
                                        {highlight2Desc && (
                                            <EditableText 
                                                initialValue={highlight2Desc.content.text} 
                                                onSave={text => onUpdate({ ...highlight2Desc, content: { text } })} 
                                                label="Description"
                                                placeholder="e.g., Our team provides expert support..."
                                            />
                                        )}
                            </div>
                        </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 border-b pb-2">Action Buttons</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {button1 && (
                            <div className="p-4 border rounded-lg bg-white">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Primary Button</h5>
                                <div className="space-y-2">
                                    <EditableText 
                                        initialValue={button1.content.text} 
                                        onSave={text => onUpdate({ ...button1, content: { ...button1.content, text } })} 
                                        label="Button Text"
                                        placeholder="e.g., Learn More"
                                    />
                                    <EditableText 
                                        initialValue={button1.content.link} 
                                        onSave={link => onUpdate({ ...button1, content: { ...button1.content, link } })} 
                                        label="Button Link"
                                        placeholder="e.g., /about"
                                    />
                                </div>
                            </div>
                        )}
                        {button2 && (
                            <div className="p-4 border rounded-lg bg-white">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Secondary Button</h5>
                                <div className="space-y-2">
                                    <EditableText 
                                        initialValue={button2.content.text} 
                                        onSave={text => onUpdate({ ...button2, content: { ...button2.content, text } })} 
                                        label="Button Text"
                                        placeholder="e.g., Contact Us"
                                    />
                                    <EditableText 
                                        initialValue={button2.content.link} 
                                        onSave={link => onUpdate({ ...button2, content: { ...button2.content, link } })} 
                                        label="Button Link"
                                        placeholder="e.g., /contact"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-gray-800 border-b pb-2">Section Image</h4>
                    {image && (
                        <EditableImage 
                            initialValue={image.content.url} 
                            onSave={url => onUpdate({ ...image, content: { ...image.content, url } })} 
                            label="About Section Image"
                        />
                    )}
                </div>
            </div>

            {/* Policy Section */}
            <div className="border-t pt-8">
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Policy Section</h3>
                <div className="space-y-4">
                        {policyTitle && (
                            <EditableText 
                                initialValue={policyTitle.content.text} 
                                onSave={text => policyTitle && onUpdate({ ...policyTitle, content: { ...policyTitle.content, text } })} 
                                label="Policy Title"
                                placeholder="e.g., Our Policy"
                            />
                        )}
                        {policyContent && (
                            <EditableText 
                                initialValue={policyContent.content.text} 
                                onSave={text => policyContent && onUpdate({ ...policyContent, content: { text } })} 
                                label="Policy Content"
                                placeholder="e.g., We are committed to..."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="border-t pt-8">
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Mission Section</h3>
                <div className="space-y-4">
                        {missionTitle && (
                            <EditableText 
                                initialValue={missionTitle.content.text} 
                                onSave={text => missionTitle && onUpdate({ ...missionTitle, content: { ...missionTitle.content, text } })} 
                                label="Mission Title"
                                placeholder="e.g., Our Mission"
                            />
                        )}
                        {missionContent && (
                            <EditableMultilineText 
                                initialValue={missionContent.content.text} 
                                onSave={text => missionContent && onUpdate({ ...missionContent, content: { text } })} 
                                label="Mission Content"
                                placeholder="e.g., Our mission is to..."
                            />
                        )}
                        {missionBenefits && (
                            <EditableMultilineText 
                                initialValue={missionBenefits.content.text} 
                                onSave={text => missionBenefits && onUpdate({ ...missionBenefits, content: { text } })} 
                                label="Mission Benefits"
                                placeholder="e.g., The benefits of our mission include..."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="border-t pt-8">
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">History Section</h3>
                <div className="space-y-4">
                        {historyTitle && (
                            <EditableText 
                                initialValue={historyTitle.content.text} 
                                onSave={text => historyTitle && onUpdate({ ...historyTitle, content: { ...historyTitle.content, text } })} 
                                label="History Title"
                                placeholder="e.g., Our History"
                            />
                        )}
                        {historyContent && (
                            <EditableMultilineText 
                                initialValue={historyContent.content.text} 
                                onSave={text => historyContent && onUpdate({ ...historyContent, content: { text } })} 
                                label="History Content"
                                placeholder="e.g., Founded in..."
                            />
                        )}
                        {historySource && (
                            <EditableText 
                                initialValue={historySource.content.text} 
                                onSave={text => historySource && onUpdate({ ...historySource, content: { ...historySource.content, text } })} 
                                label="History Source"
                                placeholder="e.g., Source: Company Archives"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
  
  export function FeaturesSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const heading = findBlock(blocks, 'features_heading');
    const title = findBlock(blocks, 'features_title');
    const subtitle = findBlock(blocks, 'features_subtitle');
    const feature1 = findBlock(blocks, 'feature_1');
    const feature2 = findBlock(blocks, 'feature_2');
    const feature3 = findBlock(blocks, 'feature_3');
  
    return (
      <div className="space-y-8">
        {/* Section Headers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Section Headers</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {heading && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Badge Text</h4>
                <EditableText initialValue={heading.content.text} onSave={text => onUpdate({ ...heading, content: { ...heading.content, text } })} />
              </div>
            )}
            {title && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Main Title</h4>
                <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { text } })} />
              </div>
            )}
            {subtitle && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Subtitle</h4>
                <EditableText initialValue={subtitle.content.text} onSave={text => onUpdate({ ...subtitle, content: { text } })} />
              </div>
            )}
          </div>
        </div>
  
        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[feature1, feature2, feature3].map((feature, i) => feature && (
              <div key={i} className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold">Feature {i + 1}</h4>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Icon</label>
                  <IconSelector initialValue={feature.content.icon} onSave={icon => onUpdate({ ...feature, content: { ...feature.content, icon } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Title</label>
                  <EditableText initialValue={feature.content.title} onSave={title => onUpdate({ ...feature, content: { ...feature.content, title } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Description</label>
                  <EditableText initialValue={feature.content.description} onSave={description => onUpdate({ ...feature, content: { ...feature.content, description } })} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  

export function StatsSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
  const stats = blocks.filter(b => b.block_type === 'stat');

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Statistics Section</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white space-y-3">
            <h4 className="font-semibold text-gray-700">Stat {i + 1}</h4>
            <div className="space-y-2">
              <EditableText 
                initialValue={stat.content.value} 
                onSave={value => onUpdate({ ...stat, content: { ...stat.content, value } })} 
                label="Statistic Value"
                placeholder="e.g., 100+ or 50K"
              />
              <EditableText 
                initialValue={stat.content.label} 
                onSave={label => onUpdate({ ...stat, content: { ...stat.content, label } })} 
                label="Statistic Label"
                placeholder="e.g., Happy Customers"
              />
            </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export function FeaturedProductsSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const title = findBlock(blocks, 'featured_products_title');
    return (
      <div className="space-y-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Featured Products Section</h3>
      <div className="space-y-4">
          {title && (
            <EditableText 
              initialValue={title.content.text} 
              onSave={text => onUpdate({ ...title, content: { text } })} 
              label="Section Title"
              placeholder="e.g., Featured Products"
            />
          )}
          <div className="p-6 border-dashed border-2 rounded-lg text-center text-gray-500 bg-white">
              <p className="text-lg">Product selection interface will be here.</p>
              <p className="text-sm mt-2">This section will allow you to select and manage featured products.</p>
          </div>
        </div>
      </div>
    );
}

export function TrustedPartnersSectionEditor({ blocks, onUpdate, onAddPartnerLogo, onDeletePartnerLogo, isAddingPartnerLogo, isDeletingPartnerLogo }: SectionEditorProps) {
    const heading = findBlock(blocks, 'partners_heading');
    const title = findBlock(blocks, 'partners_title');
    const logos = blocks.filter(b => 
      b.block_key.startsWith('partner_logo_') && 
      b.block_type === 'image'
    );
    
    const handleRemoveLogo = (logoId: number) => {
        if (onDeletePartnerLogo) {
            onDeletePartnerLogo(logoId);
        }
    };

    const handleAddLogo = () => {
        if (onAddPartnerLogo) {
            onAddPartnerLogo();
        }
    };

    return (
      <div className="space-y-6">
        {/* Header Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Section Headers</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {heading && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Heading Badge</h4>
                <EditableText initialValue={heading.content.text} onSave={text => onUpdate({ ...heading, content: { ...heading.content, text } })} />
              </div>
            )}
            {title && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Section Title</h4>
                <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { ...title.content, text } })} />
              </div>
            )}
          </div>
        </div>

        {/* Partner Logos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Partner Logos</h3>
            <Button 
              onClick={handleAddLogo} 
              disabled={isAddingPartnerLogo}
              className="flex items-center gap-2"
            >
              {isAddingPartnerLogo ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Partner Logo
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {logos.map((logo, i) => (
              <div key={logo.id} className="relative p-4 border rounded-lg group">
                <div className="aspect-[3/2] mb-2">
                  <EditableImage 
                    initialValue={logo.content.url} 
                    onSave={url => onUpdate({ ...logo, content: { ...logo.content, url } })} 
                  />
                </div>
                <div className="space-y-2">
                  <EditableText 
                    initialValue={logo.content.alt || 'Partner logo'} 
                    onSave={alt => onUpdate({ ...logo, content: { ...logo.content, alt } })} 
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                  disabled={isDeletingPartnerLogo === logo.id}
                  onClick={() => handleRemoveLogo(logo.id)}
                >
                  {isDeletingPartnerLogo === logo.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          {logos.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">No partner logos added yet</p>
              <Button 
                onClick={handleAddLogo}
                disabled={isAddingPartnerLogo}
              >
                {isAddingPartnerLogo ? 'Adding...' : 'Add First Partner Logo'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
}

export function CtaSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const heading = findBlock(blocks, 'cta_heading');
    const title = findBlock(blocks, 'cta_title');
    const subtitle = findBlock(blocks, 'cta_subtitle');
    const feature1 = findBlock(blocks, 'cta_feature_1');
    const feature2 = findBlock(blocks, 'cta_feature_2');
    const feature3 = findBlock(blocks, 'cta_feature_3');
    const button1 = findBlock(blocks, 'cta_button_1');
    const button2 = findBlock(blocks, 'cta_button_2');

    return (
        <div className="space-y-8">
            {/* Section Headers */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Section Headers</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {heading && (
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">Badge Text</h4>
                            <EditableText initialValue={heading.content.text} onSave={text => onUpdate({ ...heading, content: { ...heading.content, text } })} />
                        </div>
                    )}
                    {title && (
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">Main Title</h4>
                            <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { text } })} />
                        </div>
                    )}
                    {subtitle && (
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">Subtitle</h4>
                            <EditableText initialValue={subtitle.content.text} onSave={text => onUpdate({ ...subtitle, content: { text } })} />
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Features */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">CTA Features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {[feature1, feature2, feature3].map((feature, i) => feature && (
                        <div key={i} className="p-4 border rounded-lg space-y-4">
                            <h4 className="font-semibold">Feature {i + 1}</h4>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Icon</label>
                                <IconSelector initialValue={feature.content.icon} onSave={icon => onUpdate({ ...feature, content: { ...feature.content, icon } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Title</label>
                                <EditableText initialValue={feature.content.title} onSave={title => onUpdate({ ...feature, content: { ...feature.content, title } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Description</label>
                                <EditableText initialValue={feature.content.description} onSave={description => onUpdate({ ...feature, content: { ...feature.content, description } })} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Call-to-Action Buttons</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {button1 && (
                        <div className="p-4 border rounded-lg space-y-4">
                            <h4 className="font-semibold">Primary Button</h4>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Button Text</label>
                                <EditableText initialValue={button1.content.text} onSave={text => onUpdate({ ...button1, content: { ...button1.content, text } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Button Link</label>
                                <EditableText initialValue={button1.content.link} onSave={link => onUpdate({ ...button1, content: { ...button1.content, link } })} />
                            </div>
                        </div>
                    )}
                    {button2 && (
                        <div className="p-4 border rounded-lg space-y-4">
                            <h4 className="font-semibold">Secondary Button</h4>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Button Text</label>
                                <EditableText initialValue={button2.content.text} onSave={text => onUpdate({ ...button2, content: { ...button2.content, text } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Button Link</label>
                                <EditableText initialValue={button2.content.link} onSave={link => onUpdate({ ...button2, content: { ...button2.content, link } })} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
