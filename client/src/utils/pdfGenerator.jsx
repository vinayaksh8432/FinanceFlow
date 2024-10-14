import { jsPDF } from "jspdf";

export const generatePDF = (application) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Loan Application", 105, 15, null, null, "center");

            doc.setFontSize(12);
            let yPos = 30;

            Object.entries(application).forEach(([key, value]) => {
                if (key !== "_id" && key !== "__v") {
                    doc.text(`${key}: ${value}`, 20, yPos);
                    yPos += 10;

                    if (yPos > 280) {
                        doc.addPage();
                        yPos = 20;
                    }
                }
            });

            const pdfBlob = doc.output("blob");
            resolve(pdfBlob);
        } catch (error) {
            reject(error);
        }
    });
};
