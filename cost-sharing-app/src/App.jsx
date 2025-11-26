import { useState, useEffect } from 'react';
import FamilyManager from './components/FamilyManager';
import ExpenseManager from './components/ExpenseManager';
import ExpenseList from './components/ExpenseList';
import SettlementTable from './components/SettlementTable';
import './index.css';

const STORAGE_KEYS = {
  FAMILIES: 'cost-sharing-families',
  EXPENSES: 'cost-sharing-expenses',
};

function App() {
  // Load initial data from localStorage
  const [families, setFamilies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAMILIES);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : [];
  });

  // Save families to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(families));
  }, [families]);

  // Save expenses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="md:text-5xl text-3xl font-bold text-primary-600 mb-3">
            💰 محاسبه‌گر هزینه‌های دوره همی
          </h1>
          <p className="text-gray-600 text-lg">
            تقسیم عادلانه هزینه‌ها بین خانواده‌ها بر اساس تعداد افراد
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Family Management */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full font-bold text-lg">
                1
              </span>
              <h2 className="text-2xl font-bold text-gray-800">افزودن خانواده‌ها</h2>
            </div>
            <FamilyManager families={families} setFamilies={setFamilies} />
          </section>

          {/* Step 2: Expense Management */}
          {families.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full font-bold text-lg">
                  2
                </span>
                <h2 className="text-2xl font-bold text-gray-800">ثبت هزینه‌ها</h2>
              </div>
              <ExpenseManager
                families={families}
                expenses={expenses}
                setExpenses={setExpenses}
              />
            </section>
          )}

          {/* Step 3: Expense List */}
          {expenses.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full font-bold text-lg">
                  3
                </span>
                <h2 className="text-2xl font-bold text-gray-800">مشاهده لیست هزینه‌ها</h2>
              </div>
              <ExpenseList expenses={expenses} />
            </section>
          )}

          {/* Step 4: Settlement Calculations */}
          {families.length > 0 && expenses.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full font-bold text-lg">
                  4
                </span>
                <h2 className="text-2xl font-bold text-gray-800">محاسبات و تسویه حساب</h2>
              </div>
              <SettlementTable families={families} expenses={expenses} />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>ساخته شده با ❤️ برای تسهیل تقسیم هزینه‌های گردهمایی‌های خانوادگی</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
