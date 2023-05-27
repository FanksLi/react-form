import { Map, fromJS } from 'immutable';
import { FormType, FieldType, BoundOptionType } from './types';

export default class CreateForm {
    form: Map<string, any>;
    constructor() {
        this.form = Map({});
    }
    getFieldValue = (name: string): any => {
        if (this.form.has(name)) {
            const value = this.form.getIn([name, 'value']);
            return value;
        }
        return null
    }

    setFieldValue = (name: string, value: any) => {
        if (this.form.has(name)) {
            this.form = this.form.setIn([name, 'value'], value);
            const subscribe = this.form.getIn([name, 'subscribe']) as Function;
            subscribe();
            return this.form.getIn([name, value]);
        }
        console.error(`not find ${name} key`);
    }

    boundField = (name: string, options: BoundOptionType): void => {
        const { subscribe, rules = [], node = null } = options;
        const field: FieldType = {
            value: undefined,
            message: null,
            subscribe,
            rules,
            node,
        };
        this.form = this.form.set(name, fromJS(field));
    }

    verifyField = (name: string): boolean => {
        const field: FieldType = this.form.get(name).toJS();
        const { value, rules = [], subscribe, message } = field;

        for (let i = 0; i < rules.length; i++) {
            const item: any = rules[i];
            if (item.required) {
                if(this.isEmpty(value)) {
                    this.form = this.form.setIn([name, 'message'], item.message);
                    subscribe();
                    return false;
                } else if(!this.isEmpty(value) && message) {
                    this.form = this.form.setIn([name, 'message'], undefined);
                    subscribe();
                }
            } 
        }
        return true;
    }
    isEmpty = (value: any): boolean => {
        if (typeof value === 'string' && !value.trim()) {
            return true;
        } else if(value === undefined || value === null) {
            return true;
        }
        return false;
    }
    getFieldError = (name: string): string | undefined => {
        if (this.form.has(name)) {
            const message = this.form.getIn([name, 'message']) as string | undefined;
            return message;
        }
    }
    getFormData = (): null | any => {
        const form: any = this.form.toJS();
        const keys: string[] = Object.keys(form);
        const data: any = Object.create(null);
        for (let key of keys) {
            const isVerifySucess = this.verifyField(key);
            if(isVerifySucess) {
                data[key] = form[key].value;
            } else {
                return null;
            }
        }
        return data;
    }

    getForm = (): FormType => {

        return {
            getFieldValue: this.getFieldValue,
            setFieldValue: this.setFieldValue,
            boundField: this.boundField,
            getFormData: this.getFormData,
            getFieldError: this.getFieldError,
        }
    }

}