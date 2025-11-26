import { useState } from 'react';

const FamilyManager = ({ families, setFamilies }) => {
  const [familyName, setFamilyName] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!familyName.trim() || !memberCount || parseInt(memberCount) <= 0) {
      alert('لطفاً نام خانواده و تعداد اعضا را به درستی وارد کنید');
      return;
    }

    if (editingId) {
      // Edit existing family
      setFamilies(families.map(f => 
        f.id === editingId 
          ? { ...f, name: familyName.trim(), members: parseInt(memberCount) }
          : f
      ));
      setEditingId(null);
    } else {
      // Add new family
      const newFamily = {
        id: Date.now(),
        name: familyName.trim(),
        members: parseInt(memberCount),
      };
      setFamilies([...families, newFamily]);
    }

    setFamilyName('');
    setMemberCount('');
  };

  const handleEdit = (family) => {
    setFamilyName(family.name);
    setMemberCount(family.members.toString());
    setEditingId(family.id);
  };

  const handleDelete = (id) => {
    if (confirm('آیا از حذف این خانواده اطمینان دارید؟')) {
      setFamilies(families.filter(f => f.id !== id));
    }
  };

  const handleCancel = () => {
    setFamilyName('');
    setMemberCount('');
    setEditingId(null);
  };

  return (
    <div className="card animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">👨‍👩‍👧‍👦</span>
        مدیریت خانواده‌ها
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="label">نام خانواده</label>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="input-field"
            placeholder="مثال: خانواده احمدی"
          />
        </div>

        <div>
          <label className="label">تعداد اعضا</label>
          <input
            type="number"
            min="1"
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value)}
            className="input-field"
            placeholder="مثال: 4"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingId ? '✏️ ویرایش خانواده' : '➕ افزودن خانواده'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              ❌ لغو
            </button>
          )}
        </div>
      </form>

      {families.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 text-lg">لیست خانواده‌ها:</h3>
          <div className="space-y-2">
            {families.map((family) => (
              <div
                key={family.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold text-gray-800">{family.name}</p>
                    <p className="text-sm text-gray-600">
                      {family.members} نفر
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(family)}
                    className="md:px-4 md:py-2 px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 active:scale-95"
                  >
                    ✏️ ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(family.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 active:scale-95"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyManager;
