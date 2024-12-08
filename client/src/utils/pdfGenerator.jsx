import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generatePDF = (application) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new jsPDF();

            // Set document properties
            doc.setProperties({
                title: "Loan Application",
                author: "Your Company Name",
            });

            // Color palette
            const colors = {
                primary: [41, 128, 185], // Blue
                background: [240, 242, 245], // Light gray
                text: [44, 62, 80], // Dark blue-gray
            };

            // Add background
            doc.setFillColor(...colors.background);
            doc.rect(0, 0, 210, 297, "F");

            // Header
            doc.setFillColor(...colors.primary);
            doc.rect(0, 0, 210, 25, "F");

            // Set text color for header
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text("Loan Application", 105, 17, {
                align: "center",
                baseline: "middle",
            });

            // Reset text color for body
            doc.setTextColor(...colors.text);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            // Table of application details
            const tableColumn = ["Field", "Value"];
            const tableRows = [];

            Object.entries(application).forEach(([key, value]) => {
                // Skip MongoDB specific fields and empty values
                if (key !== "_id" && key !== "__v" && value) {
                    // Format the key to be more readable (camelCase to Title Case)
                    const formattedKey = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                    tableRows.push([formattedKey, String(value)]);
                }
            });

            // Auto table with styling
            doc.autoTable({
                startY: 35,
                head: [tableColumn],
                body: tableRows,
                theme: "striped",
                styles: {
                    font: "helvetica",
                    fontSize: 10,
                    textColor: colors.text,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.5,
                },
                headStyles: {
                    fillColor: colors.primary,
                    textColor: 255,
                    fontSize: 12,
                },
                alternateRowStyles: {
                    fillColor: [250, 250, 250],
                },
                columnStyles: {
                    0: { fontStyle: "bold", cellWidth: 50 },
                    1: { cellWidth: "auto" },
                },
                margin: { left: 20, right: 20 },
            });

            // Footer
            doc.setTextColor(150);
            doc.setFontSize(8);
            doc.text(
                "Generated on: " + new Date().toLocaleString(),
                105,
                doc.internal.pageSize.height - 10,
                { align: "center" }
            );

            // Create blob
            const pdfBlob = doc.output("blob");
            resolve(pdfBlob);
        } catch (error) {
            reject(error);
        }
    });
};
