const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(24).text(
      "Invoice",
      { align: "center" }
    );

    doc.moveDown();

    doc.text(`Order ID: ${order._id}`);

    doc.text(
      `Total: ₹${order.totalPrice}`
    );

    doc.moveDown();

    order.orderItems.forEach((item) => {
      doc.text(
        `${item.name} - Qty: ${item.qty} - ₹${item.price}`
      );
    });

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  downloadInvoice,
};