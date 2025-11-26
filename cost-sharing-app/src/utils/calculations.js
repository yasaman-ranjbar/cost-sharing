/**
 * Calculate total expenses across all families
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Total amount
 */
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount || 0),
    0
  );
};

/**
 * Calculate total number of people across all families
 * @param {Array} families - Array of family objects
 * @returns {number} Total people count
 */
export const calculateTotalPeople = (families) => {
  return families.reduce(
    (sum, family) => sum + parseInt(family.members || 0, 10),
    0
  );
};

/**
 * Calculate per-person cost
 * @param {number} totalExpenses - Total expenses
 * @param {number} totalPeople - Total number of people
 * @returns {number} Cost per person
 */
export const calculatePerPersonCost = (totalExpenses, totalPeople) => {
  if (totalPeople === 0) return 0;
  return totalExpenses / totalPeople;
};

/**
 * Calculate what each family should pay based on their size
 * @param {Array} families - Array of family objects
 * @param {number} perPersonCost - Cost per person
 * @returns {Object} Map of family ID to amount they should pay
 */
export const calculateFamilyShares = (families, perPersonCost) => {
  const shares = {};
  families.forEach((family) => {
    shares[family.id] = perPersonCost * parseInt(family.members || 0, 10);
  });
  return shares;
};

/**
 * Calculate how much each family actually paid
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Map of family ID to amount they paid
 */
export const calculateFamilyPayments = (expenses) => {
  const payments = {};
  expenses.forEach((expense) => {
    const familyId = expense.familyId;
    payments[familyId] =
      (payments[familyId] || 0) + parseFloat(expense.amount || 0);
  });
  return payments;
};

/**
 * Calculate settlement amounts (difference between paid and owed)
 * @param {Array} families - Array of family objects
 * @param {Object} familyShares - Map of family ID to what they should pay
 * @param {Object} familyPayments - Map of family ID to what they paid
 * @returns {Array} Array of settlement objects with family info and balance
 */
export const calculateSettlements = (
  families,
  familyShares,
  familyPayments
) => {
  return families.map((family) => {
    const shouldPay = familyShares[family.id] || 0;
    const actuallyPaid = familyPayments[family.id] || 0;
    const balance = actuallyPaid - shouldPay; // Positive means they overpaid, negative means they owe

    return {
      familyId: family.id,
      familyName: family.name,
      members: family.members,
      shouldPay,
      actuallyPaid,
      balance,
    };
  });
};

/**
 * Calculate detailed breakdown of what each family should pay for each expense
 * @param {Array} families - Array of family objects
 * @param {Array} expenses - Array of expense objects
 * @param {number} totalPeople - Total number of people
 * @returns {Array} Array of expense breakdowns
 */
export const calculateExpenseBreakdown = (families, expenses, totalPeople) => {
  if (totalPeople === 0) return [];

  return expenses.map((expense) => {
    const perPersonCost = parseFloat(expense.amount || 0) / totalPeople;
    const familyShares = {};

    families.forEach((family) => {
      familyShares[family.id] = {
        familyName: family.name,
        share: perPersonCost * parseInt(family.members || 0, 10),
      };
    });

    return {
      expenseId: expense.id,
      item: expense.item,
      paidBy: expense.familyName,
      totalAmount: parseFloat(expense.amount || 0),
      familyShares,
    };
  });
};
