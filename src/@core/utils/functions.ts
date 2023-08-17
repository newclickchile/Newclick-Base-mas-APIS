export type PasswordRules = {
    re: RegExp;
    label: string;
}

// export const PROHIBITED_WORDS = Config.PROHIBITED_WORDS_IN_PASS.split(",").map(word => word.trim());
// export const REGEX = new RegExp(`^(?!.*\\b\\w*(?:${PROHIBITED_WORDS.join("|")})\\w*\\b).+$`, "i");

export const createPasswordRules = (passwordRules: PasswordRules[]) => {
    const functionsObj: any = {};

    passwordRules.forEach((objeto, index) => {
        functionsObj[`f(${index})`] = (value: string) => objeto.re.test(value) || objeto.label;
    });

    return functionsObj;
}

export const validateUserOnText = (searchText: string) => (value: string) => {
    const regex = new RegExp(`^.*${searchText}.*$`, "i");

    if (regex.test(value)) {
        return "No puede contener su nombre de usuario";
    }

    if (/\s/.test(value)) {
        return "No puede contener espacios en blanco";
    }
};
