export const getAllCategories = async (req, res) => {
    const Categories = await Category.find().exec();

    if (!Categories || Categories.length === 0) {
        return res.status(404).json({ success: false, message: "No Categories Found" })
    }

    res.status(200).json({ success: true, Categories })
}