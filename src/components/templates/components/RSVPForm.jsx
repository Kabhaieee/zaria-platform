'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function RSVPForm({ whatsappNumber }) {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    status: 'attending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct the WhatsApp message
    const statusText = formData.status === 'attending' ? 'يسعدني تلبية دعوتكم وحضور الحفل' : 'أعتذر عن الحضور، وأتمنى لكم السعادة';
    const guestsText = formData.status === 'attending' ? `\nعدد الحضور: ${formData.guests}` : '';
    
    const message = `مرحباً،\nأنا ${formData.name}\n${statusText}${guestsText}`;
    
    // Encode the message for the URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
      <div className="mb-6">
        <label className="block text-white/80 mb-2 text-sm">الاسم الكريم</label>
        <input 
          type="text" 
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C] transition-colors"
          placeholder="أدخل اسمك هنا..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-white/80 mb-2 text-sm">تأكيد الحضور</label>
        <div className="flex gap-4">
          <label className={`flex-1 cursor-pointer rounded-xl border ${formData.status === 'attending' ? 'border-[#C49A6C] bg-[#C49A6C]/10 text-[#C49A6C]' : 'border-white/20 bg-black/40 text-white/60'} py-3 text-center transition-colors`}>
            <input 
              type="radio" 
              name="status" 
              value="attending" 
              checked={formData.status === 'attending'}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="hidden" 
            />
            سأحضر بالتأكيد
          </label>
          <label className={`flex-1 cursor-pointer rounded-xl border ${formData.status === 'not_attending' ? 'border-red-400/50 bg-red-400/10 text-red-400' : 'border-white/20 bg-black/40 text-white/60'} py-3 text-center transition-colors`}>
            <input 
              type="radio" 
              name="status" 
              value="not_attending" 
              checked={formData.status === 'not_attending'}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="hidden" 
            />
            أعتذر عن الحضور
          </label>
        </div>
      </div>

      <AnimateHeight isVisible={formData.status === 'attending'}>
        <div className="mb-8">
          <label className="block text-white/80 mb-2 text-sm">عدد الأشخاص</label>
          <select 
            value={formData.guests}
            onChange={(e) => setFormData({...formData, guests: e.target.value})}
            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C] transition-colors appearance-none"
          >
            <option value="1">شخص واحد</option>
            <option value="2">شخصين</option>
            <option value="3">3 أشخاص</option>
            <option value="4">4 أشخاص</option>
            <option value="5">5 أشخاص</option>
          </select>
        </div>
      </AnimateHeight>

      <button 
        type="submit"
        className="w-full bg-gradient-to-r from-[#C49A6C] to-[#A88C78] text-black font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
      >
        <Send className="w-5 h-5" />
        إرسال الرد عبر واتساب
      </button>
    </form>
  );
}

// Simple helper component to animate the guests dropdown
function AnimateHeight({ isVisible, children }) {
  if (!isVisible) return null;
  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
      {children}
    </div>
  );
}
