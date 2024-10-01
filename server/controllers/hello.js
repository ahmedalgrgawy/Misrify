export const helloFun = (req, res) => {
    console.log("Hello From Controller (^~^)");
    return res.status(200).json(`Hello From Controller (^~^)`)
}