import { useState } from 'react';
import { formatToman } from '../utils/formatters';

const ExpenseManager = ({ families, expenses, setExpenses }) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    const number = value.replace(/,/g, '');
    if (!/^\d*$/.test(number)) return displayAmount;
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/,/g, '');
    
    if (numericValue === '' || /^\d+$/.test(numericValue)) {
      setAmount(numericValue);
      setDisplayAmount(formatNumberWithCommas(numericValue));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFamilyId || !itemName.trim() || !amount || parseFloat(amount) <= 0) {
      alert('لطفاً تمام فیلدها را به درستی پر کنید');
      return;
    }

    const family = families.find(f => f.id === parseInt(selectedFamilyId));
    if (!family) {
      alert('خانواده انتخاب شده یافت نشد');
      return;
    }

    if (editingId) {
      // Edit existing expense
      setExpenses(expenses.map(exp =>
        exp.id === editingId
          ? {
              ...exp,
              familyId: parseInt(selectedFamilyId),
              familyName: family.name,
              item: itemName.trim(),
              amount: parseFloat(amount),
            }
          : exp
      ));
      setEditingId(null);
    } else {
      // Add new expense
      const newExpense = {
        id: Date.now(),
        familyId: parseInt(selectedFamilyId),
        familyName: family.name,
        item: itemName.trim(),
        amount: parseFloat(amount),
      };
      setExpenses([...expenses, newExpense]);
    }

    setSelectedFamilyId('');
    setItemName('');
    setAmount('');
    setDisplayAmount('');
  };

  const handleEdit = (expense) => {
    setSelectedFamilyId(expense.familyId.toString());
    setItemName(expense.item);
    const amountStr = expense.amount.toString();
    setAmount(amountStr);
    setDisplayAmount(formatNumberWithCommas(amountStr));
    setEditingId(expense.id);
  };

  const handleDelete = (id) => {
    if (confirm('آیا از حذف این هزینه اطمینان دارید؟')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleCancel = () => {
    setSelectedFamilyId('');
    setItemName('');
    setAmount('');
    setDisplayAmount('');
    setEditingId(null);
  };

  if (families.length === 0) {
    return (
      <div className="card animate-slide-up">
        <div className="text-center py-8">
          <span className="text-6xl mb-4 block">📝</span>
          <p className="text-gray-600 text-lg">
            ابتدا باید حداقل یک خانواده اضافه کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">💰</span>
        ثبت هزینه‌ها
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="label">خانواده پرداخت‌کننده</label>
          <select
            value={selectedFamilyId}
            onChange={(e) => setSelectedFamilyId(e.target.value)}
            className="input-field"
          >
            <option value="">انتخاب کنید...</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name} ({family.members} نفر)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">نام کالا / خدمت</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="input-field"
            placeholder="مثال: قهوه"
          />
        </div>

        <div>
          <label className="label">مبلغ (تومان)</label>
          <input
            type="text"
            value={displayAmount}
            onChange={handleAmountChange}
            className="input-field"
            placeholder="مثال: 50,000"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingId ? '✏️ ویرایش هزینه' : '➕ افزودن هزینه'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              ❌ لغو
            </button>
          )}
        </div>
      </form>

      {expenses.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 text-lg">هزینه‌های ثبت شده:</h3>
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛒</span>
                  <div>
                    <p className="font-semibold text-gray-800">{expense.item}</p>
                    <p className="text-sm text-gray-600">
                      پرداخت‌کننده: {expense.familyName}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {formatToman(expense.amount)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-300 transition-all duration-200 active:scale-95"
                  >
                    ✏️ ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
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

export default ExpenseManager;
