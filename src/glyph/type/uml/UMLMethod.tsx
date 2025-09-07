import type { UMLAttr } from "./UMLAttr";

export interface UMLMethod {
    name: string; // The name of the method.
    parameters?: UMLAttr[]; // A list of parameters that the method takes, each defined by an UMLAttr object.
    returnType: String; // The return type of the method, which can be a primitive
    visibility: string; // Controls the accessibility of the attribute from other parts of the system using symbols like + (public), - (private), # (protected), or ~ (package). 
    stereotype?: string; // A way to classify or categorize the method, often used to indicate special behavior or characteristics.
    isAbstract?: boolean; // Indicates if the method is abstract, meaning it must be implemented by subclasses.
    isStatic?: boolean; // Indicates if the method belongs to the class itself rather than to instances of the class.
    isFinal?: boolean; // Specifies if the method cannot be overridden by subclasses.
    isConstructor?: boolean; // Indicates if the method is a constructor, which is used to create instances of the class.
    documentation?: string; // A brief description or comment about the method's purpose or usage.
    constraints?: string; // Any rules or conditions that the
    
}