import {useCallback, useReducer} from 'react';
import { mapObject } from './utils';

type BaseFormState = Record<string | number | symbol, any>

type SimpleFormFieldValidator = (value: any) => boolean;
export type SimpleFormValidator<Form extends BaseFormState> = (value: any, fullForm: Form) => boolean;
export type SimpleFormValidators<Form extends BaseFormState> = Partial<{ [K in keyof Form]: RegExp | SimpleFormValidator<Form> | undefined }>

const PASS = () => true;

const toValidator = <Form extends BaseFormState>(validationMethod: RegExp | SimpleFormValidator<Form> | undefined) => {
    if (typeof validationMethod === 'undefined') return PASS;
    if (validationMethod instanceof RegExp) return (text: any) => typeof text === 'string' && validationMethod.test(text);
    return validationMethod;
}


enum UpdateType {
    Field = 'field',
    Whole = 'whole',
}

function reduceFromState<FormState extends BaseFormState, K extends keyof FormState>(state: FormState, payload: { type: UpdateType.Field, field: K, value: FormState[K]} | { type: UpdateType.Whole, state: FormState}): FormState {
    if (payload.type === UpdateType.Field) {
        return {
            ...state,
            [payload.field]: payload.value,
        }
    } else {
        return {
            ...payload.state,
        }
    }
}

export type SimpleFormManager<Form extends BaseFormState> = {
    [K in keyof Form]: {
        value: Form[K],
        set: (newValue: Form[K]) => void,
        isValid: boolean,
        validate: SimpleFormFieldValidator,
    }
}

export const useSimpleForm = <Form extends BaseFormState>(defaultState: Form, validators: SimpleFormValidators<Form> = {}) => {
    const [state, dispatch] = useReducer(reduceFromState, defaultState);

    const manager = mapObject<Form, SimpleFormManager<Form>>(state as Form, (key, value) => {
        const validator = toValidator(validators[key]);
        return {
            value: value,
            isValid: validator(value, state),
            validate: (testValue: any) => validator(testValue, state),
            set: (nextValue: typeof value) => {
                dispatch({ type: UpdateType.Field, field: key, value: nextValue });
            }
        }
    })
    const isValid = Object.values(manager).every(field => field.isValid);

    const setAll = useCallback((newState: Form) => {
        dispatch({ type: UpdateType.Whole, state: newState })
    }, [dispatch]);

    return {
        state,
        manager,
        isValid,
        set: setAll,
    }
}
