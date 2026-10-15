import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Camera, Sliders, MessageSquare, QrCode, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Features() {
  const [activeFeature, setActiveFeature] = useState('rsvp');
  const { t } = useLanguage();

  return (
    <>
      {/* FEATURE SHOWCASE */}
      <section className="py-12 md:py-8 relative bg-gradient-to-b from-[#FAF6F3]/60 to-transparent overflow-x-hidden pb-16">
      <motion.div
        className="text-center mb-16 px-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6 opacity-90">
          <div className="w-24 md:w-40 h-[1px] bg-gradient-to-l from-transparent to-[#C49A6C]" />
          <div className="w-2.5 h-2.5 bg-[#C49A6C] rotate-45 shrink-0" />
          <div className="w-24 md:w-40 h-[1px] bg-gradient-to-l from-[#C49A6C] to-transparent" />
        </div>
        <p className="text-[#A88461] text-sm md:text-base font-bold tracking-wider mb-4" dir="auto">{t('features.tag')}</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#111111] font-bold mb-6 max-w-2xl mx-auto leading-tight" dir="auto">
          {t('features.title')}
        </h2>
        <p className="text-[#444444] font-medium text-base md:text-lg" dir="auto">
          {t('features.desc')}
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        
        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start lg:bg-white/40 lg:backdrop-blur-xl lg:rounded-[2.5rem] lg:p-12 lg:border lg:border-white/60 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {/* Right Side (First in RTL): Feature Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4 z-10">
            {[
              { id: 'rsvp', icon: Users, title: t('features.grid_rsvp_title'), desc: t('features.grid_rsvp_desc') },
              { id: 'music', icon: Music, title: t('features.grid_music_title'), desc: t('features.grid_music_desc') },
              { id: 'album', icon: Camera, title: t('features.grid_album_title'), desc: t('features.grid_album_desc') },
              { id: 'edit', icon: Sliders, title: t('features.grid_edit_title'), desc: t('features.grid_edit_desc') },
              { id: 'guestbook', icon: MessageSquare, title: t('features.grid_guestbook_title'), desc: t('features.grid_guestbook_desc') },
              { id: 'qr', icon: QrCode, title: t('features.grid_qr_title'), desc: t('features.grid_qr_desc') },
            ].map((feat) => {
              const isActive = activeFeature === feat.id;
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveFeature(feat.id)}
                  className={`cursor-pointer transition-all duration-500 p-3.5 sm:p-5 rounded-2xl sm:rounded-[2rem] border flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-white border-[#A88461]/40 shadow-[0_10px_30px_rgba(168,132,97,0.1)] ring-1 ring-[#A88461]/10' 
                      : 'bg-white/60 border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:bg-white hover:border-[#A88461]/20 hover:shadow-md backdrop-blur-md'
                  }`}
                >
                  {/* Subtle Background Glow for Active State */}
                  {isActive && <div className="absolute top-0 right-0 w-32 h-32 bg-[#A88461]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />}

                  {/* Selected Indicator Line */}
                  {isActive && <div className="absolute top-1/2 -translate-y-1/2 right-0 h-12 w-1.5 bg-gradient-to-b from-[#C49A6C] to-[#8A6A4B] rounded-l-full shadow-[0_0_10px_rgba(168,132,97,0.5)]" />}
                  
                  {/* Text Container */}
                  <div className="flex flex-col flex-1 text-center sm:text-right z-10 sm:mr-3 order-2 sm:order-1">
                    <h4 className={`font-bold text-[13px] sm:text-[16px] mb-0.5 transition-colors duration-300 ${isActive ? 'text-[#111111]' : 'text-[#444444]'}`}>
                      {feat.title}
                    </h4>
                    <p className={`text-[10px] sm:text-[11.5px] leading-[1.4] font-medium transition-colors duration-300 ${isActive ? 'text-[#888888]' : 'text-[#999999]'}`}>
                      {feat.desc}
                    </p>
                  </div>

                  {/* Icon Container */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 z-10 order-1 sm:order-2 ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#C49A6C] to-[#8A6A4B] text-white shadow-[0_8px_20px_rgba(168,132,97,0.4)] scale-105' 
                      : 'bg-[#F5EFEA] text-[#888888] group-hover:bg-[#EAD1C6]/30 group-hover:text-[#A88461]'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Side (Second in RTL): Stylized Mockup Container */}
          <div className="w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0">
            <div className="w-full max-w-[500px] bg-gradient-to-b from-[#1C1628] to-[#120D1A] rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col pt-10 overflow-hidden relative border border-white/5">
              
              {/* Dynamic Header */}
              <div className="w-full flex items-center justify-center gap-4 pb-8 px-6 relative z-10">
                 {activeFeature === 'rsvp' && (
                   <>
                     <div className="text-right">
                       <p className="text-[11px] text-white/50 mb-1 font-medium tracking-wide">{t('features.selected_feature')}</p>
                       <p className="font-bold text-white text-2xl leading-none">{t('features.grid_rsvp_title')}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[1.1rem] bg-[#E11D48] text-white flex items-center justify-center shadow-lg shadow-[#E11D48]/30">
                       <Users className="w-6 h-6" />
                     </div>
                   </>
                 )}
                 {activeFeature === 'music' && (
                   <>
                     <div className="text-right">
                       <p className="text-[11px] text-white/50 mb-1 font-medium tracking-wide">{t('features.selected_feature')}</p>
                       <p className="font-bold text-white text-2xl leading-none">{t('features.grid_music_title')}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[1.1rem] bg-[#8B5CF6] text-white flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
                       <Music className="w-6 h-6" />
                     </div>
                   </>
                 )}
                 {activeFeature === 'album' && (
                   <>
                     <div className="text-right">
                       <p className="text-[11px] text-white/50 mb-1 font-medium tracking-wide">{t('features.selected_feature')}</p>
                       <p className="font-bold text-white text-2xl leading-none">{t('features.grid_album_title')}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[1.1rem] bg-[#0EA5E9] text-white flex items-center justify-center shadow-lg shadow-[#0EA5E9]/30">
                       <Camera className="w-6 h-6" />
                     </div>
                   </>
                 )}
                 {activeFeature === 'edit' && (
                   <>
                     <div className="text-right">
                       <p className="text-[11px] text-white/50 mb-1 font-medium tracking-wide">{t('features.selected_feature')}</p>
                       <p className="font-bold text-white text-2xl leading-none">{t('features.grid_edit_title')}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[1.1rem] bg-[#F59E0B] text-white flex items-center justify-center shadow-lg shadow-[#F59E0B]/30">
                       <Sliders className="w-6 h-6" />
                     </div>
                   </>
                 )}
                 {activeFeature === 'guestbook' && (
                   <>
                     <div className="text-right">
                       <p className="text-[11px] text-white/50 mb-1 font-medium tracking-wide">{t('features.selected_feature')}</p>
                       <p className="font-bold text-white text-2xl leading-none">{t('features.grid_guestbook_title')}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[1.1rem] bg-[#10B981] text-white flex items-center justify-center shadow-lg shadow-[#10B981]/30">
                       <MessageSquare className="w-6 h-6" />
                     </div>
                   </>
                 )}
                 {activeFeature === 'qr' && (
                   <>
                     <div className="text-right">
                       <p className="text-[11px] text-white/50 mb-1 font-medium tracking-wide">{t('features.selected_feature')}</p>
                       <p className="font-bold text-white text-2xl leading-none">{t('features.grid_qr_title')}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[1.1rem] bg-[#3B82F6] text-white flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                       <QrCode className="w-6 h-6" />
                     </div>
                   </>
                 )}
              </div>

              {/* Mockup Screen Content Wrapper */}
              <div className="w-full flex-1 flex flex-col relative px-4 pb-4 sm:px-6 sm:pb-6 z-10">
                {/* The Main Card */}
                <div className="w-full h-full min-h-[440px] rounded-[2rem] p-5 sm:p-6 relative flex flex-col overflow-hidden shadow-2xl bg-[#FAF9F6] border border-white">
                 
                 {/* Dynamic Content based on State */}
                 {activeFeature === 'rsvp' && (
                    <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="w-full h-full flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[9px] font-bold bg-pink-100 text-pink-500 px-3 py-1.5 rounded-full">محدث قبل دقيقة</span>
                        <h3 className="font-black text-[#111111] text-lg">الحضور الآن</h3>
                      </div>
                      
                      <div className="flex flex-row-reverse items-center justify-between mb-8 px-2">
                        {/* Progress Ring */}
                        <div className="relative w-28 h-28 shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#E11D48" strokeWidth="12" strokeDasharray="264" strokeDashoffset="60" className="transition-all duration-1000" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                            <span className="text-[32px] font-black text-[#111111] leading-none">124</span>
                            <span className="text-[10px] text-gray-500 font-bold mt-1">حاضر</span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-3.5 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <span className="text-[11px] font-bold text-gray-500">أكدوا حضورهم <span className="font-black text-[#111111] ml-1">124</span></span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#E11D48]"></div>
                          </div>
                          <div className="flex items-center justify-end gap-2.5">
                            <span className="text-[11px] font-bold text-gray-500">لسه ما جاوبوا <span className="font-black text-[#111111] ml-1">18</span></span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FCD34D]"></div>
                          </div>
                          <div className="flex items-center justify-end gap-2.5">
                            <span className="text-[11px] font-bold text-gray-500">اعتذروا بلطف <span className="font-black text-[#111111] ml-1">9</span></span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]"></div>
                          </div>
                        </div>
                      </div>

                      {/* List */}
                      <div className="w-full space-y-3 flex-1 relative z-10">
                        {[
                          { name: 'سارة أحمد', guests: '+1 مرافق', initial: 'س', color: 'bg-pink-100 text-pink-600', checked: true },
                          { name: 'مصطفى علي', guests: '+2 مرافقين', initial: 'م', color: 'bg-rose-100 text-rose-600', checked: true },
                          { name: 'زهراء حسن', guests: '+1 مرافق', initial: 'ز', color: 'bg-pink-100 text-pink-600', checked: true }
                        ].map((guest, i) => (
                          <div key={i} className="bg-white p-3.5 rounded-[1.25rem] border border-gray-100 shadow-sm flex justify-between items-center transition-transform hover:-translate-y-0.5">
                            <div className="flex items-center gap-2">
                              {guest.checked && (
                                <div className="w-5 h-5 rounded-full border border-teal-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                              )}
                              <span className="text-[11px] font-bold text-gray-400">{guest.guests}</span>
                            </div>
                            <div className="flex items-center gap-3.5">
                              <span className="text-[13px] font-bold text-[#111111]">{guest.name}</span>
                              <div className={`w-9 h-9 rounded-[0.85rem] ${guest.color} flex items-center justify-center font-bold text-sm shadow-inner`}>{guest.initial}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                 )}

                 {activeFeature === 'music' && (
                    <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="w-full h-full flex flex-col">
                      
                      <h5 className="text-[#111111] font-bold mb-6 text-center">{t('features.mock_music_control')}</h5>
                          
                          {/* Music Tracks */}
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center bg-[#8B5CF6]/5 border border-[#8B5CF6]/40 p-4 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                                  <Music className="w-4 h-4 text-[#8B5CF6]" />
                                </div>
                                <span className="text-[#111111] font-bold text-sm">{t('features.mock_music_zaffa')}</span>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-2xl opacity-60">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Music className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="text-gray-500 font-bold text-sm">{t('features.mock_music_soft')}</span>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                            </div>
                          </div>

                          {/* Autoplay Toggle */}
                          <div className="mt-8 flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                            <span className="text-gray-600 text-sm font-bold">{t('features.mock_music_auto')}</span>
                            <div className="w-12 h-6 bg-[#8B5CF6] rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                    </motion.div>
                 )}

                 {activeFeature === 'album' && (
                    <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="w-full h-full flex flex-col">
                      <div className="flex justify-between items-start mb-5">
                        <span className="text-[10px] font-bold bg-[#C49A6C]/10 text-[#C49A6C] px-3 py-1.5 rounded-full mt-1 border border-[#C49A6C]/20">47 صورة</span>
                        <div className="text-right">
                          <h3 className="font-serif font-black text-[#111111] text-xl leading-tight mb-1">ألبوم فرحتكم</h3>
                          <p className="text-gray-500 text-[12px] font-bold">بعدسات ضيوفكم</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2.5 mb-5 h-[220px]">
                        <div className="flex flex-col gap-2.5 w-1/2">
                          <div className="bg-gray-100 rounded-2xl w-full h-[105px] overflow-hidden relative shadow-sm border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400" alt="Wedding Cake" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl w-full h-[105px] overflow-hidden relative shadow-sm border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400" alt="Wedding Bouquet" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                          </div>
                        </div>
                        <div className="w-1/2 bg-gray-100 rounded-2xl h-full overflow-hidden relative shadow-sm border border-gray-100">
                          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400" alt="Bride and Groom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                      </div>

                      {/* Upload CTA Box */}
                      <div className="bg-[#111111] rounded-[1.5rem] p-5 text-white shadow-xl mt-auto relative overflow-hidden border border-[#C49A6C]/30">
                        {/* Decorative background glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C49A6C]/20 blur-[30px] rounded-full"></div>
                        
                        <div className="flex justify-between items-center mb-4 relative z-10">
                          <div className="w-11 h-11 bg-white/5 border border-[#C49A6C]/30 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Camera className="w-5 h-5 text-[#C49A6C]" />
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-[14px] mb-1 text-white">الضيوف يشاركون الصور</h4>
                            <p className="text-white/60 text-[10px] font-medium">عبر الرابط المباشر للألبوم</p>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <div className="w-full bg-[#C49A6C] text-white rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-md hover:bg-[#A88461] transition-colors cursor-pointer">
                            <span className="text-[12px] font-bold">نسخ رابط الألبوم</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                 )}

                 {activeFeature === 'edit' && (
                    <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="w-full h-full flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full flex items-center gap-1.5"> محفوظ تلقائياً</span>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-[#111111] text-lg">تخصيص دعوتكم</h3>
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <Sliders className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5 overflow-y-auto hide-scrollbar pb-4 flex-1">
                        <div className="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-sm flex justify-between items-center group">
                          <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </div>
                          <div className="text-right flex-1 pr-3">
                            <p className="text-[10px] text-gray-400 font-bold mb-0.5">الأسماء</p>
                            <p className="text-[13px] text-[#111111] font-black font-serif">أحمد & نور</p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-sm flex justify-between items-center group">
                          <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </div>
                          <div className="text-right flex-1 pr-3">
                            <p className="text-[10px] text-gray-400 font-bold mb-0.5">موعد المناسبة</p>
                            <p className="text-[13px] text-[#111111] font-black font-serif">الجمعة، 18 كانون الأول</p>
                          </div>
                        </div>

                        {/* Colors */}
                        <div className="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-sm">
                          <div className="flex justify-end items-center gap-2 mb-4">
                            <span className="text-[12px] font-bold text-[#111111]">لون الدعوة</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"></div>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 to-amber-500"></div>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-800"></div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9F1239] ring-2 ring-offset-2 ring-[#E11D48]"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-[11px] font-bold text-teal-500">أي تغيير يظهر للضيوف فوراً</span>
                          <div className="w-4 h-4 rounded-full bg-teal-50 flex items-center justify-center"><svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                        </div>
                      </div>
                    </motion.div>
                 )}

                 {activeFeature === 'qr' && (
                    <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-full flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black bg-blue-500 text-white px-3 py-1.5 rounded-full uppercase tracking-widest">VIP</span>
                        <h3 className="font-black text-[#111111] text-lg">بطاقة دخول الضيف</h3>
                      </div>
                      
                      <p className="text-gray-500 text-[11px] font-bold mb-1 tracking-wider">ضيفنا العزيز</p>
                      <h2 className="text-[#111111] text-3xl font-serif font-black mb-1">علي محمد</h2>
                      <p className="text-gray-400 text-[12px] font-bold mb-8">الدعوة تشمل 3 أشخاص</p>
                      
                      <div className="w-44 h-44 bg-white border border-gray-200 rounded-[2rem] p-4 flex items-center justify-center mb-8 relative">
                         <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ZARIA-VIP-ENTRY" alt="QR Code" className="w-full h-full object-contain opacity-80" />
                      </div>

                      <div className="w-full bg-blue-500 text-white rounded-[1.25rem] py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                        <span className="font-bold text-[14px]">تم التحقق</span>
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </motion.div>
                 )}

                 {activeFeature === 'guestbook' && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full h-full flex flex-col gap-5 pt-4 overflow-y-auto">
                       <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full">رسالة جديدة</span>
                        <h3 className="font-black text-[#111111] text-lg">جدار التهاني</h3>
                      </div>
                       <div className="bg-white p-4 rounded-2xl rounded-tr-none border border-gray-100 shadow-sm self-start max-w-[85%]">
                         <p className="text-sm text-[#111111] leading-relaxed font-medium">ألف مبروك لأجمل عروسين! أتمنى لكم حياة سعيدة ومليئة بالحب ❤️</p>
                       </div>
                       <div className="bg-emerald-500 p-4 rounded-2xl rounded-tl-none text-white shadow-md shadow-emerald-500/20 self-end max-w-[85%]">
                         <p className="text-sm leading-relaxed font-medium">الله يسعدكم ويتمم على خير يارب، شكراً على هالدعوة اللطيفة ✨</p>
                       </div>
                       <div className="bg-white p-4 rounded-2xl rounded-tr-none border border-gray-100 shadow-sm self-start max-w-[85%]">
                         <p className="text-sm text-[#111111] leading-relaxed font-medium">كانت ليلة من العمر 🌹</p>
                       </div>
                    </motion.div>
                 )}
                </div>
              </div>
              
              {/* Optional footer bar for the stylized container */}
              {activeFeature === 'rsvp' && (
                <div className="w-full bg-[#150F1D] py-4 px-6 flex items-center justify-between border-t border-white/5 mt-auto">
                  <div className="w-5 h-5 rounded-full border border-pink-500/50 flex items-center justify-center">
                    <svg className="w-3 h-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[11px] text-white/50 font-bold">عدد دقيق للقاعة والأكل، بلا مكالمات وتخمين.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More Features Banner (Under Main Container) */}
        <div className="mt-8 bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle Gradient Glow */}
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-48 h-48 bg-[#A88461]/10 rounded-full blur-[50px] pointer-events-none" />
          
          {/* Right side (Text + Icon) */}
          <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-4 md:gap-6 z-10 text-center md:text-right">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C49A6C] to-[#A88461] rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg text-white transform rotate-3">
              <Star className="w-7 h-7" fill="currentColor" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-[#111111] mb-2" dir="auto">{t('features.more_title')}</h3>
              <p className="text-[#444444] font-medium text-sm md:text-[15px]" dir="auto">{t('features.more_desc')}</p>
            </div>
          </div>

          {/* Left side (Pills/Tags) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-end gap-3 z-10 max-w-2xl">
            {[
              t('features.pill_share'),
              t('features.pill_calendar'),
              t('features.pill_map'),
              t('features.pill_countdown'),
              t('features.pill_custom'),
              t('features.pill_control')
            ].map((pill, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 border border-[#C49A6C]/20 shadow-sm hover:border-[#A88461]/50 transition-colors">
                <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[11px] md:text-[13px] font-bold text-[#111111]">{pill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
