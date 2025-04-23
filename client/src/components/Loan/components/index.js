// Export all loan form components from a single file
// Using absolute imports instead of relative imports
import PersonalDetails from "@/components/Loan/components/PersonalDetails.jsx";
import IdentityDetails from "@/components/Loan/components/IdentityDetails.jsx";
import AddressDetails from "@/components/Loan/components/AddressDetails.jsx";
import EmployeeDetails from "@/components/Loan/components/EmployeeDetails.jsx";
import LoanAmount from "@/components/Loan/components/LoanAmount.jsx";
import LoanChart from "@/components/Loan/components/LoanChart.jsx";

export {
    PersonalDetails,
    IdentityDetails,
    AddressDetails,
    EmployeeDetails,
    LoanAmount,
    LoanChart,
};
