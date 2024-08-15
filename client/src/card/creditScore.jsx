import React from "react";

const CreditScore = () => {
    const score = 780;
    const minScore = 300;
    const maxScore = 850;
    const ranges = [
        { min: 300, max: 579, color: "#FF4136", label: "Poor" },
        { min: 580, max: 669, color: "#FF851B", label: "Fair" },
        { min: 670, max: 739, color: "#FFDC00", label: "Good" },
        { min: 740, max: 799, color: "#2ECC40", label: "Very Good" },
        { min: 800, max: 850, color: "#0074D9", label: "Excellent" },
    ];

    const svgWidth = 300;
    const svgHeight = 170;
    const centerX = svgWidth / 2;
    const centerY = svgHeight - 10;
    const radius = 140;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    const scoreToAngle = (score) => {
        const scorePercent = (score - minScore) / (maxScore - minScore);
        return startAngle + scorePercent * (endAngle - startAngle);
    };

    const angleToCoordinates = (angle) => {
        return [
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle),
        ];
    };

    const createArc = (startAngle, endAngle) => {
        const [startX, startY] = angleToCoordinates(startAngle);
        const [endX, endY] = angleToCoordinates(endAngle);
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    const arcs = ranges.map((range) => ({
        ...range,
        startAngle: scoreToAngle(range.min),
        endAngle: scoreToAngle(range.max),
    }));

    const pointerAngle = scoreToAngle(score);
    const [pointerX, pointerY] = angleToCoordinates(pointerAngle);

    return (
        <div className="flex flex-col items-center w-2/3 gap-4 border border-gray-200 rounded-3xl p-5 shadow-sm bg-white">
            <h1 className="text-2xl font-bold">Credit Score</h1>
            <svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            >
                {arcs.map((arc, i) => (
                    <path
                        key={i}
                        d={createArc(arc.startAngle, arc.endAngle)}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth="20"
                    />
                ))}
                <path
                    d={`M ${centerX - 10} ${centerY} L ${
                        centerX + 10
                    } ${centerY} L ${pointerX} ${pointerY} Z`}
                    fill="black"
                />
                <circle
                    cx={centerX}
                    cy={centerY}
                    r="8"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
            <div className="text-sm text-gray-600">
                Your credit score: {score}
            </div>
        </div>
    );
};

export default CreditScore;
