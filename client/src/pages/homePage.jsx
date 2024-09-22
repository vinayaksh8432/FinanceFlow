import Footer from "../components/footer";
import Header from "../components/header";
import { MdOutlinePrivacyTip, MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineBank } from "react-icons/ai";
import { LuHeartHandshake } from "react-icons/lu";

// Reusable FeatureCard Component
const FeatureCard = ({
    icon: Icon,
    bgColor,
    textColor,
    borderColor,
    title,
    description,
}) => (
    <div className="bg-white px-6 py-8 rounded-3xl w-1/5 shadow-sm border">
        <button
            className={`px-2 py-1 rounded-lg flex gap-1 items-center shadow-md border`}
            style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
            }}
        >
            <Icon /> {title}
        </button>
        <h1 className="font-semibold text-3xl pt-8">{title}</h1>
        <p className="pt-4">{description}</p>
    </div>
);

export default function HomePage() {
    return (
        <>
            <div>
                <Header />
                <div className="bg-[url('assets/bluebg.jpg')] rounded-[30px] text-center bg-cover h-[78vh]">
                    <h1 className="text-9xl text-gray-100 pt-28">
                        Better financial <br />
                        lives built
                    </h1>
                    <h1 className="text-lg text-gray-100">
                        Unparalleled budgeting features. Data import. Zero ads.
                        Bank-grade security.
                    </h1>
                </div>
                <div className="relative pb-20">
                    <div className="absolute -translate-y-40 flex justify-center text-left gap-4 backdrop-blur-[1px]">
                        <FeatureCard
                            icon={MdOutlinePrivacyTip}
                            bgColor="#ecd9ff"
                            textColor="#b05ce6"
                            borderColor="#b05ce6"
                            title="Privacy"
                            description="Rest assured, we'll never sell your personal data."
                        />
                        <FeatureCard
                            icon={AiOutlineBank}
                            bgColor="#d6edfe"
                            textColor="#509bf1"
                            borderColor="#509bf1"
                            title="Security"
                            description="We protect your data with industry-standard 256 bit encryption."
                        />
                        <FeatureCard
                            icon={LuHeartHandshake}
                            bgColor="#ffeea2"
                            textColor="#ed8324"
                            borderColor="#ed8324"
                            title="Trusted"
                            description="#1 best-selling with over 20+ million users over 5 years."
                        />
                        <FeatureCard
                            icon={MdOutlineAttachMoney}
                            bgColor="#d0fcd5"
                            textColor="#3cbb8e"
                            borderColor="#3cbb8e"
                            title="No extra Charges"
                            description="No hidden fees required to use our services adfree."
                        />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
