
"use client"

import { HomeContentBlock } from '@/lib/api';
import { EditableText, EditableMultilineText, EditableImage, IconSelector, ColorPicker } from './editable-components';

interface SectionEditorProps {
  blocks: HomeContentBlock[];
  onUpdate: (block: HomeContentBlock) => void;
}

const findBlock = (blocks: HomeContentBlock[], key: string) => blocks.find(b => b.block_key === key);


export function HeroSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
  const title = findBlock(blocks, 'hero_title');
  const subtitle = findBlock(blocks, 'hero_subtitle');
  const bgImage = findBlock(blocks, 'hero_background_image');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-2">Background Image</h4>
        <div className="p-4 border rounded-lg flex items-center gap-4">
            {bgImage && <img src={bgImage.content.url} alt="Background" className="w-32 h-20 object-cover rounded-md" />}
            <div className="flex-1">
                {bgImage && <EditableImage initialValue={bgImage.content.url} onSave={url => onUpdate({ ...bgImage, content: { ...bgImage.content, url } })} />}
            </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Hero Text</h4>
        <div className="p-4 border rounded-lg space-y-2">
            <label className="text-sm text-gray-500">Title</label>
            {title && <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { text } })} />}
            <label className="text-sm text-gray-500">Subtitle</label>
            {subtitle && <EditableText initialValue={subtitle.content.text} onSave={text => onUpdate({ ...subtitle, content: { text } })} />}
        </div>
      </div>
    </div>
  );
}


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
                <div className="space-y-4">
                    {heading && <EditableText initialValue={heading.content.text} onSave={text => onUpdate({ ...heading, content: { ...heading.content, text } })} />}
                    {title && <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { text } })} />}

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            {highlight1Icon && <IconSelector initialValue={highlight1Icon.content.icon} onSave={icon => onUpdate({ ...highlight1Icon, content: { icon } })} />}
                            <div className="flex-1 space-y-1">
                                {highlight1Title && <EditableText initialValue={highlight1Title.content.text} onSave={text => onUpdate({ ...highlight1Title, content: { text } })} />}
                                {highlight1Desc && <EditableText initialValue={highlight1Desc.content.text} onSave={text => onUpdate({ ...highlight1Desc, content: { text } })} />}
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            {highlight2Icon && <IconSelector initialValue={highlight2Icon.content.icon} onSave={icon => onUpdate({ ...highlight2Icon, content: { icon } })} />}
                            <div className="flex-1 space-y-1">
                                {highlight2Title && <EditableText initialValue={highlight2Title.content.text} onSave={text => onUpdate({ ...highlight2Title, content: { text } })} />}
                                {highlight2Desc && <EditableText initialValue={highlight2Desc.content.text} onSave={text => onUpdate({ ...highlight2Desc, content: { text } })} />}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        {button1 && (
                            <div className="p-4 border rounded-lg w-full">
                                <h4 className="font-semibold mb-2">Button 1</h4>
                                <EditableText initialValue={button1.content.text} onSave={text => onUpdate({ ...button1, content: { ...button1.content, text } })} />
                                <EditableText initialValue={button1.content.link} onSave={link => onUpdate({ ...button1, content: { ...button1.content, link } })} />
                            </div>
                        )}
                        {button2 && (
                            <div className="p-4 border rounded-lg w-full">
                                <h4 className="font-semibold mb-2">Button 2</h4>
                                <EditableText initialValue={button2.content.text} onSave={text => onUpdate({ ...button2, content: { ...button2.content, text } })} />
                                <EditableText initialValue={button2.content.link} onSave={link => onUpdate({ ...button2, content: { ...button2.content, link } })} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    {image && <EditableImage initialValue={image.content.url} onSave={url => onUpdate({ ...image, content: { ...image.content, url } })} />}
                </div>
            </div>

            {/* Policy Section */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Policy Section</h3>
                <div className="space-y-4">
                    {policyTitle && <EditableText initialValue={policyTitle.content.text} onSave={text => onUpdate({ ...policyTitle, content: { ...policyTitle.content, text } })} />}
                    {policyContent && <EditableText initialValue={policyContent.content.text} onSave={text => onUpdate({ ...policyContent, content: { text } })} />}
                </div>
            </div>

            {/* Mission Section */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Mission Section</h3>
                <div className="space-y-4">
                    {missionTitle && <EditableText initialValue={missionTitle.content.text} onSave={text => onUpdate({ ...missionTitle, content: { ...missionTitle.content, text } })} />}
                    {missionContent && <EditableMultilineText initialValue={missionContent.content.text} onSave={text => onUpdate({ ...missionContent, content: { text } })} />}
                    {missionBenefits && <EditableMultilineText initialValue={missionBenefits.content.text} onSave={text => onUpdate({ ...missionBenefits, content: { text } })} />}
                </div>
            </div>

            {/* History Section */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">History Section</h3>
                <div className="space-y-4">
                    {historyTitle && <EditableText initialValue={historyTitle.content.text} onSave={text => onUpdate({ ...historyTitle, content: { ...historyTitle.content, text } })} />}
                    {historyContent && <EditableMultilineText initialValue={historyContent.content.text} onSave={text => onUpdate({ ...historyContent, content: { text } })} />}
                    {historySource && <EditableText initialValue={historySource.content.text} onSave={text => onUpdate({ ...historySource, content: { ...historySource.content, text } })} />}
                </div>
            </div>
        </div>
    );
}
  
  export function FeaturesSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const feature1 = findBlock(blocks, 'feature_1');
    const feature2 = findBlock(blocks, 'feature_2');
    const feature3 = findBlock(blocks, 'feature_3');
  
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[feature1, feature2, feature3].map((feature, i) => feature && (
          <div key={i} className="p-4 border rounded-lg">
            <IconSelector initialValue={feature.content.icon} onSave={icon => onUpdate({ ...feature, content: { ...feature.content, icon } })} />
            <EditableText initialValue={feature.content.title} onSave={title => onUpdate({ ...feature, content: { ...feature.content, title } })} />
            <EditableText initialValue={feature.content.description} onSave={description => onUpdate({ ...feature, content: { ...feature.content, description } })} />
          </div>
        ))}
      </div>
    );
  }
  

export function StatsSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
  const stats = blocks.filter(b => b.block_type === 'stat');

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <h4 className="font-semibold">Stat {i + 1}</h4>
          <EditableText initialValue={stat.content.label} onSave={label => onUpdate({ ...stat, content: { ...stat.content, label } })} />
          <EditableText initialValue={stat.content.value} onSave={value => onUpdate({ ...stat, content: { ...stat.content, value } })} />
        </div>
      ))}
    </div>
  );
}

export function FeaturedProductsSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const title = findBlock(blocks, 'featured_products_title');
    return (
      <div className="space-y-4">
        {title && <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { text } })} />}
        <div className="p-4 border-dashed border-2 rounded-lg text-center text-gray-500">
            <p>Product selection interface will be here.</p>
        </div>
      </div>
    );
}

export function TrustedPartnersSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const logos = blocks.filter(b => b.block_type === 'image');
    return (
      <div className="grid grid-cols-6 gap-4">
        {logos.map((logo, i) => (
          <EditableImage key={i} initialValue={logo.content.url} onSave={url => onUpdate({ ...logo, content: { ...logo.content, url } })} />
        ))}
      </div>
    );
}

export function CtaSectionEditor({ blocks, onUpdate }: SectionEditorProps) {
    const title = findBlock(blocks, 'cta_title');
    const subtitle = findBlock(blocks, 'cta_subtitle');
    const button1 = findBlock(blocks, 'cta_button_1');
    const button2 = findBlock(blocks, 'cta_button_2');

    return (
        <div className="space-y-4 text-center">
            {title && <EditableText initialValue={title.content.text} onSave={text => onUpdate({ ...title, content: { text } })} />}
            {subtitle && <EditableText initialValue={subtitle.content.text} onSave={text => onUpdate({ ...subtitle, content: { text } })} />}
            <div className="flex justify-center gap-4">
                {button1 && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold">Button 1</h4>
                        <EditableText initialValue={button1.content.text} onSave={text => onUpdate({ ...button1, content: { ...button1.content, text } })} />
                        <EditableText initialValue={button1.content.link} onSave={link => onUpdate({ ...button1, content: { ...button1.content, link } })} />
                    </div>
                )}
                {button2 && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold">Button 2</h4>
                        <EditableText initialValue={button2.content.text} onSave={text => onUpdate({ ...button2, content: { ...button2.content, text } })} />
                        <EditableText initialValue={button2.content.link} onSave={link => onUpdate({ ...button2, content: { ...button2.content, link } })} />
                    </div>
                )}
            </div>
        </div>
    )
}
