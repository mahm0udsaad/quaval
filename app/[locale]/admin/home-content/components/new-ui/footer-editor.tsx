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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Company Info Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Company Info</h3>
          <div className="space-y-3">
            {logo && (
              <EditableImage 
                initialValue={logo.content.url} 
                onSave={url => onUpdate({ ...logo, content: { ...logo.content, url } })} 
                label="Company Logo"
              />
            )}
            {tagline && (
              <EditableText 
                initialValue={tagline.content.text} 
                onSave={text => onUpdate({ ...tagline, content: { text } })} 
                label="Company Tagline"
                placeholder="Enter company tagline..."
              />
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Quick Links</h3>
          <div className="space-y-3">
            {quickLinksTitle && (
              <EditableText 
                initialValue={quickLinksTitle.content.text} 
                onSave={text => onUpdate({ ...quickLinksTitle, content: { text } })} 
                label="Section Title"
                placeholder="e.g., Quick Links"
              />
            )}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600">Navigation Links</h4>
              {quickLinks.map((link, index) => (
                <div key={link.id} className="p-3 border rounded-md bg-white space-y-2">
                  <div className="text-xs text-gray-500 font-medium">Link {index + 1}</div>
                  <EditableText 
                    initialValue={link.content.text} 
                    onSave={text => onUpdate({ ...link, content: { ...link.content, text } })} 
                    label="Link Text"
                    placeholder="e.g., About Us"
                  />
                  <EditableText 
                    initialValue={link.content.url} 
                    onSave={url => onUpdate({ ...link, content: { ...link.content, url } })} 
                    label="Link URL"
                    placeholder="e.g., /about"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Contact Info</h3>
          <div className="space-y-3">
            {contactTitle && (
              <EditableText 
                initialValue={contactTitle.content.text} 
                onSave={text => onUpdate({ ...contactTitle, content: { text } })} 
                label="Section Title"
                placeholder="e.g., Contact Us"
              />
            )}
            {address1 && (
              <EditableText 
                initialValue={address1.content.text} 
                onSave={text => onUpdate({ ...address1, content: { text } })} 
                label="Address Line 1"
                placeholder="e.g., 123 Main Street"
              />
            )}
            {address2 && (
              <EditableText 
                initialValue={address2.content.text} 
                onSave={text => onUpdate({ ...address2, content: { text } })} 
                label="Address Line 2"
                placeholder="e.g., Suite 100, City, State 12345"
              />
            )}
            {phone && (
              <EditableText 
                initialValue={phone.content.text} 
                onSave={text => onUpdate({ ...phone, content: { text } })} 
                label="Phone Number"
                placeholder="e.g., +1 (555) 123-4567"
              />
            )}
          </div>
        </div>

        {/* Newsletter & Social Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Newsletter & Social</h3>
          <div className="space-y-4">
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600">Newsletter</h4>
              {newsletterTitle && (
                <EditableText 
                  initialValue={newsletterTitle.content.text} 
                  onSave={text => onUpdate({ ...newsletterTitle, content: { text } })} 
                  label="Newsletter Title"
                  placeholder="e.g., Subscribe to our newsletter"
                />
              )}
              {newsletterText && (
                <EditableText 
                  initialValue={newsletterText.content.text} 
                  onSave={text => onUpdate({ ...newsletterText, content: { text } })} 
                  label="Newsletter Description"
                  placeholder="e.g., Get the latest updates..."
                />
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600">Social Media Links</h4>
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <div key={link.id} className="p-3 border rounded-md bg-white space-y-2">
                    <div className="text-xs text-gray-500 font-medium">Social Link {index + 1}</div>
                    <EditableText 
                      initialValue={link.content.platform} 
                      onSave={platform => onUpdate({...link, content: {...link.content, platform}})} 
                      label="Platform Name"
                      placeholder="e.g., Facebook, Twitter, LinkedIn"
                    />
                    <EditableText 
                      initialValue={link.content.url} 
                      onSave={url => onUpdate({...link, content: {...link.content, url}})} 
                      label="Social URL"
                      placeholder="e.g., https://facebook.com/yourpage"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-3">Copyright</h3>
        {copyright && (
          <EditableText 
            initialValue={copyright.content.text} 
            onSave={text => onUpdate({ ...copyright, content: { text } })} 
            label="Copyright Notice"
            placeholder="e.g., © 2024 Your Company Name. All rights reserved."
          />
        )}
      </div>
    </div>
  );
}