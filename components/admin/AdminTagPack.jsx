import React, { useState } from 'react';
import * as d3 from "d3";
import { Button } from "@/components/ui/button";

export default function AdminTagPack({ width, height, tagPackData }) {
    const [refresh, setRefresh] = useState(false)

    const colors = [
        "#FFFF00",
        "#FFD700",
        "#FFA500",
        "#FF8C00",
        "#FF4500",
        "#FA8072",
        "#FF1493",
        "#FF69B4",
        "#FFB6C1",
        "#FFC0CB",
        "#FF00FF",
        "#EE82EE",
        "#DA70D6",
        "#BA55D3",
        "#9932CC"
    ];

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        var start = polarToCartesian(x, y, radius, startAngle);
        var end = polarToCartesian(x, y, radius, endAngle);
        var arcLength = endAngle - startAngle;
        if (arcLength < 0) arcLength += 360;
        var longArc = arcLength >= 180 ? 1 : 0;
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, longArc, 1, end.x, end.y
        ].join(" ");
        return d;
    }

    const hierarchy = d3
        .hierarchy(tagPackData)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

    const packGenerator = d3.pack().size([width, height]).padding(15);

    const root = packGenerator(hierarchy);

    // List of item of level 1 (just under root) & related color scale
    const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);
    var colorScale = d3
        .scaleOrdinal()
        .domain(firstLevelGroups || [])
        .range(colors);

    const dataLength = root.descendants().length
    let arrCircles = []
    for (let i = 0; i < dataLength; i++) {
        const circle = root
            .descendants()
            .filter((node) => node.depth === i)
            .map((node) => {
                const parentName = node.data.name;
                const arcText = describeArc(node.x, node.y, node.r - 10, -10, 270)

                return (
                    <g key={node.data.name} onClick={() => console.log(node.data)}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            stroke={colorScale(parentName)}
                            strokeWidth={1}
                            strokeOpacity={0.3}
                            fill={colorScale(parentName)}
                            fillOpacity={0.1}
                            className='hover:border-amber-200 hover:border-2 hover:fill-slate-400'
                        />
                        <path id={node.data.name} fill='none' d={arcText} />
                        <text
                            fontSize={12}
                            fontWeight={0.4}
                            key={node.data.name}
                        >
                            <textPath href={`#${node.data.name}`}>{node.data.name}</textPath>
                        </text>
                    </g>
                );
            });
        arrCircles.push(circle)
    }

    const logTagPackData = () => {
        console.log(tagPackData)
    }

    return (
        <div>
            <Button variant='secondary' onClick={() => setRefresh(!refresh)}>Refresh</Button>
            <Button variant='secondary' onClick={() => logTagPackData()}>Log data</Button>
            {refresh ?
                null :
                <svg width={width} height={height} style={{ display: "inline-block" }}>
                    {arrCircles.map((data, index) => { return arrCircles[index] })}
                </svg>
            }

        </div>
    );
};
