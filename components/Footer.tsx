import { useEffect, useState } from 'react';
import Logo from '../imports/Логотипы';
import { getSettings, LandingSettings } from '../utils/settings';
import { ContentData } from '../utils/api';
import { Settings } from 'lucide-react';

// Custom SVG icons for social networks
const VkIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M25.5 35.5s.8-.1 1.2-.5c.4-.4.4-1.2.4-1.2s-.1-3.7 1.6-4.2c1.7-.5 3.8 3.6 6.1 5.2 1.7 1.2 3 .9 3 .9l6.1-.1s3.2-.2 1.7-2.7c-.1-.2-.9-1.9-4.5-5.3-3.8-3.6-3.3-3 1.3-9.2 2.8-3.8 3.9-6.1 3.6-7.1-.3-.9-2.4-.7-2.4-.7l-6.9.1s-.5-.1-.9.2c-.4.2-.6.7-.6.7s-1.1 2.9-2.5 5.4c-3 5.2-4.2 5.5-4.7 5.2-1.2-.8-.9-3.1-.9-4.7 0-5.1.8-7.2-1.5-7.8-.8-.2-1.3-.3-3.2-.3-2.4 0-4.5 0-5.7.6-.8.4-1.4 1.3-1 1.3.5.1 1.5.3 2 1 .7 1 .7 3.2.7 3.2s.4 6-.9 6.8c-.9.5-2.2-.5-4.9-5.3-1.4-2.4-2.5-5.1-2.5-5.1s-.2-.5-.6-.8c-.4-.3-1-.4-1-.4l-6.5.1s-1 0-1.3.5c-.3.4 0 1.2 0 1.2s5.1 12 10.8 18c5.3 5.5 11.3 5.1 11.3 5.1h2.7z" fill="white"/>
  </svg>
);

const TgIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.037.308.021.475z" fill="white"/>
  </svg>
);

const OkIcon = () => (
  <img 
    src="https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/icons/ok.svg" 
    alt="OK" 
    className="w-6 h-6" 
    style={{ filter: 'brightness(0) invert(1)' }}
  />
);

const DzenIcon = () => (
  <img 
    src="https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/icons/dzen.svg" 
    alt="Дзен" 
    className="w-6 h-6" 
    style={{ filter: 'brightness(0) invert(1)' }}
  />
);

interface FooterProps {
  content?: ContentData;
  landingType?: 'advent' | 'stats';
}

export function Footer({ content = {}, landingType = 'advent' }: FooterProps) {
  const [settings, setSettings] = useState<LandingSettings>(getSettings());
  const [forceUpdate, setForceUpdate] = useState(0); // Для принудительного обновления компонента
  
  // Debug: log localStorage value
  useEffect(() => {
    const savedShowAdminIcon = localStorage.getItem('admin_show_admin_icon');
    console.log('[Footer] admin_show_admin_icon from localStorage:', savedShowAdminIcon);
  }, [forceUpdate]);
  
  // Social links from database with fallback to defaults
  const socialLinks = {
    vk: content.social_vk || 'https://vk.com/litnetcom',
    telegram: content.social_telegram || 'https://t.me/litnet_official',
    ok: content.social_ok || 'https://ok.ru/litnet',
    dzen: content.social_dzen || 'https://dzen.ru/litnet'
  };
  
  useEffect(() => {
    setSettings(getSettings());
    
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      setSettings(getSettings());
    };
    
    // Listen for content updates (включая изменение настройки шестеренки)
    const handleContentUpdate = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);
  
  return (
    <footer className="pt-16 px-4 pb-8 text-white relative z-10">
      <div className="mx-auto flex md:flex-row flex-col items-center md:items-start justify-between relative z-10 gap-6 md:gap-0" style={{ maxWidth: '1080pt', width: '100%' }}>
        {/* Left side - Logo and text */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <a 
            href="https://litnet.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <div className="w-32 h-10">
              <Logo />
            </div>
          </a>
          
          <div className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt' }}>
            {landingType === 'stats' 
              ? 'Итоги 2025 года' 
              : (content.footer_description || 'Адвент календарь 2025')}
          </div>
        </div>
        
        {/* Right side - Social links */}
        <div className="flex gap-4">
          <a
            href={socialLinks.vk}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/10 text-white"
            aria-label="ВКонтакте"
          >
            <VkIcon />
          </a>
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/10 text-white"
            aria-label="Telegram"
          >
            <TgIcon />
          </a>
          <a
            href={socialLinks.ok}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/10 text-white"
            aria-label="Одноклассники"
          >
            <OkIcon />
          </a>
          <a
            href={socialLinks.dzen}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/10 text-white"
            aria-label="Яндекс.Дзен"
          >
            <DzenIcon />
          </a>
        </div>
      </div>
      
      {/* Bottom section - copyright and links */}
      <div className="mx-auto md:mt-16 mt-8 flex flex-col md:flex-row items-center md:justify-end gap-4 text-white/60 relative" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11pt', maxWidth: '1080pt', width: '100%' }}>
        {/* Links - Right (copyright removed) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Build visible links array */}
          {(() => {
            const links = [];
            
            // Link 1 - only add if has URL
            if (content.footer_link_terms_url && content.footer_link_terms_url.trim() !== '') {
              links.push({
                text: content.footer_link_terms || 'Правила акции',
                url: content.footer_link_terms_url
              });
            }
            
            // Link 2 - only add if has URL
            if (content.footer_link_privacy_url && content.footer_link_privacy_url.trim() !== '') {
              links.push({
                text: content.footer_link_privacy || 'Политика конфиденциальности',
                url: content.footer_link_privacy_url
              });
            }
            
            // Link 3 - only add if has URL
            if (content.footer_link_help_url && content.footer_link_help_url.trim() !== '') {
              links.push({
                text: content.footer_link_help || 'Пользовательское соглашение',
                url: content.footer_link_help_url
              });
            }
            
            return links.map((link, index) => (
              <span key={index} className="flex items-center gap-3">
                <a href={link.url} className="hover:text-white/80 transition-colors text-center whitespace-nowrap">
                  {link.text}
                </a>
                {index < links.length - 1 && <span>•</span>}
              </span>
            ));
          })()}
          
          {/* Admin Settings Icon */}
          {(() => {
            // Читаем настройку из localStorage (как и точную дату)
            const savedShowAdminIcon = localStorage.getItem('admin_show_admin_icon');
            const showAdminIcon = savedShowAdminIcon === null ? true : savedShowAdminIcon === 'true';
            
            if (!showAdminIcon) return null;
            
            const links = [];
            
            if (content.footer_link_terms_url && content.footer_link_terms_url.trim() !== '') links.push(1);
            if (content.footer_link_privacy_url && content.footer_link_privacy_url.trim() !== '') links.push(1);
            if (content.footer_link_help_url && content.footer_link_help_url.trim() !== '') links.push(1);
            
            return (
              <>
                {links.length > 0 && <span>•</span>}
                <button 
                  onClick={() => {
                    window.history.pushState({}, '', '/admin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="hover:text-white/80 transition-colors flex items-center cursor-pointer bg-transparent border-none p-0"
                  aria-label="Админ-панель"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </footer>
  );
}