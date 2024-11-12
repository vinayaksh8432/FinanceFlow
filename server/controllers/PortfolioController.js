const Portfolio = require("../model/portfolio");

exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ customerId: req.user.id });

        if (!portfolio) {
            return res.status(200).json({
                success: true,
                data: {
                    currentValue: 0,
                    holdings: [],
                    totalInvestment: 0,
                    totalProfitLoss: 0,
                },
            });
        }

        res.status(200).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch portfolio data",
            error: error.message,
        });
    }
};

exports.addStock = async (req, res) => {
    try {
        const {
            symbol,
            companyName,
            quantity,
            currentPrice,
            averagePrice,
            investmentValue,
            currentValue,
            profitLoss,
            profitLossPercentage,
        } = req.body;

        // Validate required fields
        if (!symbol || !companyName || !quantity || !currentPrice) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                details: {
                    symbol: !symbol ? "Symbol is required" : null,
                    companyName: !companyName
                        ? "Company name is required"
                        : null,
                    quantity: !quantity ? "Quantity is required" : null,
                    currentPrice: !currentPrice
                        ? "Current price is required"
                        : null,
                },
            });
        }

        // Find or create portfolio for the user
        let portfolio = await Portfolio.findOne({ customerId: req.user.id });

        if (!portfolio) {
            portfolio = new Portfolio({
                customerId: req.user.id,
                holdings: [],
                totalInvestment: 0,
                currentValue: 0,
                totalProfitLoss: 0,
            });
        }

        // Check if stock already exists
        const existingStockIndex = portfolio.holdings.findIndex(
            (holding) => holding.symbol === symbol
        );

        if (existingStockIndex !== -1) {
            // Update existing holding
            const existingHolding = portfolio.holdings[existingStockIndex];
            const totalQuantity = existingHolding.quantity + quantity;
            const newAveragePrice =
                (existingHolding.averagePrice * existingHolding.quantity +
                    currentPrice * quantity) /
                totalQuantity;

            portfolio.holdings[existingStockIndex] = {
                ...existingHolding,
                quantity: totalQuantity,
                averagePrice: newAveragePrice,
                currentPrice,
                investmentValue: totalQuantity * newAveragePrice,
                currentValue: totalQuantity * currentPrice,
                profitLoss: (currentPrice - newAveragePrice) * totalQuantity,
                profitLossPercentage:
                    ((currentPrice - newAveragePrice) / newAveragePrice) * 100,
                lastUpdated: new Date(),
            };
        } else {
            // Add new holding
            portfolio.holdings.push({
                symbol,
                companyName,
                quantity,
                averagePrice,
                currentPrice,
                investmentValue,
                currentValue,
                profitLoss,
                profitLossPercentage,
                lastUpdated: new Date(),
            });
        }

        // Update portfolio totals
        portfolio.totalInvestment = portfolio.holdings.reduce(
            (sum, holding) => sum + holding.investmentValue,
            0
        );
        portfolio.currentValue = portfolio.holdings.reduce(
            (sum, holding) => sum + holding.currentValue,
            0
        );
        portfolio.totalProfitLoss =
            portfolio.currentValue - portfolio.totalInvestment;
        portfolio.lastUpdated = new Date();

        // Save the updated portfolio
        await portfolio.save();

        res.status(200).json({
            success: true,
            message: "Stock added to portfolio successfully",
            data: portfolio,
        });
    } catch (error) {
        console.error("Error adding stock to portfolio:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add stock to portfolio",
            error: error.message || "Internal server error",
            details: error.errors
                ? Object.keys(error.errors).reduce((acc, key) => {
                      acc[key] = error.errors[key].message;
                      return acc;
                  }, {})
                : null,
        });
    }
};
