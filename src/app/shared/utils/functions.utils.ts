const isNullOrUndefined = (value: any) : boolean => {
    return value === null || value === undefined;
}

const isFormValue = (value: any) : boolean => {
    return typeof value === 'string';
}

export {
    isNullOrUndefined,
    isFormValue,
};