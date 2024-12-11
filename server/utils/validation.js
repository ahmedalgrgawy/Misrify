export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const validateCollegeEmail = (email) => {
    return email.endsWith("@cis.dmu.edu.eg");
}