import React from "react";
export interface UMLAttr {
    name: string; // The name of the attribute.
    type: string; // Can be primitive types (like String, Integer, Boolean) or self-defined types. 
    visibility: string; // Controls the accessibility of the attribute from other parts of the system using symbols like + (public), - (private), # (protected), or ~ (package). 
    multiplicity?: string; //Specifies the number of instances of the attribute, such as one, zero or one, or a range of values. 
    defaultValue?: string; // Provides an initial value for the attribute when an instance of the class is created. 
    documentation?: string; // A brief description or comment about the attribute's purpose or usage. 
    constraints?: string; // Any rules or conditions that the attribute must adhere to, such as
    isStatic?: boolean; // Indicates if the attribute belongs to the class itself rather than to instances of the class.
    isReadOnly?: boolean; // Specifies if the attribute can be modified after its initial assignment.
    isDerived?: boolean; // Indicates if the attribute's value is computed from other attributes rather than being stored directly.
}