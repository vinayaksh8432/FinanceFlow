import Footer from "../components/footer";
import Header from "../components/header";
import { MdOutlinePrivacyTip, MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineBank } from "react-icons/ai";
import { LuHeartHandshake } from "react-icons/lu";
import phone from "../assets/phone.svg";
import graph from "../assets/graph.svg";
import loan from "../assets/loan.svg";
import { LockLaminated } from "@phosphor-icons/react";
import { RiStockFill } from "react-icons/ri";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FeatureCard = ({
    icon: Icon,
    bgColor,
    textColor,
    borderColor,
    title,
    description,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-t from-blue-700 to-blue-300 border border-white p-6 rounded-lg w-1/3 text-white"
        >
            <div
                className={`w-fit text-sm px-2 py-1 rounded-md flex gap-1 items-center shadow-md border`}
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderColor: borderColor,
                }}
            >
                <Icon /> {title}
            </div>
            <h1 className="font-semibold text-2xl pt-6 pb-1">{title}</h1>
            <p>{description}</p>
        </motion.div>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-slate-100 border border-neutral-200 rounded px-2 flex items-center gap-2">
            <div className="text-lg">₹ {payload[0].value.toLocaleString()}</div>
            |
            <div className="text-sm text-neutral-500">
                {new Date(`2023-${payload[0].payload.date}-01`).toLocaleString(
                    "default",
                    { month: "long" }
                )}
            </div>
        </div>
    );
};

export default function HomePage() {
    const data = [
        { uv: 0, shares: 1400, date: "January" },
        { uv: 100, shares: 1400, date: "February" },
        { uv: 300, shares: 1400, date: "March" },
        { uv: 200, shares: 2210, date: "April" },
        { uv: 450, shares: 2290, date: "May" },
        { uv: 600, shares: 2290, date: "June" },
        { uv: 450, shares: 2290, date: "July" },
        { uv: 450, shares: 2290, date: "August" },
        { uv: 700, shares: 2000, date: "September" },
        { uv: 550, shares: 2181, date: "October" },
        { uv: 900, shares: 2500, date: "November" },
        { uv: 990, shares: 2100, date: "December" },
        { uv: 1290, shares: 2100, date: "January" },
        { uv: 1300, shares: 2100, date: "February" },
        { uv: 1500, shares: 2300, date: "March" },
        { uv: 1250, shares: 2400, date: "April" },
        { uv: 1700, shares: 2500, date: "May" },
        { uv: 1500, shares: 2600, date: "June" },
        { uv: 1900, shares: 2700, date: "July" },
        { uv: 1910, shares: 2800, date: "August" },
    ];
    return (
        <div className="bg-blue-600 font-[Urbanist]">
            <div className="h-screen relative overflow-hidden space-y-20">
                <Header />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative text-center flex flex-col gap-16 flex-1 overflow-auto z-10"
                >
                    <div>
                        <h1 className="text-8xl font-medium text-white leading-[1.25]">
                            Optimize{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-white">
                                Your Growth With
                            </span>{" "}
                            Advance Finance Technology
                        </h1>
                        <h2 className="text-2xl font-light text-neutral-200">
                            Unparalleled budgeting features. Data import. Zero
                            ads. Bank-grade security.
                        </h2>
                    </div>
                    <div className="px-36 flex justify-center text-left gap-4">
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
                            title="No Extra Charges"
                            description="No hidden fees required to use our services adfree."
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 1, y: 400 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute w-full bottom-0 z-0"
                >
                    <div className="relative flex items-end justify-between px-8">
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-5"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-10"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-15"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-15"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-20"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-15"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-15"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-10"></div>
                        <div className="relative h-96 w-32 bg-gradient-to-b from-blue-600 to-white border border-t-0 opacity-5"></div>
                    </div>

                    <div className="absolute bg-gradient-to-t from-blue-600 to-transparent bottom-0 w-full h-[26rem]"></div>
                    <div className="absolute -bottom-[35rem] w-full h-[50rem] rounded-t-[50%] border-t border-white"></div>
                    <div className="absolute bg-blue-600 -bottom-[36rem] w-full h-[50rem] rounded-t-[50%]"></div>
                </motion.div>
            </div>
            <div className="bg-blue-100 flex justify-between px-36 py-16">
                <div className="w-1/2 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className="uppercase text-sm">Try it now !</h2>
                        <p className="text-7xl ">
                            Change the way you use your <br />
                            <span className="font-[Riccione] italic">
                                money
                            </span>
                        </p>
                    </div>
                    <div className="text-lg flex flex-col gap-4">
                        <p>
                            From everyday spending to planning for your future
                            with savings and investments. Finance Flow helps you
                            get more from your money.
                        </p>
                        <label htmlFor="" className="flex gap-4 items-center">
                            <button className="bg-blue-600 text-white rounded-full px-4 py-2">
                                Get Started Now
                            </button>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-2 grid-rows-2">
                    <img
                        src={phone}
                        alt="Phone"
                        className="w-52 h-52 object-cover bg-gradient-to-br from-slate-400 to-slate-200 rounded-bl-[50%] pl-2 pb-5 pt-8"
                    />
                    <div className="w-52 h-52 bg-gradient-to-bl from-blue-300 to-blue-50 rounded-tl-[50%] flex flex-col justify-center items-end gap-6 px-8 pr-4">
                        <LockLaminated size={30} />
                        <p className="text-2xl">Secure data encryption</p>
                    </div>
                    <div className="w-52 h-52 bg-gradient-to-tr from-blue-500 to-blue-200 rounded-br-[50%] flex flex-col justify-between py-6 px-6 pr-10 text-white">
                        <h2 className="text-xl">21200</h2>
                        <div className="flex justify-end">
                            <img src={graph} alt="" className="pl-8" />
                        </div>
                        <p className="text-lg leading-[1.25]">
                            Real-time stock updates
                        </p>
                    </div>
                    <img
                        src={loan}
                        alt="Phone"
                        className="w-52 h-52 object-contain bg-gradient-to-br from-slate-200 to-slate-500 p-8 rounded-tr-[50%]"
                    />
                </div>
            </div>
            <div className="bg-blue-50 py-16 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className=" flex justify-center px-36"
                >
                    <div className="w-full flex flex-col gap-6 items-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="px-2 py-1 rounded-full bg-gradient-to-t from-blue-300 to-blue-100 font-light flex items-center gap-2"
                        >
                            <RiStockFill
                                size={20}
                                className="bg-gradient-to-t from-blue-600 to-blue-300 text-white rounded-full p-1"
                            />
                            Seamless Stock Checker
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-6xl font-semibold text-center pb-6"
                        >
                            Get real-time updates on your <br /> stock{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-t from-blue-500 to-blue-800 font-bold">
                                Portfolio
                            </span>{" "}
                            and market trends.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="w-full flex items-center"
                        >
                            <div className="h-96 w-full rounded-2xl bg-blue-50 p-1 border border-neutral-300 shadow-inner">
                                <ResponsiveContainer className="border border-neutral-200 rounded-xl bg-gradient-to-t from-blue-100 to-blue-50">
                                    <AreaChart
                                        data={data}
                                        margin={{
                                            top: 25,
                                            right: 25,
                                            left: 25,
                                            bottom: 0,
                                        }}
                                    >
                                        <XAxis dataKey="date" tick={false} />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{
                                                stroke: "#3b82f6",
                                                strokeWidth: 1,
                                                strokeDasharray: "5 5",
                                            }}
                                        />
                                        <Area
                                            type="linear"
                                            dataKey="uv"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#colorValue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full  flex flex-col gap-8">
                                <div className="flex flex-col gap-2 px-8">
                                    <h3 className="text-2xl font-semibold">
                                        Track Your Investments
                                    </h3>
                                    <p className="text-lg">
                                        Stay on top of your investments with our
                                        real-time stock checker. Get detailed
                                        insights and make informed decisions.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 px-8">
                                    <h3 className="text-2xl font-semibold">
                                        Diversify Your Portfolio
                                    </h3>
                                    <p className="text-lg">
                                        Explore new investment opportunities and
                                        diversify your portfolio with our expert
                                        recommendations and analysis.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 px-8">
                                    <h3 className="text-2xl font-semibold">
                                        Monitor Market Trends
                                    </h3>
                                    <p className="text-lg">
                                        Keep an eye on market trends and stay
                                        updated with the latest financial news
                                        to make informed investment decisions.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
