import bubbleicon from "../assets/bubbleicon.svg";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";

const FooterSection = ({ title, items }) => (
    <div>
        <h1 className="text-gray-400">{title}</h1>
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
);

export default function Footer() {
    const features = [
        "Payment Link",
        "Invoice",
        "Pricing",
        "Loans",
        "Emi",
        "Stocks",
    ];
    const solutions = [
        "eCommerce",
        "Finance Automation",
        "Crypto",
        "Global Business",
        "Marketplaces",
    ];
    const resources = ["Tutorials", "Blog", "Community", "Privacy Policy"];
    const about = ["Company", "Careers", "FAQ", "Contact Us"];

    return (
        <footer className="bg-[url('assets/footerbg.jpg')] bg-cover py-10 flex flex-col items-center gap-10">
            <div className="flex justify-between w-11/12">
                <div className="flex items-start gap-2">
                    <img
                        src={bubbleicon}
                        alt="Finance Flow Logo"
                        className="w-8"
                    />
                    <h1 className="text-xl font-bold font-[Merriweather]">
                        Finance Flow.
                    </h1>
                </div>

                <nav className="grid grid-cols-4 gap-12">
                    <FooterSection title="Features" items={features} />
                    <FooterSection title="Solutions" items={solutions} />
                    <FooterSection title="Resources" items={resources} />
                    <FooterSection title="About" items={about} />
                </nav>
            </div>
            <div className="flex justify-between w-11/12 text-gray-500 items-center">
                <p>&copy; 2024 Finance Flow. All Rights Reserved.</p>
                <div className="flex gap-4 text-gray-600 text-xl">
                    <FaLinkedinIn />
                    <FaFacebook />
                    <FaTwitter />
                </div>
            </div>
        </footer>
    );
}