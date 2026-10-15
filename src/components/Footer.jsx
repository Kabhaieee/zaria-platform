import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <>
      {/* PREMIUM FOOTER */}
      <footer className="bg-[#111111] text-[#F5EFEA]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 pt-16 md:pt-20 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16 text-right">

            {/* Brand */}
            <div>
              <div className="font-serif text-[#C49A6C] font-bold text-xl uppercase tracking-widest mb-4" dir="ltr">
                Z A R I A
              </div>
              <p className="text-[#F5EFEA]/50 font-light text-sm leading-[1.8] mb-5">
                {t('footer.brand_desc')}
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-[#F5EFEA]/70 text-sm font-medium">{t('footer.made_in')}</span>
                <a href="https://zaria.com" className="text-[#C49A6C] text-sm hover:underline" dir="ltr" style={{ textAlign: 'right' }}>www.zaria.com</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-[#C49A6C] mb-5 tracking-wide">{t('footer.quick_links')}</h4>
              <ul className="space-y-3">
                {[
                  { label: t('footer.link_home'), href: '/' },
                  { label: t('footer.link_templates'), href: '/templates' },
                  { label: t('footer.link_pricing'), href: '/#pricing' },
                  { label: t('footer.link_blog'), href: '#' },
                  { label: t('footer.link_about'), href: '#' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-[#F5EFEA]/50 font-light text-sm hover:text-[#C49A6C] transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-sm font-bold text-[#C49A6C] mb-5 tracking-wide">{t('footer.policies')}</h4>
              <ul className="space-y-3">
                {[
                  { label: t('footer.policy_privacy'), href: '/privacy' },
                  { label: t('footer.policy_terms'), href: '/terms' },
                  { label: t('footer.policy_refund'), href: '/refund' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-[#F5EFEA]/50 font-light text-sm hover:text-[#C49A6C] transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-[#C49A6C] mb-5 tracking-wide">{t('footer.contact')}</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 text-[#F5EFEA]/70 font-light text-sm hover:text-[#C49A6C] transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C49A6C]/20 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white group-hover:text-[#C49A6C]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </div>
                    <span dir="auto">{t('footer.social_insta')}</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 text-[#F5EFEA]/70 font-light text-sm hover:text-[#C49A6C] transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C49A6C]/20 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white group-hover:text-[#C49A6C]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span dir="auto">{t('footer.social_wa')}</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 text-[#F5EFEA]/70 font-light text-sm hover:text-[#C49A6C] transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C49A6C]/20 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white group-hover:text-[#C49A6C]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                    </div>
                    <span dir="auto">TikTok</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 text-[#F5EFEA]/70 font-light text-sm hover:text-[#C49A6C] transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C49A6C]/20 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white group-hover:text-[#C49A6C]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span dir="auto">Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 text-[#F5EFEA]/70 font-light text-sm hover:text-[#C49A6C] transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C49A6C]/20 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white group-hover:text-[#C49A6C]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </div>
                    <span dir="auto">LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 text-[#F5EFEA]/70 font-light text-sm hover:text-[#C49A6C] transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C49A6C]/20 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white group-hover:text-[#C49A6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <span dir="auto">{t('footer.social_email')}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#F5EFEA]/10 pt-8 text-center">
            <p className="text-[#F5EFEA]/30 text-xs font-light">
              {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#F5EFEA]/95 backdrop-blur-lg border-t border-[#EAD1C6]/40 p-3 z-50 flex items-center gap-3 md:hidden">
        <a
          href="#"
          className="w-12 h-12 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md hover:-translate-y-0.5 transition-transform"
          aria-label="WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
        <a
          href="#contact"
          className="flex-1 bg-[#C49A6C] text-white rounded-full py-3.5 text-sm font-bold shadow-md text-center hover:-translate-y-0.5 transition-transform"
        >
          {t('footer.mobile_order')}
        </a>
      </div>
    </>
  );
}
