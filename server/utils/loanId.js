const LoanApplication = require("../model/loanApplication");

async function generateLoanId(loanType) {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");

    const loanTypePrefix = getLoanTypePrefix(loanType);

    const latestApplication = await LoanApplication.findOne({
        loanId: { $regex: `^${loanTypePrefix}-${dateString}` },
    }).sort({ loanId: -1 });

    let sequenceNumber = "00001";
    if (latestApplication) {
        const latestSequence = parseInt(latestApplication.loanId.slice(-5));
        sequenceNumber = (latestSequence + 1).toString().padStart(5, "0");
    }

    return `${loanTypePrefix}-${dateString}-${sequenceNumber}`;
}

function getLoanTypePrefix(loanType) {
    switch (loanType.toLowerCase()) {
        case "home":
            return "HL";
        case "personal":
            return "PL";
        case "car":
            return "CL";
        case "education":
            return "EL";
        case "gold":
            return "GL";
        // Add more loan types as needed
        default:
            return "invalid";
    }
}

module.exports = { generateLoanId };
