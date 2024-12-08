import React, {
    useState,
    useContext,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { LoanApplicationContext } from "@/context/LoanApplicationContext";
import { Trash, FileArrowUp, X, ArrowsOut } from "@phosphor-icons/react";

export default function IdentityDetails({ onValidate }) {
    const {
        loanApplication,
        updateLoanApplication,
        validateForm: contextValidateForm,
        errors,
    } = useContext(LoanApplicationContext);

    // Enhanced Document Type Configurations
    const documentTypes = useMemo(
        () => [
            {
                type: "AadharCard",
                label: "Aadhar Card",
                validationRegex: /^\d{12}$/,
                fileTypes: [".jpg", ".jpeg", ".png", ".pdf"],
                formatDescription: "12 consecutive digits",
                placeholder: "Enter 12-digit Aadhar Number",
                example: "123456789012",
            },
            {
                type: "Passport",
                label: "Passport",
                validationRegex: /^[A-Z]\d{7}$/,
                fileTypes: [".jpg", ".jpeg", ".png", ".pdf"],
                formatDescription: "1 Uppercase letter followed by 7 digits",
                placeholder: "Enter Passport Number",
                example: "A1234567",
            },
            {
                type: "Driving License",
                label: "Driving License",
                validationRegex: /^[A-Z]{2}\d{13}$/,
                fileTypes: [".jpg", ".jpeg", ".png", ".pdf"],
                formatDescription: "2 Uppercase letters followed by 13 digits",
                placeholder: "Enter Driving License Number",
                example: "DL1234567890123",
            },
            {
                type: "Voter ID",
                label: "Voter ID Card",
                validationRegex: /^[A-Z]{3}\d{7}$/,
                fileTypes: [".jpg", ".jpeg", ".png", ".pdf"],
                formatDescription: "3 Uppercase letters followed by 7 digits",
                placeholder: "Enter Voter ID Number",
                example: "ABC1234567",
            },
        ],
        []
    );

    // Initialize form state from context
    const [formData, setFormData] = useState(() => ({
        DocumentType: loanApplication.DocumentType || "",
        DocumentNumber: loanApplication.DocumentNumber || "",
        DocumentFile: loanApplication.DocumentFile || null,
        DocumentPreview: loanApplication.DocumentPreview || null,
        DocumentFileName: loanApplication.DocumentFileName || null,
    }));

    // Update form data from context when component mounts or context changes
    useEffect(() => {
        setFormData({
            DocumentType: loanApplication.DocumentType || "",
            DocumentNumber: loanApplication.DocumentNumber || "",
            DocumentFile: loanApplication.DocumentFile || null,
            DocumentPreview: loanApplication.DocumentPreview || null,
            DocumentFileName: loanApplication.DocumentFileName || null,
        });
    }, [loanApplication]);

    // Comprehensive validation function
    const validateIdentityDetails = useCallback(() => {
        const selectedDocType = documentTypes.find(
            (doc) => doc.type === formData.DocumentType
        );

        const isValid = !!(
            formData.DocumentType &&
            formData.DocumentNumber &&
            selectedDocType &&
            selectedDocType.validationRegex.test(formData.DocumentNumber) &&
            (formData.DocumentFile || formData.DocumentPreview)
        );

        onValidate(isValid);
        contextValidateForm("identityDetails", formData);

        return isValid;
    }, [formData, onValidate, contextValidateForm, documentTypes]);

    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            const updatedFormData = { ...formData, [name]: value };
            setFormData(updatedFormData);
            updateLoanApplication(updatedFormData);

            const timeoutId = setTimeout(() => {
                validateIdentityDetails();
            }, 300);

            return () => clearTimeout(timeoutId);
        },
        [formData, updateLoanApplication, validateIdentityDetails]
    );

    const handleFileUpload = useCallback(
        (e) => {
            const file = e.target.files[0];
            if (file) {
                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "application/pdf",
                ];
                const maxSize = 5 * 1024 * 1024; // 5MB

                if (!allowedTypes.includes(file.type)) {
                    alert(
                        "Invalid file type. Please upload JPEG, PNG, or PDF."
                    );
                    return;
                }

                if (file.size > maxSize) {
                    alert("File size exceeds 5MB limit.");
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    const updatedFormData = {
                        ...formData,
                        DocumentFile: file,
                        DocumentFileName: file.name,
                        DocumentPreview: reader.result,
                    };
                    setFormData(updatedFormData);

                    // Update context with all file-related data
                    updateLoanApplication({
                        ...updatedFormData,
                        DocumentFile: file,
                        DocumentPreview: reader.result,
                        DocumentFileName: file.name,
                    });
                    validateIdentityDetails();
                };
                reader.readAsDataURL(file);
            }
        },
        [formData, updateLoanApplication, validateIdentityDetails]
    );

    const handleRemoveFile = useCallback(() => {
        const updatedFormData = {
            ...formData,
            DocumentFile: null,
            DocumentFileName: null,
            DocumentPreview: null,
        };

        setFormData(updatedFormData);
        updateLoanApplication(updatedFormData);
        validateIdentityDetails();
    }, [formData, updateLoanApplication, validateIdentityDetails]);

    useEffect(() => {
        const timeoutId = setTimeout(validateIdentityDetails, 100);
        return () => clearTimeout(timeoutId);
    }, [validateIdentityDetails]);

    // Rest of the component remains the same...
    const [preview, setPreview] = useState(false);

    const togglePreview = () => {
        setPreview(!preview);
    };

    const closePreview = () => {
        setPreview(false);
    };

    return (
        <div>
            <h1 className="text-xl font-semibold px-4 py-3">
                Identity Details
            </h1>
            <hr className="border-t border-dashed border-gray-300 my-3" />
            <div className="flex flex-col gap-10 px-4">
                <div className="grid grid-cols-3 gap-6 py-2">
                    {/* Document Type Dropdown */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Document Type
                        </label>
                        <select
                            name="DocumentType"
                            value={formData.DocumentType}
                            onChange={handleInputChange}
                            className={`w-full p-3 border rounded-md ${
                                !formData.DocumentType
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="">Select Document Type</option>
                            {documentTypes.map((doc) => (
                                <option key={doc.type} value={doc.type}>
                                    {doc.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Document Number Input */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            {formData.DocumentType
                                ? documentTypes.find(
                                      (d) => d.type === formData.DocumentType
                                  )?.label + " Number"
                                : "Document Number"}
                        </label>
                        <input
                            type="text"
                            name="DocumentNumber"
                            value={formData.DocumentNumber}
                            onChange={handleInputChange}
                            placeholder={
                                formData.DocumentType
                                    ? documentTypes.find(
                                          (d) =>
                                              d.type === formData.DocumentType
                                      )?.placeholder
                                    : "Enter Document Number"
                            }
                            className={`w-full p-3 border rounded-md ${
                                !formData.DocumentNumber
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {formData.DocumentType && (
                            <p className="text-xs text-gray-600 mt-1">
                                Format:{" "}
                                {
                                    documentTypes.find(
                                        (d) => d.type === formData.DocumentType
                                    )?.formatDescription
                                }
                                <br />
                                Example:{" "}
                                {
                                    documentTypes.find(
                                        (d) => d.type === formData.DocumentType
                                    )?.example
                                }
                            </p>
                        )}
                    </div>

                    {/* File Upload */}
                    <div className="w-full overflow-hidden">
                        <label className="block mb-2 text-sm font-medium">
                            Upload Document
                        </label>
                        <div className="flex w-full">
                            <div className="w-full relative">
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileUpload}
                                    className={`absolute inset-0 opacity-0 cursor-pointer z-10 ${
                                        !formData.DocumentFile
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                <div
                                    className={`p-3 border flex items-center justify-between bg-gray-50 ${
                                        !formData.DocumentFile
                                            ? "rounded-md"
                                            : "rounded-l-md"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <FileArrowUp
                                            size={24}
                                            className="text-blue-500"
                                        />
                                        <span
                                            className={`text-sm text-gray-600 text-nowrap text-ellipsis overflow-hidden
                                            ${
                                                formData.DocumentFile
                                                    ? "w-52 rounded-r-none"
                                                    : "w-full rounded-md"
                                            }
                                            `}
                                        >
                                            {formData.DocumentFileName
                                                ? formData.DocumentFileName
                                                : "Choose File"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {formData.DocumentFileName && (
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="w-20 text-red-500 hover:text-red-700 border border-l-0 bg-gray-50 p-3 rounded-r-md"
                                >
                                    <Trash size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Document Preview */}
                {formData.DocumentPreview && (
                    <div className="bg-gray-50 p-8 rounded-lg flex items-center gap-4 relative">
                        <div className="min-w-64 h-48 border rounded-lg overflow-hidden">
                            {formData.DocumentPreview.includes("pdf") ? (
                                <div className="h-full relative">
                                    <iframe
                                        src={formData.DocumentPreview}
                                        className="w-full h-full"
                                        title="Document Preview"
                                    />
                                    <button
                                        className="border border-gray-300 bg-white rounded-lg p-2 absolute top-0 right-0"
                                        onClick={togglePreview}
                                    >
                                        <ArrowsOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <img
                                    src={formData.DocumentPreview}
                                    alt="Document Preview"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold">Document Preview</p>
                            <p className="text-sm text-gray-600">
                                {formData.DocumentFileName}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {preview && (
                <div className="z-30 h-screen w-full absolute top-0 left-0 bg-black bg-opacity-45 flex items-start m-auto">
                    <div className="w-2/3 h-5/6 m-auto">
                        <iframe
                            src={formData.DocumentPreview}
                            className="w-full h-full rounded-xl"
                            title="Document Preview"
                        />
                    </div>
                    <button
                        className="p-1 bg-white absolute top-8 right-40 rounded-md"
                        onClick={closePreview}
                    >
                        <X size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}
