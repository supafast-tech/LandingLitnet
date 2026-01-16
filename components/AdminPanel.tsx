import { useState, useEffect } from 'react';
import { Save, LogOut, Calendar } from 'lucide-react';
import { Gift } from '../types/gift';
import { getGifts, saveGifts } from '../utils/gifts';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    setGifts(getGifts());
  }, []);
  
  const handleSave = (gift: Gift) => {
    const updatedGifts = gifts.map(g => g.id === gift.id ? gift : g);
    setGifts(updatedGifts);
    saveGifts(updatedGifts);
    setEditingGift(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const formatDateForInput = (dateStr: string) => {
    return dateStr;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h1 className="text-2xl">Админ-панель</h1>
              <p className="text-sm text-blue-200">Управление адвент-календарем</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/advent"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/advent');
                window.location.reload();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              К календарю
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Выход
            </button>
          </div>
        </div>
      </div>
      
      {/* Success message */}
      {saveSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right">
          ✓ Изменения сохранены
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid gap-4">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {editingGift?.id === gift.id ? (
                // Edit mode
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Дата</label>
                      <input
                        type="date"
                        value={formatDateForInput(editingGift.date)}
                        onChange={(e) => setEditingGift({ ...editingGift, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Статус</label>
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={editingGift.enabled}
                          onChange={(e) => setEditingGift({ ...editingGift, enabled: e.target.checked })}
                          className="w-5 h-5"
                        />
                        <span>Подарок активен</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">Заголовок</label>
                    <input
                      type="text"
                      value={editingGift.title}
                      onChange={(e) => setEditingGift({ ...editingGift, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">Описание</label>
                    <textarea
                      value={editingGift.description}
                      onChange={(e) => setEditingGift({ ...editingGift, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Промокод</label>
                      <input
                        type="text"
                        value={editingGift.promoCode}
                        onChange={(e) => setEditingGift({ ...editingGift, promoCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Ссылка кнопки</label>
                      <input
                        type="url"
                        value={editingGift.buttonLink}
                        onChange={(e) => setEditingGift({ ...editingGift, buttonLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(editingGift)}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditingGift(null)}
                      className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="p-6 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {new Date(gift.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </span>
                      {gift.enabled ? (
                        <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          Активен
                        </span>
                      ) : (
                        <span className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded-full">
                          Отключен
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg mb-1 text-gray-900">{gift.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{gift.description}</p>
                    <p className="text-sm text-gray-500">
                      Промокод: <span className="text-blue-600">{gift.promoCode}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingGift(gift)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Редактировать
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
