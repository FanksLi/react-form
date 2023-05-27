

export interface FormType {
    getFieldValue: (name: string) => void,
    setFieldValue: (naem: string, value: any) => void,
    boundField: (name: string, options: BoundOptionType) => void,
    getFieldError: (name: string) => string | undefined,
    getFormData: () => any,
}

export interface FieldType {
    value: any,
    subscribe: () => void,
    message: string | null,
    rules: any[] | undefined,
    node: Element | null,
}


export interface BoundOptionType {
    subscribe: () => void;
    rules?: any[];
    node?: Element;
}