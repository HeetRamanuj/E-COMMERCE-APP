const productSchemaModel = require('../models/Products/productSchema')


const check_product_id = async(req, res, next) => {

    console.log("In Middleware");
    const product_id = req.params.key;

    if (!product_id) {
        console.log("prodduct_id not found...")
        return res.status(403).send("A Product ID is require for Deletion...")
    }

    try {

        const check_product_id = await productSchemaModel.findOne({
            product_id: product_id
        })

        if (product_id !== null) {

            console.log("\t \n try === \n", check_product_id);

        } else {
            return res.status(401).send("ELSE :- Product Id Is Not Found...")
        }

    } catch (error) {
        console.log("error");
        return res.status(401).send("Product Id Is Not Found...")
    }

    return next()

}

module.exports = check_product_id