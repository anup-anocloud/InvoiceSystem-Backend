const generateInvoiceNumber = async (invoiceType, companyId, Invoice) => {
    // Find the latest invoice for this company (regardless of type)
    const latestInvoice = await Invoice.findOne({ company: companyId })
        .sort({ createdAt: -1 })
        .select('invoiceNumber')
        .lean();

    let sequenceNumber = '0005'; // Default starting number

    if (latestInvoice) {
        const parts = latestInvoice.invoiceNumber.split('/');
        const lastSeq = parts[parts.length - 1];
        sequenceNumber = String(parseInt(lastSeq, 10) + 1).padStart(4, '0');
    }

    // Get financial year (April–March)
    const now = new Date();
    const currentYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    const nextYearShort = (currentYear + 1).toString().slice(-2);
    const financialYear = `${currentYear}-${nextYearShort}`;

    // Format: ANO/TYPE/2024-25/000X
    return `ANO/${invoiceType}/${financialYear}/${sequenceNumber}`;
};

module.exports = generateInvoiceNumber;
