// src/components/GroupSummary.jsx
import React from "react";
import { useSelector } from "react-redux";

const GroupSummary = () => {
  const { groupInfo, expenses } = useSelector(state => state.groupExpense);
  if (!groupInfo) return null;

  const memberCount = groupInfo.members.length;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = memberCount ? (total / memberCount).toFixed(2) : 0;

  // Compute net balances
  const balances = groupInfo.members.map(member => {
    const paid = expenses
      .filter(e => e.paidBy === member._id)
      .reduce((s, e) => s + e.amount, 0);
    const balance = (paid - perPerson).toFixed(2);
    return { name: member.name, balance };
  });

  return (
    <div className="border p-4 rounded-lg mb-6">
      <p>Total Expenses: ₹{total}</p>
      <p>Per Person: ₹{perPerson}</p>
      <div className="mt-2">
        <p className="font-medium">Balances:</p>
        {balances.map(b => (
          <p key={b.name}>
            {b.name}:{" "}
            <span className={b.balance >= 0 ? "text-green-600" : "text-red-600"}>
              {b.balance >= 0 ? "+" : ""}
              ₹{b.balance}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default GroupSummary;
