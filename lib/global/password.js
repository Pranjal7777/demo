export const validatePasswordField = (password) => {
    const pass_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$-/:-?{-~!"^_`\[\]])[A-Za-z0-9@#$-/:-?{-~!"^_`\[\]]{6,}$/;
    if (pass_pattern.test(password)) return true;
    return false;
};

export const greaterThanSixDigit = (password) => {
    const greaterThanSixDigit_pattern = /^[0-9a-zA-Z$&+,:;=?@#|'<>.^*()%!-_]{6,}$/;
    if (greaterThanSixDigit_pattern.test(password)) return true;
    return false;
};

export const numericValue = (password) => {
    const numericValue_pattern = /[0-9]/;
    if (numericValue_pattern.test(password)) return true;
    return false;
};

export const uppercaseCharacter = (password) => {
    const uppercaseCharacter_pattern = /[A-Z]/;
    if (uppercaseCharacter_pattern.test(password)) return true;
    return false;
};

export const lowercaseCharacter = (password) => {
    const lowercaseCharacter_pattern = /[a-z]/;
    if (lowercaseCharacter_pattern.test(password)) return true;
    return false;
};

export const specialCharacter = (password) => {
    const specialCharacter_pattern = /[$&+,:;=?@#|'<>.^*()%!-]/;
    if (specialCharacter_pattern.test(password)) return true;
    return false;
};
