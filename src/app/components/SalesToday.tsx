import { SaleProps } from "../Types";

const SalesToday = ({ sales }: { sales: SaleProps }) => {
  const {
    todaySales,
    yesterdaySales,
    todayOrders,
    yesterdayOrders,
    todayProductsSold,
    yesterdayProductsSold,
  } = sales;

  const renderGridItem = (
    value: number,
    label: string,
    yesterdayValue: number | null
  ) => {
    const percentageChange = yesterdayValue
      ? `${(
          ((value - yesterdayValue) / Math.abs(yesterdayValue)) *
          100
        ).toFixed(0)}% from yesterday`
      : "No sales data for yesterday";
    return (
      <div className="bg-white rounded-2xl p-2 mt-2">
        <h1 className="font-bold text-base">₱{value.toLocaleString()}.00</h1>
        <h2 className="font-semibold text-sm">{label}</h2>
        <p className="text-xs">{percentageChange}</p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {renderGridItem(todaySales, "Total Sales", yesterdaySales)}
      {renderGridItem(todayOrders, "Total Orders", yesterdayOrders)}
      {renderGridItem(todayProductsSold, "Product Sold", yesterdayProductsSold)}
    </div>
  );
};

export default SalesToday;
