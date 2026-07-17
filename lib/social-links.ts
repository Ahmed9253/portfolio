import type { IconType } from 'react-icons';
import { FaInstagram, FaLinkedinIn, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { SiGmail } from 'react-icons/si';
import type { SocialLinks } from './content';

export type SocialLinkConfig = {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
  type: 'url' | 'email';
  icon: IconType;
};

export const socialLinkConfig: SocialLinkConfig[] = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-profile', type: 'url', icon: FaInstagram },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/923001234567', type: 'url', icon: FaWhatsapp },
  { key: 'gmail', label: 'Gmail', placeholder: 'hello@devquantums.com', type: 'email', icon: SiGmail },
  { key: 'x', label: 'X', placeholder: 'https://x.com/your-profile', type: 'url', icon: FaXTwitter },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/devquantums', type: 'url', icon: FaLinkedinIn },
];

export function socialHref(key: keyof SocialLinks, value: string) {
  return key === 'gmail' ? `mailto:${value}` : value;
}