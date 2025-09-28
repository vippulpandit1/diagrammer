import React from "react";
import type { UMLAttr } from "./UMLAttr";
import type { UMLMethod } from "./UMLMethod";

const getVisibilitySymbol = (visibility?: string) => {
  switch (visibility) {
    case "private":
      return "-";
    case "protected":
      return "#";
    case "public":
    default:
      return "+";
  }
};

export const UMLClassGlyph: React.FC<{ width: number; height?: number; label?: string; orinLabel?: string; 
            isTruncated?: boolean; attributes?: UMLAttr[]; methods?: UMLMethod[] }> = ({ width, height = width, label, orinLabel, isTruncated, attributes, methods }) => {

  // Fixed label section height (e.g. 32px)
  const LABEL_SECTION_HEIGHT = 25;
  // Attribute section starts after label section and separator
  const ATTR_START_Y = LABEL_SECTION_HEIGHT + 8;
  // Method section starts after attributes and separator
  const METHOD_START_Y = ATTR_START_Y + (attributes?.length || 0) * 20 + 8;
  
  const maxLabelChars = 5;//Math.floor(size / 10); // Estimate max chars that fit

  return (
   <g>
    <rect x={0} y={0} width={width} height={height} rx={6} fill="#fff" stroke="#222" strokeWidth={2}/>
    {/* Separator below label */}
    <line x1={0} y1={LABEL_SECTION_HEIGHT} x2={width} y2={LABEL_SECTION_HEIGHT} stroke="#222" strokeWidth={1}/>
    {/* Separator below attributes */}  
    <line x1={0} y1={ATTR_START_Y + (attributes?.length || 0) * 20} x2={width} y2={ATTR_START_Y + (attributes?.length || 0) * 20} stroke="#222" strokeWidth={1}/>
    {/* Class name */}
    {label && (
      <text
        x={width / 2}
        y={LABEL_SECTION_HEIGHT / 2}
        fontSize={width * 0.18}
        fill="#222"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ userSelect: "none", pointerEvents: "auto" }}
      >
        {label}
        {isTruncated && (
            <title>{orinLabel}</title>
        )}
      </text>
    )}
    {/* Attributes */}
    {attributes && attributes.map((attr, i) => {
    const maxAttrChars = 5;
    const isAttrTruncated = attr.name.length > maxAttrChars;
    const displayAttr = isAttrTruncated ? attr.name.slice(0, maxAttrChars - 3) + "..." : attr.name;
    
    return (
      <text
        key={i}
        x={width * 0.05}
        y={ATTR_START_Y + i * 20}
        fontSize={width * 0.13}
        fill="#222"
        textAnchor="start"
        dominantBaseline="hanging"
        style={{ userSelect: "none", pointerEvents: "auto" }}
      >
      {getVisibilitySymbol(attr.visibility)}
      {displayAttr}
      {isAttrTruncated && <title>{attr.name}</title>}
      </text>
    );
    })}
    {/* Method */}
    {methods && methods.map((method, i) => {
    const maxMethodChars = 5;
    const isMethodTruncated = method.name.length > maxMethodChars;
    const displayMethod = isMethodTruncated ? method.name.slice(0, maxMethodChars - 3) + "..." : method.name;
    
    return (
      <text
        key={i}
        x={width * 0.05}
        y={METHOD_START_Y + i * 20}
        fontSize={width * 0.13}
        fill="#222"
        textAnchor="start"
        dominantBaseline="hanging"
        style={{ userSelect: "none", pointerEvents: "auto" }}
      >
      {displayMethod}
      {isMethodTruncated && <title>{method.name}</title>}
      </text>
    );
    })}
  </g>);
};