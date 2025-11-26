import { formatToman } from '../utils/formatters';
import { calculateTotalExpenses } from '../utils/calculations';

const ExpenseList = ({ expenses }) => {
  if (expenses.length === 0) {
    return null;
  }

  const totalExpenses = calculateTotalExpenses(expenses);

  return (
    <div className="card animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">📋</span>
        لیست هزینه‌ها
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header">
              <th className="table-cell text-right rounded-tr-xl">ردیف</th>
              <th className="table-cell text-right">کالا / خدمت</th>
              <th className="table-cell text-right">پرداخت‌کننده</th>
              <th className="table-cell text-left rounded-tl-xl">مبلغ</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {expenses.map((expense, index) => (
              <tr key={expense.id} className="hover:bg-blue-50 transition-colors duration-150">
                <td className="table-cell text-right font-medium text-gray-700">
                  {index + 1}
                </td>
                <td className="table-cell text-right font-semibold text-gray-800">
                  {expense.item}
                </td>
                <td className="table-cell text-right text-gray-600">
                  {expense.familyName}
                </td>
                <td className="table-cell text-left font-semibold text-green-600">
                  {formatToman(expense.amount)}
                </td>
              </tr>
            ))}
            <tr className="bg-gradient-to-r from-primary-50 to-purple-50 font-bold">
              <td colSpan="3" className="table-cell text-right text-lg">
                جمع کل هزینه‌ها:
              </td>
              <td className="table-cell text-left text-lg text-primary-700">
                {formatToman(totalExpenses)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
