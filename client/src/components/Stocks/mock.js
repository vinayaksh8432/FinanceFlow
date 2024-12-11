function getRandomValue(base, variance) {
    return (base + (Math.random() - 0.5) * variance).toFixed(2);
}

function generateRandomStockData(baseValues) {
    // Get current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Generate timestamps for the last 5 days
    const timestamps = Array.from(
        { length: 5 },
        (_, i) => currentTimestamp - i * 24 * 60 * 60
    ).reverse(); // Reverse to get from oldest to newest

    return {
        c: baseValues.map((value) => getRandomValue(value, 5)),
        h: baseValues.map((value) => getRandomValue(value, 5)),
        l: baseValues.map((value) => getRandomValue(value, 5)),
        o: baseValues.map((value) => getRandomValue(value, 5)),
        s: "ok",
        t: timestamps,
        v: baseValues.map(() => Math.floor(Math.random() * 50000000)),
    };
}

export const mockSearchResults = {
    count: 6,
    result: [
        {
            description: "RELIANCE INDUSTRIES LTD",
            displaySymbol: "RELIANCE.NS",
            symbol: "RELIANCE.NS",
        },
        {
            description: "TATA CONSULTANCY SERVICES LTD",
            displaySymbol: "TCS.NS",
            symbol: "TCS.NS",
        },
        {
            description: "HDFC BANK LTD",
            displaySymbol: "HDFCBANK.NS",
            symbol: "HDFCBANK.NS",
        },
        {
            description: "INFOSYS LTD",
            displaySymbol: "INFY.NS",
            symbol: "INFY.NS",
        },
        {
            description: "ADANI ENTERPRISES LTD",
            displaySymbol: "ADANIENTER.NS",
            symbol: "ADANIENTER.NS",
        },
        {
            description: "STATE BANK OF INDIA",
            displaySymbol: "SBIN.NS",
            symbol: "SBIN.NS",
        },
    ],
};

export const mockCompanyDetails = {
    "RELIANCE.NS": {
        country: "IN",
        currency: "INR",
        exchange: "NSE",
        ipo: "1977-11-25",
        marketCapitalization: 1900000,
        name: "Reliance Industries Ltd",
        phone: "+91 22 3555 5000",
        shareOutstanding: 6250.48,
        ticker: "RELIANCE.NS",
        weburl: "https://www.ril.com/",
        logo: "https://upload.wikimedia.org/wikipedia/hi/9/99/Reliance_Industries_Logo.svg",
        finnhubIndustry: "Conglomerate",
    },
    "TCS.NS": {
        country: "IN",
        currency: "INR",
        exchange: "NSE",
        ipo: "2004-07-25",
        marketCapitalization: 1450000,
        name: "Tata Consultancy Services Ltd",
        phone: "+91 22 6778 9595",
        shareOutstanding: 4375.22,
        ticker: "TCS.NS",
        weburl: "https://www.tcs.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
        finnhubIndustry: "IT Services",
    },
    "HDFCBANK.NS": {
        country: "IN",
        currency: "INR",
        exchange: "NSE",
        ipo: "1995-11-01",
        marketCapitalization: 1250000,
        name: "HDFC Bank Ltd",
        phone: "+91 22 6716 1602",
        shareOutstanding: 2962.44,
        ticker: "HDFCBANK.NS",
        weburl: "https://www.hdfcbank.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
        finnhubIndustry: "Banking",
    },
    "INFY.NS": {
        country: "IN",
        currency: "INR",
        exchange: "NSE",
        ipo: "1993-02-17",
        marketCapitalization: 1100000,
        name: "Infosys Ltd",
        phone: "+91 80 2852 0261",
        shareOutstanding: 4375.22,
        ticker: "INFY.NS",
        weburl: "https://www.infosys.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        finnhubIndustry: "IT Services",
    },
    "ADANIENTER.NS": {
        country: "IN",
        currency: "INR",
        exchange: "NSE",
        ipo: "1988-11-01",
        marketCapitalization: 1300000,
        name: "Adani Enterprises Ltd",
        phone: "+91 79 2656 5555",
        shareOutstanding: 3962.44,
        ticker: "ADANIENTER.NS",
        weburl: "https://www.adanienterprises.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Adani_logo_2012.svg",
        finnhubIndustry: "Conglomerate",
    },
    "SBIN.NS": {
        country: "IN",
        currency: "INR",
        exchange: "NSE",
        ipo: "1955-06-01",
        marketCapitalization: 1500000,
        name: "State Bank of India",
        phone: "+91 22 2289 3434",
        shareOutstanding: 5962.44,
        ticker: "SBIN.NS",
        weburl: "https://www.onlinesbi.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg",
        finnhubIndustry: "Banking",
    },
};

export const mockStockQuote = {
    "RELIANCE.NS": {
        c: getRandomValue(2635.74, 50),
        h: getRandomValue(2663.31, 50),
        l: getRandomValue(2608.68, 50),
        o: getRandomValue(2621.07, 50),
        pc: getRandomValue(2594.45, 50),
        t: 1582641000,
    },
    "TCS.NS": {
        c: getRandomValue(3425.59, 50),
        h: getRandomValue(3451.12, 50),
        l: getRandomValue(3408.87, 50),
        o: getRandomValue(3412.23, 50),
        pc: getRandomValue(3387.76, 50),
        t: 1582641000,
    },
    "HDFCBANK.NS": {
        c: getRandomValue(1674.45, 30),
        h: getRandomValue(1691.11, 30),
        l: getRandomValue(1668.82, 30),
        o: getRandomValue(1670.06, 30),
        pc: getRandomValue(1659.93, 30),
        t: 1582641000,
    },
    "INFY.NS": {
        c: getRandomValue(1487.45, 30),
        h: getRandomValue(1499.11, 30),
        l: getRandomValue(1482.82, 30),
        o: getRandomValue(1487.06, 30),
        pc: getRandomValue(1485.93, 30),
        t: 1582641000,
    },
    "ADANIENTER.NS": {
        c: getRandomValue(1945.45, 50),
        h: getRandomValue(1959.11, 50),
        l: getRandomValue(1944.82, 50),
        o: getRandomValue(1945.06, 50),
        pc: getRandomValue(1943.93, 50),
        t: 1582641000,
    },
    "SBIN.NS": {
        c: getRandomValue(575.45, 20),
        h: getRandomValue(579.11, 20),
        l: getRandomValue(574.82, 20),
        o: getRandomValue(575.06, 20),
        pc: getRandomValue(573.93, 20),
        t: 1582641000,
    },
};

export const mockHistoricalData = {
    "RELIANCE.NS": generateRandomStockData([
        2517.68, 2521.03, 2519.89, 2523.45, 2525.12,
    ]),
    "TCS.NS": generateRandomStockData([
        3312.45, 3315.67, 3314.22, 3317.89, 3319.56,
    ]),
    "HDFCBANK.NS": generateRandomStockData([
        1612.34, 1614.56, 1613.89, 1616.22, 1617.45,
    ]),
    "INFY.NS": generateRandomStockData([
        1412.45, 1415.67, 1414.22, 1417.89, 1419.56,
    ]),
    "ADANIENTER.NS": generateRandomStockData([
        1912.45, 1915.67, 1914.22, 1917.89, 1919.56,
    ]),
    "SBIN.NS": generateRandomStockData([
        512.45, 515.67, 514.22, 517.89, 519.56,
    ]),
};
