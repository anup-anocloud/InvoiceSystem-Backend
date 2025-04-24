const calculateInvoice = (items = [], discount = 0, gstRate = 18) => {
    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.priceAtTime; // Already calculated as quantity * unitPrice
    });

    const discountAmount = (subtotal * discount) / 100;
    const amountAfterDiscount = subtotal - discountAmount;
    const gstAmount = (amountAfterDiscount * gstRate) / 100;
    const totalAmount = amountAfterDiscount + gstAmount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        amountAfterDiscount: Number(amountAfterDiscount.toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
    };
};

module.exports = calculateInvoice;
