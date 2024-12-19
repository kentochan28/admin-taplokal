"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SalesBarChart from "../components/SalesBarChart";
import SalesSummary from "../components/SalesSummary";
import SalesDetails from "../components/SalesDetails";
import SalesToday from "../components/SalesToday";
import { SaleProps } from "../Types";
import { UserOptions } from "jspdf-autotable"; // Import UserOptions directly

// Extend jsPDF to include the autoTable method with the correct type
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

const Sales = () => {
  const [sales, setSales] = useState<SaleProps>({
    yesterdaySales: 0,
    todaySales: 0,
    yesterdayOrders: 0,
    todayOrders: 0,
    yesterdayProductsSold: 0,
    todayProductsSold: 0,
    lastWeekSales: 0,
    thisWeekSales: 0,
    lastMonthSales: 0,
    thisMonthSales: 0,
    lastYearSales: 0,
    thisYearSales: 0,
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  // Function to generate report for each period
  const generateReportForPeriod = (period: string) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);

    const getValue = (value: number | undefined | null): string => {
      return value !== undefined && value !== null ? String(value) : "-";
    };

    let bodyContent: string[][];
    switch (period) {
      case "Daily":
        bodyContent = [
          ["Today", getValue(sales.todaySales)],
          ["Yesterday", getValue(sales.yesterdaySales)],
        ];
        break;
      case "Weekly":
        bodyContent = [
          ["This Week", getValue(sales.thisWeekSales)],
          ["Last Week", getValue(sales.lastWeekSales)],
        ];
        break;
      case "Monthly":
        bodyContent = [
          ["This Month", getValue(sales.thisMonthSales)],
          ["Last Month", getValue(sales.lastMonthSales)],
        ];
        break;
      case "Yearly":
        bodyContent = [
          ["This Year", getValue(sales.thisYearSales)],
          ["Last Year", getValue(sales.lastYearSales)],
        ];
        break;
      case "Overall":
        bodyContent = [["Overall Sales", getValue(sales.totalSales)]];
        break;
      default:
        bodyContent = [["-", "-"]];
    }
    doc.autoTable({
      head: [["Period", "Total Sales"]],
      body: bodyContent,
      startY: 60,
      styles: {
        font: "helvetica",
        fontSize: 12,
        lineColor: [200, 200, 200], // Subtle platinum lines
        lineWidth: 0.5,
        fillColor: [255, 255, 255], // Pristine white background for cells
        textColor: [70, 70, 70], // Neutral graphite text for readability
        halign: "center", // Harmonized center alignment
        valign: "middle", // Vertical centering for aesthetic perfection
        cellPadding: { top: 8, right: 14, bottom: 8, left: 14 }, // Luxurious spacing
        fontStyle: "normal",
        overflow: "linebreak", // Effortlessly handles longer text
      },
      headStyles: {
        fillColor: [20, 90, 150], // Deep celestial blue for headers
        textColor: [255, 255, 255], // Ethereal white header text
        fontStyle: "bold", // Bold headers for emphasis
        lineWidth: 1, // Strong header lines
        lineColor: [20, 90, 150], // Matching header border color
      },
      alternateRowStyles: {
        fillColor: [240, 245, 250], // Whisper-light blue for alternate rows
      },
      columnStyles: {
        0: { halign: "left", fillColor: [250, 250, 255] }, // Gentle frost on left column
        1: { halign: "right", fillColor: [245, 250, 255] }, // Subtle shimmer on right column
      },
      margin: { top: 60, left: 30, right: 30 }, // Spacious margins for heavenly balance
      tableWidth: "wrap", // Adjusts perfectly to content size
      didDrawPage: (data) => {
        // Divine Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(20, 90, 150);
        doc.text("Sales Report", data.settings.margin.left, 40);

        // Subtle Header Line
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setDrawColor(200, 200, 200); // Light gray line
        doc.setLineWidth(0.5);
        doc.line(
          data.settings.margin.left,
          45,
          pageWidth - data.settings.margin.right,
          45
        );

        // Footer of Perfection
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        const pageHeight = doc.internal.pageSize.getHeight();

        // Manually calculate current page and total pages
        const currentPage =
          doc.internal.pages.indexOf(
            doc.internal.pages[doc.internal.pages.length - 1]
          ) + 1;
        const totalPages = doc.internal.pages.length - 1;

        doc.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${currentPage} of ${totalPages}`,
          pageWidth - 120,
          pageHeight - 15
        );
      },
    });

    doc.save(`${period.toLowerCase()}_sales_report.pdf`);
  };

  // Function to generate report for orders and products sold
  const generateReportForOrderAndProduct = (period: string) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);

    const getValue = (value: number | undefined | null): string => {
      return value !== undefined && value !== null ? String(value) : "-";
    };

    const bodyContent: string[][] = [
      ["Total Orders", getValue(sales.totalOrders)],
      ["Total Products Sold", getValue(sales.totalProducts)],
    ];

    doc.autoTable({
      head: [["Category", "Total"]],
      body: bodyContent,
      startY: 40,
      styles: {
        font: "helvetica",
        fontSize: 12,
        lineColor: [200, 200, 200], // Subtle platinum lines
        lineWidth: 0.5,
        fillColor: [255, 255, 255], // Pristine white background for cells
        textColor: [70, 70, 70], // Neutral graphite text for readability
        halign: "center", // Harmonized center alignment
        valign: "middle", // Vertical centering for aesthetic perfection
        cellPadding: { top: 8, right: 14, bottom: 8, left: 14 }, // Luxurious spacing
        fontStyle: "normal",
        overflow: "linebreak", // Effortlessly handles longer text
      },
      headStyles: {
        fillColor: [20, 90, 150], // Deep celestial blue for headers
        textColor: [255, 255, 255], // Ethereal white header text
        fontStyle: "bold", // Bold headers for emphasis
        lineWidth: 1, // Strong header lines
        lineColor: [20, 90, 150], // Matching header border color
      },
      alternateRowStyles: {
        fillColor: [240, 245, 250], // Whisper-light blue for alternate rows
      },
      columnStyles: {
        0: { halign: "left", fillColor: [250, 250, 255] }, // Gentle frost on left column
        1: { halign: "right", fillColor: [245, 250, 255] }, // Subtle shimmer on right column
      },
      margin: { top: 40, left: 30, right: 30 }, // Spacious margins for heavenly balance
      tableWidth: "wrap", // Adjusts perfectly to content size
      didDrawPage: (data) => {
        // Divine Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(20, 90, 150);
        doc.text(
          "Report for total orders and product sold",
          data.settings.margin.left,
          30
        );

        // Subtle Header Line
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setDrawColor(200, 200, 200); // Light gray line
        doc.setLineWidth(0.5);
        doc.line(
          data.settings.margin.left,
          35,
          pageWidth - data.settings.margin.right,
          35
        );

        // Footer of Perfection
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        const pageHeight = doc.internal.pageSize.getHeight();

        // Manually calculate current page and total pages
        const currentPage =
          doc.internal.pages.indexOf(
            doc.internal.pages[doc.internal.pages.length - 1]
          ) + 1;
        const totalPages = doc.internal.pages.length - 1;

        doc.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${currentPage} of ${totalPages}`,
          pageWidth - 120,
          pageHeight - 15
        );
      },
    });

    doc.save(`${period.toLowerCase()}_orders_products_report.pdf`);
  };

  return (
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Buttons Section */}
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Generate Sales Report
          </h2>
          {["Overall", "Daily", "Weekly", "Monthly", "Yearly"].map(
            (period, index) => (
              <button
                key={index}
                onClick={() => generateReportForPeriod(period)}
                className="py-3 px-6 rounded-full w-full sm:w-auto transition-transform transform hover:scale-105 text-white font-medium shadow-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`${period} Sales Report`}
              >
                {period} Sales
              </button>
            )
          )}
          <button
            onClick={() =>
              generateReportForOrderAndProduct("Orders and Products")
            }
            className="py-3 px-6 rounded-full w-full sm:w-auto transition-transform transform hover:scale-105 text-white font-medium shadow-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Orders and Products Report"
          >
            Orders and Products
          </button>
        </div>

        {/* Sales Overview Section */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Daily Sales
            </h2>
            <SalesToday sales={sales} />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center border border-gray-200">
            <SalesSummary sales={sales} />
          </div>
        </div>

        {/* Sales Details Section */}
        <div className="col-span-1 lg:col-span-3 bg-white shadow-lg rounded-3xl p-6 flex flex-col gap-4 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sales Details
          </h2>
          <SalesDetails sales={sales} />
        </div>

        {/* Sales Chart Section */}
        <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Sales Overview
          </h2>
          <div className="w-full max-w-5xl">
            <SalesBarChart setSales={setSales} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
