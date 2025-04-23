// utils/calculateInvoice.js
const calculateInvoice = (items = [], discount = 0, gstRate = 18) => {
    let subtotal = 0;

    items.forEach(item => {
        const quantity = Number(item.quantity || 1); // default to 1 if missing
        const price = Number(item.priceAtTime);

        if (!isNaN(quantity) && !isNaN(price)) {
            subtotal += quantity * price;
        }
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
