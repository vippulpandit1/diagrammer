import React from "react";
import { RectGlyph } from "./type/basic/RectGlyph";
import { CircleGlyph } from "./type/basic/CircleGlyph";
import { AndGateGlyph } from "./type/logic/AndGateGlyph";
import { OrGateGlyph } from "./type/logic/OrGateGlyph";
import { NotGateGlyph } from "./type/logic/NotGateGlyph";
import { MultiPortGlyph } from "./type/basic/MultiPortGlyph";
import { NandGateGlyph } from "./type/logic/NandGateGlyph";
import { NorGateGlyph } from "./type/logic/NorGateGlyph";
import { XorGateGlyph } from "./type/logic/XorGateGlyph";
import { XnorGateGlyph } from "./type/logic/XnorGateGlyph";
import { UMLClassGlyph } from "./type/uml/UMLClassGlyph";
import { UMLInterfaceGlyph } from "./type/uml/UMLInterfaceGlyph";
import { UMLAbstractGlyph } from "./type/uml/UMLAbstractGlyph";
import { UMLEnumGlyph } from "./type/uml/UMLEnumGlyph";
import { UMLPackageGlyph } from "./type/uml/UMLPackageGlyph";
import { UMLAssociationGlyph } from "./type/uml/UMLAssociationGlyph";
import { UMLInheritanceGlyph } from "./type/uml/UMLInheritanceGlyph";
import type { UMLAttr } from "./type/uml/UMLAttr";
import type { UMLMethod } from "./type/uml/UMLMethod";
import { DebugGlyph } from "./type/util/DebugGlyph";
import type { Glyph } from "./Glyph";
// import other glyphs as needed

export function GlyphRenderer({ type, size, height, label, orinLabel, isTruncated, attributes, methods, hasConnections, glyph }: { type: string; size: number; height?: number; label?: string; orinLabel?: string; isTruncated?: boolean; attributes?: UMLAttr[]; methods?: UMLMethod[]; hasConnections?: boolean, glyph?: Glyph }) {
  switch (type) {
    case "rect":
      return <RectGlyph size={size} />;
    case "circle":
      return <CircleGlyph size={size} />;
    case "and":
      return <AndGateGlyph width={size} height={height} glyph={glyph}/>;
    case "or":
      return <OrGateGlyph width={size} height={height} />;
    case "not":
      return <NotGateGlyph width={size} height={height} />;
    case "multi":
      return <MultiPortGlyph size={size} />;
    case "nand":
      return <NandGateGlyph width={size} height={height} />;
    case "nor":
      return <NorGateGlyph width={size} height={height} />;
    case "xor":
      return <XorGateGlyph width={size} height={height} />;
    case "xnor":
      return <XnorGateGlyph width={size} height={height} />;
    case "uml-class":
      return <UMLClassGlyph width={size} height={height} label={label} orinLabel={orinLabel} isTruncated={isTruncated} attributes={attributes} methods={methods}/>;
    case "uml-interface":
      return <UMLInterfaceGlyph size={size} />;
    case "uml-abstract":
      return <UMLAbstractGlyph size={size} />;
    case "uml-enum":
      return <UMLEnumGlyph size={size} />;
    case "uml-package":
      return <UMLPackageGlyph size={size} />;
    case "uml-association":
      return <UMLAssociationGlyph size={size} />;
    case "uml-inheritance":
      return <UMLInheritanceGlyph size={size} />;
    case "debug":
      return <DebugGlyph size={size}  height={height} hasConnections={hasConnections} />;
 
    default:
      return null;
  }
}