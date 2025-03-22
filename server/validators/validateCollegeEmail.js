export const validateCollegeEmail = (email) => {
    return email.endsWith("@cis.dmu.edu.eg");
}

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);