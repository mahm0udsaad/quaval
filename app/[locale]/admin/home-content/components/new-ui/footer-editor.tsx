"use client"

import { FooterContent } from '@/lib/api';
import { EditableText, EditableImage } from './editable-components';

interface FooterEditorProps {
  content: FooterContent[];
  onUpdate: (item: FooterContent) => void;
}

const findContent = (content: FooterContent[], key: string) => content.find(c => c.content_key === key);

export function FooterEditor({ content, onUpdate }: FooterEditorProps) {
  const logo = findContent(content, 'company_logo');
  const tagline = findContent(content, 'company_tagline');
  const quickLinksTitle = findContent(content, 'quick_links_title');
  const quickLinks = content.filter(c => c.content_type === 'link');
  const contactTitle = findContent(content, 'contact_title');
  const address1 = findContent(content, 'contact_address_1');
  const address2 = findContent(content, 'contact_address_2');
  const phone = findContent(content, 'contact_phone');
  const newsletterTitle = findContent(content, 'newsletter_title');
  const newsletterText = findContent(content, 'newsletter_text');
  const socialLinks = content.filter(c => c.content_type === 'social_media');
  const copyright = findContent(content, 'copyright');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <h3 className="font-semibold">Company Info</h3>
        {logo && <EditableImage initialValue={logo.content.url} onSave={url => onUpdate({ ...logo, content: { ...logo.content, url } })} />}
        {tagline && <EditableText initialValue={tagline.content.text} onSave={text => onUpdate({ ...tagline, content: { text } })} />}
      </div>

      <div className="space-y-4">
        {quickLinksTitle && <EditableText initialValue={quickLinksTitle.content.text} onSave={text => onUpdate({ ...quickLinksTitle, content: { text } })} />}
        {quickLinks.map(link => (
          <div key={link.id} className="p-2 border-b">
            <EditableText initialValue={link.content.text} onSave={text => onUpdate({ ...link, content: { ...link.content, text } })} />
            <EditableText initialValue={link.content.url} onSave={url => onUpdate({ ...link, content: { ...link.content, url } })} />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {contactTitle && <EditableText initialValue={contactTitle.content.text} onSave={text => onUpdate({ ...contactTitle, content: { text } })} />}
        {address1 && <EditableText initialValue={address1.content.text} onSave={text => onUpdate({ ...address1, content: { text } })} />}
        {address2 && <EditableText initialValue={address2.content.text} onSave={text => onUpdate({ ...address2, content: { text } })} />}
        {phone && <EditableText initialValue={phone.content.text} onSave={text => onUpdate({ ...phone, content: { text } })} />}
      </div>

      <div className="space-y-4">
        {newsletterTitle && <EditableText initialValue={newsletterTitle.content.text} onSave={text => onUpdate({ ...newsletterTitle, content: { text } })} />}
        {newsletterText && <EditableText initialValue={newsletterText.content.text} onSave={text => onUpdate({ ...newsletterText, content: { text } })} />}
        <div className="flex gap-2">
            {socialLinks.map(link => (
                <div key={link.id} className="p-2 border rounded-md">
                    <EditableText initialValue={link.content.platform} onSave={platform => onUpdate({...link, content: {...link.content, platform}})} />
                    <EditableText initialValue={link.content.url} onSave={url => onUpdate({...link, content: {...link.content, url}})} />
                </div>
            ))}
        </div>
        {copyright && <EditableText initialValue={copyright.content.text} onSave={text => onUpdate({ ...copyright, content: { text } })} />}
      </div>
    </div>
  );
}