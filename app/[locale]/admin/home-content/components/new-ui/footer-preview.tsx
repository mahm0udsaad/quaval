"use client"

import { FooterContent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FooterPreviewProps {
  content: FooterContent[];
}

const findContent = (content: FooterContent[], key: string) => content.find(c => c.content_key === key);

export function FooterPreview({ content }: FooterPreviewProps) {
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
  const newsletterPlaceholder = findContent(content, 'newsletter_placeholder');
  const newsletterButton = findContent(content, 'newsletter_button');
  const socialLinks = content.filter(c => c.content_type === 'social_media');
  const copyright = findContent(content, 'copyright');

  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          {logo && <img src={logo.content.url} alt="Logo" className="h-12" />}
          {tagline && <p className="text-gray-400">{tagline.content.text}</p>}
        </div>

        <div className="space-y-4">
          {quickLinksTitle && <h3 className="font-semibold">{quickLinksTitle.content.text}</h3>}
          <ul className="space-y-2">
            {quickLinks.map(link => (
              <li key={link.id}><a href={link.content.url} className="hover:text-blue-400">{link.content.text}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {contactTitle && <h3 className="font-semibold">{contactTitle.content.text}</h3>}
          <address className="not-italic text-gray-400">
            {address1 && <p>{address1.content.text}</p>}
            {address2 && <p>{address2.content.text}</p>}
            {phone && <p>{phone.content.text}</p>}
          </address>
        </div>

        <div className="space-y-4">
          {newsletterTitle && <h3 className="font-semibold">{newsletterTitle.content.text}</h3>}
          {newsletterText && <p className="text-gray-400">{newsletterText.content.text}</p>}
          <div className="flex gap-2 mt-2">
            {newsletterPlaceholder && <Input type="email" placeholder={newsletterPlaceholder.content.text} className="bg-gray-700 border-gray-600" />}
            {newsletterButton && <Button>{newsletterButton.content.text}</Button>}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 flex justify-between items-center">
        {copyright && <p className="text-gray-500 text-sm">{copyright.content.text}</p>}
        <div className="flex gap-4">
          {socialLinks.map(link => (
            <a key={link.id} href={link.content.url} className="hover:text-blue-400">{link.content.platform}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}