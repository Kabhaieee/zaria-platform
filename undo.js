const fs = require('fs');

const featuresPath = 'c:\\Users\\aliKa\\Desktop\\zaria-platform\\src\\components\\Features.jsx';
let content = fs.readFileSync(featuresPath, 'utf8');

const replacements = [
  {
    target: `                            {/* 1 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white/80" />
                              </div>
                              <span className="text-white/80 text-sm font-medium">{t('features.mock_rsvp_attend')}</span>
                            </div>
                            {/* 2 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-white/80 font-bold text-lg">X</span>
                              </div>
                              <span className="text-white/80 text-sm font-medium">{t('features.mock_rsvp_decline')}</span>
                            </div>
                          </div>
                          
                          {/* Companion Counter */}
                          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-8">
                            <span className="text-white/80 text-sm font-medium">{t('features.mock_rsvp_companions')}</span>
                            <div className="flex items-center gap-4 bg-white/5 rounded-lg px-3 py-1">
                              <span className="text-white/50 text-lg cursor-pointer hover:text-white">-</span>
                              <span className="text-white font-bold">2</span>
                              <span className="text-[#C49A6C] text-lg cursor-pointer hover:text-white">+</span>
                            </div>
                          </div>
                          
                          {/* Submit Button */}
                          <button className="w-full bg-[#E11D48] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#E11D48]/20 transition-transform hover:scale-[1.02]">
                            {t('features.mock_rsvp_submit')}
                          </button>`,
    original: `                      <div className="flex justify-between items-center mb-6">
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
                              <div className={\`w-9 h-9 rounded-[0.85rem] \${guest.color} flex items-center justify-center font-bold text-sm shadow-inner\`}>{guest.initial}</div>
                            </div>
                          </div>
                        ))}
                      </div>`
  },
  {
    target: `                          <h5 className="text-white/90 font-medium mb-6 text-center">{t('features.mock_music_control')}</h5>
                          
                          {/* Music Tracks */}
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center bg-white/5 border border-[#8B5CF6]/40 p-4 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                                  <Music className="w-4 h-4 text-[#8B5CF6]" />
                                </div>
                                <span className="text-white font-medium text-sm">{t('features.mock_music_zaffa')}</span>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl opacity-60">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                  <Music className="w-4 h-4 text-white/50" />
                                </div>
                                <span className="text-white font-medium text-sm">{t('features.mock_music_soft')}</span>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-white/20"></div>
                            </div>
                          </div>

                          {/* Autoplay Toggle */}
                          <div className="mt-8 flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                            <span className="text-white/80 text-sm font-medium">{t('features.mock_music_auto')}</span>
                            <div className="w-12 h-6 bg-[#8B5CF6] rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>`,
    original: `                       <div className="flex justify-between items-center mb-6">
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full">تشغيل تلقائي</span>
                        <h3 className="font-black text-[#111111] text-lg">الموسيقى</h3>
                       </div>
                       
                       <div className="flex-1 flex flex-col items-center justify-center">
                         <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mb-8 shadow-xl shadow-purple-500/30">
                           <Music className="w-12 h-12 text-white" />
                         </div>
                         <h2 className="text-2xl font-black text-[#111111] mb-2">زفة لدخول العروس</h2>
                         <p className="text-gray-500 font-medium text-sm mb-8">الزفة الملكية</p>
                         
                         <div className="w-full max-w-[80%] mx-auto">
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                              <span>0:45</span>
                              <span>3:12</span>
                            </div>
                         </div>
                       </div>`
  },
  {
    target: `                          {/* Upload Area */}
                          <div className="border-2 border-dashed border-[#0EA5E9]/50 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 mb-6 bg-[#0EA5E9]/5 cursor-pointer">
                            <Camera className="w-8 h-8 text-[#0EA5E9]" />
                            <span className="text-[#0EA5E9] font-medium text-sm">{t('features.mock_album_add')}</span>
                          </div>

                          {/* Gallery Grid */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-white/80 text-sm font-medium">{t('features.mock_album_event')}</span>
                            <span className="text-white/40 text-xs">124 صورة</span>
                          </div>`,
    original: `                      <div className="flex justify-between items-start mb-5">
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full mt-1">47 صورة</span>
                        <div className="text-right">
                          <h3 className="font-serif font-black text-[#111111] text-xl leading-tight mb-1">ألبوم فرحتكم</h3>
                          <p className="text-gray-500 text-[12px] font-bold">بعدسات ضيوفكم</p>
                        </div>
                      </div>
                      
                      {/* Masonry Grid */}
                      <div className="flex gap-2.5 mb-5 h-[220px]">
                        <div className="flex flex-col gap-2.5 w-1/2">
                          <div className="bg-gray-200 rounded-2xl w-full h-[105px] overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80" alt="Wedding Rings" className="w-full h-full object-cover" />
                          </div>
                          <div className="bg-gray-200 rounded-2xl w-full h-[105px] overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80" alt="Wedding Candles" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="w-1/2 bg-gray-200 rounded-2xl h-full overflow-hidden relative">
                          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" alt="Wedding Flowers" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Upload CTA Box */}
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[1.5rem] p-5 text-white shadow-lg mt-auto relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 relative z-10">
                          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-[14px] mb-1">كل ضيف يرفع صوره بنفسه</h4>
                            <p className="text-white/90 text-[10px] font-medium">يمسح الكود بالمناسبة ويفتح الألبوم</p>
                          </div>
                        </div>
                        <div className="flex gap-2.5 relative z-10">
                          <div className="flex-1 bg-white/10 rounded-xl py-2 flex items-center justify-center gap-1.5 backdrop-blur-md">
                            <span className="text-[10px] font-bold">رابط الدعوة</span>
                          </div>
                          <div className="flex-1 bg-white/10 rounded-xl py-2 flex items-center justify-center gap-1.5 backdrop-blur-md">
                            <span className="text-[10px] font-bold">QR مباشر</span>
                            <QrCode className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>`
  },
  {
    target: `                          {/* Editor Panel */}
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-white font-medium text-sm">{t('features.mock_edit_custom')}</span>
                              <Sliders className="w-4 h-4 text-white/50" />
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"></div>
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 to-amber-500"></div>
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-800"></div>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9F1239] ring-2 ring-offset-2 ring-[#E11D48]"></div>
                            </div>
                          </div>`,
    original: `                      <div className="flex justify-between items-center mb-6">
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
                      </div>`
  },
  {
    target: `                            <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* 1 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white/80" />
                              </div>
                              <span className="text-white/80 text-sm font-medium">{t('features.mock_rsvp_attend')}</span>
                            </div>
                            {/* 2 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-white/80 font-bold text-lg">X</span>
                              </div>
                              <span className="text-white/80 text-sm font-medium">{t('features.mock_rsvp_decline')}</span>
                            </div>
                          </div>
                          
                          {/* Companion Counter */}
                          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-8">
                            <span className="text-white/80 text-sm font-medium">{t('features.mock_rsvp_companions')}</span>
                            <div className="flex items-center gap-4 bg-white/5 rounded-lg px-3 py-1">
                              <span className="text-white/50 text-lg cursor-pointer hover:text-white">-</span>
                              <span className="text-white font-bold">2</span>
                              <span className="text-[#C49A6C] text-lg cursor-pointer hover:text-white">+</span>
                            </div>
                          </div>
                          
                          {/* Submit Button */}
                          <button className="w-full bg-[#E11D48] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#E11D48]/20 transition-transform hover:scale-[1.02]">
                            {t('features.mock_rsvp_submit')}
                          </button>`,
    original: `                      <div className="flex justify-between items-center mb-6">
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
                              <div className={\`w-9 h-9 rounded-[0.85rem] \${guest.color} flex items-center justify-center font-bold text-sm shadow-inner\`}>{guest.initial}</div>
                            </div>
                          </div>
                        ))}
                      </div>`
  }
];

// Clean up some bad wrapper formatting that the tool injected:
content = content.replace(/className="w-full h-full flex flex-col text-white">/g, 'className="w-full h-full flex flex-col">');
content = content.replace(/<h5 className="text-white\/90 font-medium mt-6 mb-2">\{t\('features\.mock_qr_scan'\)\}<\/h5>/g, '');

for (const rep of replacements) {
  content = content.replace(rep.target, rep.original);
}

fs.writeFileSync(featuresPath, content);
console.log('Restored content');
