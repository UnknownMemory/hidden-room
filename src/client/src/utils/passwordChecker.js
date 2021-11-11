const passwordChecker = (password) => {
    const regex = new RegExp(/^(?=.*\d).{8,20}$/);

    if (password.length > 0) {
        if (regex.test(password)) {
            return true;
        }
        return false;
    };
};

export default passwordChecker;