//@ts-nocheck
import  { useRef } from "react";
import jsPDF from "jspdf";
import { useFirebase } from "@/Services/context";
import html2canvas from "html2canvas-pro";

const OrderPdfToDownload = ({ order }: { order: any }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { setting } = useFirebase();

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save(`Order_${order.orderId || "Invoice"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  if (!setting) return null;

  const totalAmount = (order.totalAmount || 0) + (order.packingCharge || 0);
  const totalQty =
    order.billProductList?.reduce(
      (acc: number, item: any) => acc + Number(item.qty || 0),
      0
    ) || 0;
  const totalProductAmount =
    order.billProductList?.reduce(
      (acc: number, item: any) =>
        acc + Number(item.qty || 0) * Number(item.salesPrice || 0),
      0
    ) || 0;

  return (
    <div>
      <button
        onClick={handleDownloadPDF}

      >
        Download PDF
      </button>

      <div
        ref={printRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "800px",
          background: "#fff",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          color: "#000",
        }}
        className="w-full"
      >
        {/* Header */}
        <div >
             <div  className="flex items-center justify-center">
               <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "100px", marginBottom: "10px" }}
           
          />
             </div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#333" }}>
            Festival Crackers
          </h1>
          <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
            {setting[0]?.Address}
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            <strong>Contact:</strong> {setting[0]?.CellNO} / {setting[0]?.OfficeNo}
          </p>
        </div>

        {/* Estimation Section */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
            background: "#fdfdfd",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              margin: "0 0 10px 0",
              fontSize: "18px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "5px",
            }}
          >
            Estimation
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "6px", fontSize: "14px" }}>
            <div><strong>Customer Name:</strong> {order.custName}</div>
            <div><strong>Mobile No:</strong> {order.customer?.mobileNo}</div>

            <div><strong>Order ID:</strong> {order.orderId}</div>
            <div><strong>Date:</strong> {order.date}</div>

            <div><strong>Total Products:</strong> {order.totalProducts}</div>
            <div><strong>Product Amount:</strong> ₹{order.totalAmount}</div>

            <div><strong>Packing Charge:</strong> ₹{order.packingCharge}</div>
            <div><strong>Total Amount:</strong> ₹{totalAmount}</div>

            <div style={{ gridColumn: "1 / span 2" }}>
              <strong>Billing Address:</strong> {order.deliveryAddress}
            </div>

            <div><strong>Transport Name:</strong> {order.transportName}</div>
            <div><strong>LR Number:</strong> {order.lrNumber}</div>
          </div>
        </div>

        {/* Product List */}
        <div>
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "16px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "5px",
            }}
          >
            Product List
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={thStyle}>S.No</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Rate (₹)</th>
                <th style={thStyle}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.billProductList?.map((product: any, index: number) => {
                const qty = Number(product.qty || 0);
                const rate = Number(product.salesPrice || 0);
                const amount = qty * rate;
                return (
                  <tr key={index}>
                    <td style={tdStyleCenter}>{index + 1}</td>
                    <td style={tdStyleLeft}>{product.productName}</td>
                    <td style={tdStyleRight}>{qty}</td>
                    <td style={tdStyleRight}>{rate.toFixed(2)}</td>
                    <td style={tdStyleRight}>{amount.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}>
                <td colSpan={2} style={tdStyleRight}>
                  Total
                </td>
                <td style={tdStyleRight}>{totalQty}</td>
                <td style={tdStyleRight}>—</td>
                <td style={tdStyleRight}>{totalProductAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "30px", fontSize: "13px" }}>
          Thank you for your purchase! – <strong>Festival Crackers</strong>
        </p>
      </div>
    </div>
  );
};

export default OrderPdfToDownload;

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  fontSize: "13px",
  textAlign: "center" as const,
};
const tdStyleLeft = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left" as const,
  fontSize: "13px",
};
const tdStyleRight = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "right" as const,
  fontSize: "13px",
};
const tdStyleCenter = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center" as const,
  fontSize: "13px",
};
