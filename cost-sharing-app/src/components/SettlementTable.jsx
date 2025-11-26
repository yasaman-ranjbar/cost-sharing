import { formatToman } from '../utils/formatters';
import {
  calculateTotalExpenses,
  calculateTotalPeople,
  calculatePerPersonCost,
  calculateFamilyShares,
  calculateFamilyPayments,
  calculateSettlements,
  calculateExpenseBreakdown,
} from '../utils/calculations';

const SettlementTable = ({ families, expenses }) => {
  if (families.length === 0 || expenses.length === 0) {
    return null;
  }

  const totalExpenses = calculateTotalExpenses(expenses);
  const totalPeople = calculateTotalPeople(families);
  const perPersonCost = calculatePerPersonCost(totalExpenses, totalPeople);
  const familyShares = calculateFamilyShares(families, perPersonCost);
  const familyPayments = calculateFamilyPayments(expenses);
  const settlements = calculateSettlements(families, familyShares, familyPayments);
  const expenseBreakdown = calculateExpenseBreakdown(families, expenses, totalPeople);

  return (
    <div className="space-y-6">

      {/* Settlement Table */}
      <div className="card animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-3xl">💳</span>
          تسویه حساب
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-header">
                <th className="table-cell text-right rounded-tr-xl">خانواده</th>
                <th className="table-cell text-center">تعداد افراد</th>
                <th className="table-cell text-left">پرداخت شده</th>
                <th className="table-cell text-left">باید پرداخت کند</th>
                <th className="table-cell text-left rounded-tl-xl">تسویه</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {settlements.map((settlement) => (
                <tr key={settlement.familyId} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="table-cell text-right font-semibold text-gray-800">
                    {settlement.familyName}
                  </td>
                  <td className="table-cell text-center text-gray-600">
                    {settlement.members} نفر
                  </td>
                  <td className="table-cell text-left font-medium text-gray-700">
                    {formatToman(settlement.actuallyPaid)}
                  </td>
                  <td className="table-cell text-left font-medium text-gray-700">
                    {formatToman(settlement.shouldPay)}
                  </td>
                  <td className="table-cell text-left font-bold">
                    {settlement.balance > 0 ? (
                      <span className="text-balance-positive flex items-center justify-end gap-1">
                        <span>⬆️</span>
                        {formatToman(settlement.balance)} بستانکار
                      </span>
                    ) : settlement.balance < 0 ? (
                      <span className="text-balance-negative flex items-center justify-end gap-1">
                        <span>⬇️</span>
                        {formatToman(Math.abs(settlement.balance))} بدهکار
                      </span>
                    ) : (
                      <span className="text-gray-500">تسویه شده ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Settlement Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span>
            راهنمای تسویه:
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            {settlements
              .filter(s => s.balance < 0)
              .map(debtor => {
                const creditors = settlements.filter(s => s.balance > 0);
                if (creditors.length === 0) return null;
                
                return (
                  <p key={debtor.familyId} className="flex items-center gap-2">
                    <span className="font-semibold text-red-600">{debtor.familyName}</span>
                    باید
                    <span className="font-bold text-gray-800">{formatToman(Math.abs(debtor.balance))}</span>
                    به
                    <span className="font-semibold text-green-600">
                      {creditors.map(c => c.familyName).join(' یا ')}
                    </span>
                    پرداخت کند
                  </p>
                );
              })}
          </div>
        </div>
      </div>

      {/* Expense Breakdown by Family */}
      <div className="card animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-3xl">🧾</span>
          جزئیات سهم هر خانواده از هزینه‌ها
        </h2>

        <div className="space-y-4">
          {expenseBreakdown.map((breakdown) => (
            <div
              key={breakdown.expenseId}
              className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{breakdown.item}</h3>
                  <p className="text-sm text-gray-600">
                    پرداخت‌کننده: {breakdown.paidBy}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">مبلغ کل</p>
                  <p className="font-bold text-primary-600">{formatToman(breakdown.totalAmount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.values(breakdown.familyShares).map((share) => (
                  <div
                    key={share.familyName}
                    className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200"
                  >
                    <span className="text-sm font-medium text-gray-700">{share.familyName}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {formatToman(share.share)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettlementTable;
