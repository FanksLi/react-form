import React, { useContext, useLayoutEffect, useReducer } from "react";
import { FormContext } from '../formContext';
import { FormType } from '../types';
import CreateForm from "../createForm";


interface FormProps {
    children: any,
    form: FormType,
    onFinish?: (formData: any) => void;
}

interface FieldProps {
    children: any,
    name?: string | undefined,
    rules?: any[] | undefined,
}
export default React.forwardRef(Form);

function Form(props: FormProps, ref: any) {
    const { children, form, onFinish } = props;
    React.useImperativeHandle(ref, () => ({
        submit: onSubmit,
    }));
    function onSubmit(e: any) {
        e?.preventDefault();
        const data: any = form.getFormData();
        if(data !== null && typeof onFinish === 'function') {
            onFinish(data);
        }
    }
    return <form onSubmit={onSubmit}>
        <FormContext.Provider value={form}>
            {children}
        </FormContext.Provider>
    </form>
}

export function Field(props: FieldProps) {
    const form: FormType = useContext(FormContext);
    const [, updata] = useReducer((c) => c + 1, 0)
    const { children, name, rules } = props;

    useLayoutEffect(() => {
        if(typeof name === 'string') {
            form.boundField(name, {subscribe: updataField, rules});
        }

        return () => {
            form.unountField(name || '');
        }
    }, []);

    function updataField(): void {
        updata();
    }
    function onChange(e: any) {
        const value = e.target ?  e.target.value : e;
        // console.log(value);
        if(!name) return;
        form.setFieldValue(name, value);
    }

    const value: any = typeof name === 'string' ? form.getFieldValue(name) : '';
    const message: string | undefined = form.getFieldError(name || '');

    const el = (): React.ReactNode => {
        if(!children) return null;

        if(typeof name === 'string' && typeof children !== 'function') {
            return React.cloneElement(children, { onChange, value});
        } else if(typeof name === 'string' && typeof children === 'function') {
            return children(value, message);
        } else {
            return React.cloneElement(children);
        }
    }

    return <div>
        {el()}
        {message? <div>{message}</div> : null}
    </div>
}



export function connectForm() {
    return (WrapperElement: any) => {
        const obj: any = new CreateForm() as FormType;
        const form = obj.getForm();
        return (props: any) => {
            return <WrapperElement form={form} {...props} />
        }
    }
}

