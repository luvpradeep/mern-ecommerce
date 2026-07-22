const express = require("express");
const router = express.Router();

const path = require("path");
const PDFDocument = require("pdfkit");

const Order = require("../models/order");

// ======================================================
// PROFESSIONAL INVOICE DOWNLOAD
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ======================================================
    // PDF SETUP
    // ======================================================

    const doc = new PDFDocument({
      size: "A4",
      margin: 45,
      bufferPages: true,
      autoFirstPage: true,
    });

    // ------------------------------------------------------
    // FONTS
    // ------------------------------------------------------

    doc.registerFont(
      "Regular",
      path.join(__dirname, "../fonts/NotoSans-Regular.ttf")
    );

    doc.registerFont(
      "Bold",
      path.join(__dirname, "../fonts/NotoSans-Bold.ttf")
    );

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id
        .toString()
        .slice(-8)}.pdf`
    );

    doc.pipe(res);

    // ======================================================
    // COLORS
    // ======================================================

    const PRIMARY = "#2563eb";
    const SUCCESS = "#16a34a";
    const WARNING = "#f59e0b";
    const DANGER = "#dc2626";

    const DARK = "#111827";
    const GRAY = "#6b7280";
    const LIGHT = "#f8fafc";
    const BORDER = "#d1d5db";
    const WHITE = "#ffffff";

    // ======================================================
    // HELPERS
    // ======================================================

    const money = (amount = 0) =>
      `₹ ${Number(amount).toLocaleString("en-IN")}`;

    const drawLine = (y) => {
      doc
        .strokeColor(BORDER)
        .lineWidth(1)
        .moveTo(45, y)
        .lineTo(550, y)
        .stroke();
    };

    const label = (text, x, y) => {
      doc
        .font("Bold")
        .fontSize(11)
        .fillColor(DARK)
        .text(text, x, y);
    };

    const value = (
      text,
      x,
      y,
      width = 130,
      align = "right",
      color = DARK
    ) => {
      doc
        .font("Regular")
        .fontSize(11)
        .fillColor(color)
        .text(String(text ?? "-"), x, y, {
          width,
          align,
        });
    };

    // ======================================================
    // HEADER
    // ======================================================

    doc
      .rect(0, 0, 595, 95)
      .fill(PRIMARY);

    // Company

    doc
      .fillColor(WHITE)
      .font("Bold")
      .fontSize(28)
      .text("MERN SHOP", 45, 24);

    doc
      .font("Regular")
      .fontSize(12)
      .fillColor("#dbeafe")
      .text("Premium Online Shopping", 45, 60);

    // Invoice

    doc
      .fillColor(WHITE)
      .font("Bold")
      .fontSize(26)
      .text("INVOICE", 360, 25, {
        width: 180,
        align: "right",
      });

    doc
      .font("Regular")
      .fontSize(10)
      .fillColor("#dbeafe")
      .text(
        `Generated : ${new Date().toLocaleDateString("en-IN")}`,
        360,
        60,
        {
          width: 180,
          align: "right",
        }
      );

    doc.fillColor(DARK);

    // ======================================================
    // START POSITION
    // ======================================================

    let currentY = 115;

    // ======================================================
// SELLER DETAILS
// ======================================================

const address = order.shippingAddress || {};

const sellerX = 45;
const invoiceX = 330;

doc
  .font("Bold")
  .fontSize(16)
  .fillColor(DARK)
  .text("Seller Information", sellerX, currentY);

doc
  .font("Regular")
  .fontSize(11)
  .fillColor(GRAY)
  .text("MERN SHOP", sellerX, currentY + 28)
  .text("Chennai, Tamil Nadu", sellerX, currentY + 46)
  .text("support@mernshop.com", sellerX, currentY + 64)
  .text("+91 98765 43210", sellerX, currentY + 82);

// ======================================================
// INVOICE DETAILS
// ======================================================

doc
  .font("Bold")
  .fontSize(15)
  .fillColor(DARK)
  .text("Invoice Details", invoiceX, currentY);

let infoY = currentY + 30;

label("Invoice No", invoiceX, infoY);
value(
  order._id.toString().slice(-8).toUpperCase(),
  420,
  infoY,
  120
);

infoY += 22;

label("Order Date", invoiceX, infoY);
value(
  new Date(order.createdAt).toLocaleDateString("en-IN"),
  420,
  infoY,
  120
);

infoY += 22;

label("Payment", invoiceX, infoY);
value(order.paymentMethod || "-", 420, infoY, 120);

infoY += 22;

label("Payment Status", invoiceX, infoY);

value(
  order.paymentInfo?.status || "Pending",
  420,
  infoY,
  120,
  "right",
  order.paymentInfo?.status === "Paid"
    ? SUCCESS
    : DANGER
);

currentY += 120;

drawLine(currentY);

currentY += 25;

// ======================================================
// BILL TO
// ======================================================

const leftX = 45;
const rightX = 315;

doc
  .font("Bold")
  .fontSize(13)
  .fillColor(PRIMARY)
  .text("BILL TO", leftX, currentY);

doc
  .font("Bold")
  .fontSize(11)
  .fillColor(DARK)
  .text(address.fullName || "-", leftX, currentY + 24);

doc
  .font("Regular")
  .fontSize(11)
  .fillColor(GRAY)
  .text(address.phone || "-", leftX, currentY + 42);

doc.text(address.address || "-", leftX, currentY + 60, {
  width: 220,
});

const leftBottom = doc.y;

doc.text(
  `${address.city || "-"}, ${address.state || "-"}`,
  leftX,
  leftBottom + 10
);

doc.text(
  `PIN : ${address.pincode || "-"}`,
  leftX,
  leftBottom + 28
);

// ======================================================
// SHIP TO
// ======================================================

doc
  .font("Bold")
  .fontSize(13)
  .fillColor(PRIMARY)
  .text("SHIP TO", rightX, currentY);

doc
  .font("Bold")
  .fontSize(11)
  .fillColor(DARK)
  .text(address.fullName || "-", rightX, currentY + 24);

doc
  .font("Regular")
  .fontSize(11)
  .fillColor(GRAY)
  .text(address.phone || "-", rightX, currentY + 42);

doc.text(address.address || "-", rightX, currentY + 60, {
  width: 220,
});

const rightBottom = doc.y;

doc.text(
  `${address.city || "-"}, ${address.state || "-"}`,
  rightX,
  rightBottom + 10
);

doc.text(
  `PIN : ${address.pincode || "-"}`,
  rightX,
  rightBottom + 28
);

// ======================================================
// ORDER DETAILS CARD
// ======================================================

let cardY = Math.max(leftBottom, rightBottom) + 60;

doc
  .roundedRect(45, cardY, 500, 100, 8)
  .fill(LIGHT);

doc
  .fillColor(DARK)
  .font("Bold")
  .fontSize(13)
  .text("ORDER DETAILS", 60, cardY + 15);

// Left

doc.font("Bold").fontSize(10);

doc.text("Order ID", 60, cardY + 42);

doc.font("Regular");

doc.text(order._id.toString(), 140, cardY + 42, {
  width: 140,
});

doc.font("Bold");

doc.text("Items", 60, cardY + 66);

doc.font("Regular");

doc.text(
  String(order.orderItems?.length || 0),
  140,
  cardY + 66
);

// Right

doc.font("Bold");

doc.text("Payment", 315, cardY + 42);

doc.font("Regular");

doc.text(
  order.paymentMethod || "-",
  420,
  cardY + 42,
  {
    width: 95,
    align: "right",
  }
);

doc.font("Bold");

doc.text("Status", 315, cardY + 66);

doc
  .font("Regular")
  .fillColor(
    order.paymentInfo?.status === "Paid"
      ? SUCCESS
      : DANGER
  )
  .text(
    order.paymentInfo?.status || "Pending",
    420,
    cardY + 66,
    {
      width: 95,
      align: "right",
    }
  );

doc.fillColor(DARK);

// ======================================================
// ORDER BADGE (SMALLER)
// ======================================================

let badgeColor = WARNING;

switch (order.orderStatus) {
  case "Delivered":
    badgeColor = SUCCESS;
    break;

  case "Cancelled":
    badgeColor = DANGER;
    break;

  case "Shipped":
  case "Out for Delivery":
    badgeColor = PRIMARY;
    break;
}

doc
  .roundedRect(430, cardY + 10, 90, 22, 11)
  .fill(badgeColor);

doc
  .fillColor("white")
  .font("Bold")
  .fontSize(8)
  .text(
    order.orderStatus || "Processing",
    430,
    cardY + 16,
    {
      width: 90,
      align: "center",
    }
  );

doc.fillColor(DARK);

// ======================================================
// PRODUCT TABLE START
// ======================================================

let tableTop = cardY + 125;

// ======================================================
// PRODUCT TABLE
// ======================================================

const COL = {
  sl: 60,
  product: 95,
  qty: 345,
  price: 405,
  total: 485,
};

currentY = tableTop;

// ------------------------------------------------------
// TABLE HEADER
// ------------------------------------------------------

doc
  .rect(45, currentY, 500, 34)
  .fill(PRIMARY);

doc
  .fillColor("white")
  .font("Bold")
  .fontSize(11);

doc.text("#", COL.sl, currentY + 10);

doc.text("Product", COL.product, currentY + 10);

doc.text("Qty", COL.qty, currentY + 10, {
  width: 40,
  align: "center",
});

doc.text("Price", COL.price, currentY + 10, {
  width: 65,
  align: "right",
});

doc.text("Total", COL.total, currentY + 10, {
  width: 55,
  align: "right",
});

currentY += 34;

// ======================================================
// PRODUCT ROWS
// ======================================================

order.orderItems.forEach((item, index) => {

  const productName =
    item.name ||
    item.product?.name ||
    "Product";

  const qty = Number(item.qty || 1);

  const price = Number(item.price || 0);

  const total = qty * price;

  const textHeight = doc.heightOfString(productName, {
    width: 220,
  });

  const rowHeight = Math.max(34, textHeight + 16);

  // --------------------------------------------------
  // PAGE BREAK
  // --------------------------------------------------

  if (currentY + rowHeight > 760) {

    doc.addPage();

    currentY = 55;

    doc
      .rect(45, currentY, 500, 34)
      .fill(PRIMARY);

    doc
      .fillColor("white")
      .font("Bold")
      .fontSize(11);

    doc.text("#", COL.sl, currentY + 10);

    doc.text("Product", COL.product, currentY + 10);

    doc.text("Qty", COL.qty, currentY + 10, {
      width: 40,
      align: "center",
    });

    doc.text("Price", COL.price, currentY + 10, {
      width: 65,
      align: "right",
    });

    doc.text("Total", COL.total, currentY + 10, {
      width: 55,
      align: "right",
    });

    currentY += 34;
  }

  // --------------------------------------------------
  // ALTERNATE ROW COLOR
  // --------------------------------------------------

  if (index % 2 === 0) {

    doc
      .rect(45, currentY, 500, rowHeight)
      .fill("#fafafa");
  }

  doc.fillColor(DARK);

  // --------------------------------------------------
  // SERIAL NUMBER
  // --------------------------------------------------

  doc
    .font("Regular")
    .fontSize(10)
    .text(
      String(index + 1),
      COL.sl,
      currentY + 10,
      {
        width: 20,
        align: "center",
      }
    );

  // --------------------------------------------------
  // PRODUCT NAME
  // --------------------------------------------------

  doc
    .font("Regular")
    .fontSize(10)
    .text(
      productName,
      COL.product,
      currentY + 8,
      {
        width: 220,
        lineGap: 2,
      }
    );

  // --------------------------------------------------
  // QUANTITY
  // --------------------------------------------------

  doc.text(
    qty.toString(),
    COL.qty,
    currentY + 10,
    {
      width: 40,
      align: "center",
    }
  );

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  doc.text(
    money(price),
    COL.price,
    currentY + 10,
    {
      width: 65,
      align: "right",
    }
  );

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  doc
    .font("Bold")
    .text(
      money(total),
      COL.total,
      currentY + 10,
      {
        width: 55,
        align: "right",
      }
    );

  // --------------------------------------------------
  // DIVIDER
  // --------------------------------------------------

  doc
    .strokeColor("#e5e7eb")
    .lineWidth(.7)
    .moveTo(45, currentY + rowHeight)
    .lineTo(545, currentY + rowHeight)
    .stroke();

  currentY += rowHeight;
});

currentY += 8;

// ======================================================
// ORDER SUMMARY
// ======================================================

// Only create a new page if the summary won't fit

const summaryHeight = 90;

if (currentY + summaryHeight > 760) {
    doc.addPage();
    currentY = 60;
}

// Card
doc
  .roundedRect(45, currentY, 500, 80, 8)
  .fill("#f8fafc");

// Title
doc
  .fillColor(PRIMARY)
  .font("Bold")
  .fontSize(15)
  .text("ORDER SUMMARY", 60, currentY + 18);

const leftCol = 60;
const rightCol = 430;

let sumY = currentY + 50;

doc
  .font("Regular")
  .fontSize(11)
  .fillColor(DARK);

// Subtotal
doc.text("Subtotal", leftCol, sumY);

doc.text(
  money(order.itemsPrice || order.totalPrice || 0),
  rightCol,
  sumY,
  {
    width: 90,
    align: "right",
  }
);

sumY += 24;

// Shipping
doc.text("Shipping Charges", leftCol, sumY);

doc.text(
  Number(order.shippingPrice || 0) === 0
    ? "FREE"
    : money(order.shippingPrice),
  rightCol,
  sumY,
  {
    width: 90,
    align: "right",
  }
);

sumY += 24;

// GST
doc.text("GST", leftCol, sumY);

doc.text(
  money(order.taxPrice || 0),
  rightCol,
  sumY,
  {
    width: 90,
    align: "right",
  }
);

sumY += 22;

// Divider
doc
  .strokeColor(BORDER)
  .lineWidth(1)
  .moveTo(60, sumY)
  .lineTo(530, sumY)
  .stroke();

sumY += 16;

// Grand Total
doc
  .font("Bold")
  .fontSize(14)
  .fillColor(DARK)
  .text("Grand Total", leftCol, sumY);

doc
  .fillColor(SUCCESS)
  .fontSize(16)
  .text(
    money(order.totalPrice || 0),
    rightCol,
    sumY - 2,
    {
      width: 90,
      align: "right",
    }
  );

doc.fillColor(DARK);

// Move cursor after summary
currentY += 90;

// ======================================================
// THANK YOU SECTION
// ======================================================

// Height needed for the remaining content

const remainingHeight = 270;

if (currentY + remainingHeight > 760) {
    doc.addPage();
    currentY = 60;
}

drawLine(currentY);

currentY += 28;

doc
  .font("Bold")
  .fontSize(18)
  .fillColor(PRIMARY)
  .text("Thank You For Shopping With MERN SHOP", 45, currentY, {
    width: 500,
    align: "center",
  });

currentY += 30;

doc
  .font("Regular")
  .fontSize(11)
  .fillColor(GRAY)
  .text(
    "We truly appreciate your purchase. Your trust motivates us to provide the best shopping experience.",
    70,
    currentY,
    {
      width: 450,
      align: "center",
    }
  );

currentY += 55;

// ======================================================
// VERIFIED INVOICE BOX
// ======================================================

doc
  .roundedRect(45, currentY, 500, 55, 8)
  .fill("#ECFDF5");

doc
  .fillColor(SUCCESS)
  .font("Bold")
  .fontSize(13)
  .text("✓ VERIFIED COMPUTER GENERATED INVOICE", 60, currentY + 12);

doc
  .font("Regular")
  .fontSize(10)
  .fillColor(DARK)
  .text(
    "No signature is required for this invoice.",
    60,
    currentY + 32
  );

currentY += 60;

// ======================================================
// SUPPORT BOX
// ======================================================

doc
  .roundedRect(45, currentY, 240, 90, 8)
  .fill("#F8FAFC");

doc
  .fillColor(PRIMARY)
  .font("Bold")
  .fontSize(13)
  .text("Customer Support", 60, currentY + 15);

doc
  .font("Regular")
  .fontSize(10)
  .fillColor(DARK)
  .text("Email :", 60, currentY + 42);

doc.text("support@mernshop.com", 105, currentY + 42);

doc.text("Phone :", 60, currentY + 60);

doc.text("+91 98765 43210", 105, currentY + 60);

// ======================================================
// RETURN POLICY
// ======================================================

doc
  .roundedRect(305, currentY, 240, 90, 8)
  .fill("#F8FAFC");

doc
  .fillColor(PRIMARY)
  .font("Bold")
  .fontSize(13)
  .text("Return Policy", 320, currentY + 15);

doc
  .font("Regular")
  .fontSize(10)
  .fillColor(DARK)
  .text(
    "Returns accepted within 7 days for eligible products.",
    320,
    currentY + 40,
    {
      width: 200,
    }
  );

currentY += 85;

// ======================================================
// TERMS
// ======================================================

doc
  .fillColor(DARK)
  .font("Bold")
  .fontSize(11)
  .text("Terms & Conditions", 45, currentY);

currentY += 20;

doc
  .font("Regular")
  .fontSize(9)
  .fillColor(GRAY);

doc.text(
  "• This invoice is generated electronically and does not require a physical signature.",
  55,
  currentY
);

currentY += 15;

doc.text(
  "• Goods once sold are subject to MERN SHOP return and refund policies.",
  55,
  currentY
);

currentY += 15;

doc.text(
  "• Please retain this invoice for warranty and future reference.",
  55,
  currentY
);

currentY += 25;

drawLine(currentY);

currentY += 15;

// ======================================================
// FOOTER
// ======================================================

doc
  .font("Regular")
  .fontSize(9)
  .fillColor("#9CA3AF")
  .text(
    `Generated on ${new Date().toLocaleString("en-IN")}`,
    45,
    currentY
  );

doc.text(
  "Powered by MERN SHOP",
  295,
  currentY,
  {
    width: 250,
    align: "right",
  }
);

// ======================================================
// PAGE NUMBERS
// ======================================================

const pages = doc.bufferedPageRange();

for (let i = 0; i < pages.count; i++) {

  doc.switchToPage(i);

  doc
    .font("Regular")
    .fontSize(9)
    .fillColor("#9CA3AF")
    .text(
      `Page ${i + 1} of ${pages.count}`,
      45,
      790,
      {
        width: 500,
        align: "center",
      }
    );
}

// ======================================================
// FINISH PDF
// ======================================================

doc.end();

} catch (error) {

  console.error(error);

  if (!res.headersSent) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}

});

module.exports = router;