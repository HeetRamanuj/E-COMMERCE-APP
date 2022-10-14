const express = require("express");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");
const router = express.Router();
// router.use(express.json())

router.use(
  bodyParser.json({
    extended: true,
  })
);
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const userSchemaModel = require("../../models/Users/userSchema");

const productSchemaModel = require("../../models/Products/productSchema");

const cartSchemaModel = require("../../models/Products/cartSchema");

const categorySchemaModel = require("../../models/Category/categorySchema");

const orderSchemaModel = require("../../models/Orders/orderSchema");

router.get("/", (req, res) => {
  console.log("User Root");
  return res.json({
    data: "User Root",
  });
});

router.post("/SignIn", async (req, res) => {
  console.log("Usres Sign In");

  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email.length > 0 && password.length > 0) {
      // const data = await userSchemaModel.findOne({
      //     email: email,
      //     password: password,
      // });

      const data = await userSchemaModel.findOne({
        email: email,
        password: password,
      });

      console.log("login create token");
      console.log(req.body);

      // Access Token...

      const token = JWT.sign(
        { user_id: data._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      data.token = token;
      console.log(token);

      // Refresh Token...

      const refreshToken = JWT.sign(
        { user_id: data._id, email },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: "3h",
        }
      );

      data.refreshToken = refreshToken;
      console.log(refreshToken);

      const result = [
        {
          email: data.email,
          password: data.password,
        },
      ];

      console.table(result);

      return res.json({
        data: data,
        token: token,
        refreshToken: refreshToken,
        message: "Log In Successfull....",
      });
    } else {
      console.log("Error : Invalid Data...");
      return res.status(401).json({ message: "Invalid Data IF..." });
    }
  } catch (error) {
    console.log("Error : Invalid Data...");
    return res.status(401).json({ message: "Invalid Data..." });
  }

  // return res.json({
  //     data: "User Sign In"
  // });
});

router.post("/signUp", async (req, res) => {
  console.log("Users Sign Up");

  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  console.table(req.body);

  try {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;

    console.log("\n ==================== \n in \n ==================== \n");

    const oldUser = await userSchemaModel.findOne({ email: email });

    console.log(oldUser);

    if (oldUser !== null) {
      console.log("OLD USER");
      return res.send({
        data: "Error :- User Already Exist...",
        ecode: 401,
      });
    } else {
      console.log("**** Creating User ****");

      const data = await userSchemaModel.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        address: null,
        dob: null,
        phone: null,
      });

      // Create Token...

      console.log("**** Creating Token ****");

      const token = JWT.sign(
        { user_id: data._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      data.token = token;

      console.log("\n token = \n ", token, "\n ");

      const result = [
        {
          name: data.name,
          email: data.email,
          password: data.password,
          TOKEN: token,
        },
      ];

      console.log("Createting User...");
      console.table(result);

      console.log("-------------------------------------------");

      return res.json({
        data: data,
        token: token,
        message: "Sign Up Successfullll....",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("catchhhh ===== ");
    return res.status(401).json({ message: "Email Must Be Unique..." });
  }

  // return res.json({
  //     data: "User Sign Up"
  // });
});

router.get("/getAllCategory", async (req, res) => {
  console.log("Display Category Root");

  try {
    const data = await categorySchemaModel.find();

    if (data !== null) {
      const result = [
        {
          Email: data[0].email,
          "Cat ID": data[0].category_id,
          "Cat Name": data[0].category_name,
        },
      ];

      data.forEach((i) => {
        result.push({
          Email: i.email,
          "Cat ID": i.category_id,
          "Cat Name": i.category_name,
        });
      });

      console.table(result);

      return res.json({
        message: "Display Category...",
        data: data,
      });
    } else {
      return res.json({
        message: "Category Not Found...",
        error: error,
      });
    }
  } catch (error) {
    return res.json({
      message: "Error While Display Category...",
      error: error,
    });
  }

  // return res.json({
  //     data: "Display Category Root"
  // });
});

// USER DETAILS...

router.get("/myProfile/:current_user", async (req, res) => {
  console.log("\t \n My Profile");

  const email = req.params.current_user;

  const data = await userSchemaModel.findOne({
    email: email,
  });

  console.log(data);

  if (data !== null) {
    return res.json({
      message: "Profile Data",
      data: data,
    });
  } else {
    return res.json({
      message: "Can't Find Profile Data",
    });
  }
});

// Update Profile...

router.put("/updateProfile/:email", async (req, res) => {
  console.log("User Profile Update...");

  const email = req.params.email;
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const dob = req.body.dob;

  console.table(req.body);

  try {
    const chechUsre = await userSchemaModel.findOne({
      email: email,
    });

    console.log(chechUsre);

    if (chechUsre === null) {
      return res.json({
        message: "Error : Something Went Wrong...",
      });
    } else {
      const updateProfile = await userSchemaModel.findOneAndUpdate(
        { email: email },
        { name: name, address: address, phone: phone, dob: dob },
        { new: true }
      );

      console.log(updateProfile);

      return res.json({
        data: req.body,
        data1: updateProfile,
        message: "User Profile Updated Successfully...",
      });
    }

    // return res.json({
    //     message: "Profile Updated Successfully..."
    // })
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error : Something Went Wrong...",
      error: error,
    });
  }

  // return res.json({
  //     data: "User Profile Update"
  // })
});

// DISPLAY PRODUCT...

router.get("/displayProducts", async (req, res) => {
  console.log("\n Display Product...");

  try {
    const data = await productSchemaModel.find();

    // const result = [{
    //     "Email": email,
    //     "Cat ID": category_id,
    //     "Product ID": product_id,
    //     "Product Name": product_name,
    //     "Product Description": product_description,
    //     "Product Price": product_price,
    //     "Product Image": product_image,
    // }];

    // data.forEach(i => {
    //     result.push({
    //         "Email": i.email,
    //         "Cat ID": i.category_id,
    //         "Product ID": i.product_id,
    //         "Product Name": i.product_name,
    //         "Product Description": i.product_description,
    //         "Product Price": i.product_price,
    //         "Product Image": i.product_image,
    //     })
    // })

    // console.table(result)

    return res.json({
      message: "Display All Products...",
      data: data,
    });
  } catch (error) {
    console.table(error);
    return res.json({
      message: "Error While Displaying Products........",
    });
  }
});

// DISPLAY PRODUCT BY CATEGORY...

router.get("/displayByCategory/:category_id", async (req, res) => {
  console.log("\n Display Product...");

  try {
    const category_id = req.params.category_id;

    const getCatId = await categorySchemaModel.find({
      category_id: category_id,
    });

    if (getCatId.length == 0) {
      return res.json({
        message: "Error: - Catgory Not Found...",
      });
    } else {
      const data = await productSchemaModel.find({
        category_id: category_id,
      });

      return res.json({
        message: "Display All Products...",
        data: data,
      });
    }
  } catch (error) {
    console.table(error);
    return res.json({
      message: "Error While Displaying Products........",
    });
  }
});

// Display Product Details...

router.get("/displayProductsDetails/:key", async (req, res) => {
  console.log("\t \n Display Product Details...");

  const product_id = req.params.key;

  if (!product_id) {
    return res.status(201).json({
      message: "Product Id Not getted...",
    });
  } else {
    const data = await productSchemaModel.findOne({ product_id: product_id });

    console.log(data);

    return res.json({
      message: "Product Id getted...",
      data: data,
    });
  }

  // return res.send("Display Product Data")
});

// CART...

router.post("/addToCart", async (req, res) => {
  console.log("\t \n Add To Cart... ");

  const email = req.body.current_email;
  const browserId = req.body.browserId;

  const category_id = req.body.categoryId;
  const product_id = req.body.productId;

  console.table(email);
  console.table(req.body);

  if (!browserId) {
    return res.json({
      message: "browserId not found...",
    });
  } else {
    const data = await cartSchemaModel.create({
      email: email,
      browserId: browserId,
      category_id: category_id,
      product_id: product_id,
      productQty: 1,
    });

    console.log(data);

    return res.json({
      message: "Add TO Cart",
      data: data,
    });
  }
});

// Display Cart Product...

router.get("/cartProducts/:current_email", async (req, res) => {
  console.log("\t \n Cart Product... ");

  const email = req.params.current_email;

  const data = await cartSchemaModel.find({
    email: email,
  });
  console.log("data ", data);

  const arr = [];

  data.map((i) => {
    console.log(i.product_id);
    arr.push(i.product_id);
  });

  console.log(arr);

  const productData = await productSchemaModel.find({
    product_id: {
      $in: arr,
    },
  });

  console.log("=============== ", productData);

  return res.json({
    message: "Add TO Cart",
    data1: data,
    productData: productData,
  });
});

router.put("/asignCartToUser/:browserId", async (req, res) => {
  const browserId = req.params.browserId;
  const email = req.body.email;

  try {
    const assignCartProducts = await cartSchemaModel.updateMany(
      { browserId: browserId },
      { email: email },
      { new: true }
    );

    return res.json({
      message: "Assign Cart Products TO User...",
      assignCartProducts: assignCartProducts,
    });
  } catch (error) {
    return res.json({
      message: "ERROR : Error While Assigning Cart Products TO User...",
      error: error,
    });
  }
});

// DELETE CART PRODUCT...

router.delete("/cartDeleteProduct/:current_user/:key", async (req, res) => {
  console.log("\t \n Delete Cart Product");

  const email = req.params.current_user;
  const product_id = req.params.key;

  const getProduct = await cartSchemaModel.findOne({
    email: email,
    product_id: product_id,
  });

  console.log(getProduct);

  if (getProduct !== null) {
    const data = await cartSchemaModel.findOneAndDelete({
      email: email,
      product_id: product_id,
    });
    console.log(data);

    return res.json({
      message: "Delete Cart Product...",
      data: getProduct,
      deleteProduct: data,
    });
  } else {
    return res.json({
      message: "Product Not Found...",
      data: getProduct,
    });
  }
});

// PLACE ORDER...

router.post("/placeOrder/:current_user", async (req, res) => {
  console.log("\t \n Place Order...");

  const email = req.params.current_user;
  const name = req.body.name;
  const delivery_address = req.body.delivery_address;
  const phone = req.body.phone;

  const pids = req.body.product_ids;

  const total_amount = req.body.total_amount;
  const order_date = req.body.order_date;
  // const product_qty = req.body.product_qty;
  const total_product_qty = req.body.total_product_qty;

  console.log(req.body);

  console.log(pids);

  if (!req.body.product_ids) {
    return res.json({
      message: "Error: Error While Place Order",
    });
  } else {
    const data = await orderSchemaModel.create({
      email: email,
      name: name,
      delivery_address: delivery_address,
      phone: phone,
      product_ids: pids,
      total_amount: total_amount,
      // product_qty: product_qty,
      total_product_qty: total_product_qty,
      order_date: order_date,
    });

    console.log(email);

    await cartSchemaModel.deleteMany({
      email: email,
    });

    console.log("\n Data : ======   ".data);

    console.log(req.body.total_amount);

    return res.json({
      message: "Place Order",
      data: data,
      data1: req.body,
    });
  }
});

// MY ORDERS...

router.get("/myOrders/:current_user", async (req, res) => {
  console.log("\t \n Order Detials");

  const email = req.params.current_user;

  const data = await orderSchemaModel.find({
    email: email,
  });

  const myid = [];

  data.forEach((i) => {
    myid.push(i.product_ids);
  });

  // console.log(data);
  //   console.log("\n\n data ================== ", myid);

  const data1 = await productSchemaModel.find({
    product_id: {
      $in: myid[0],
    },
  });

  return res.json({
    message: "My Orders...",
    data1: data,
  });
});

// GET ORDER DETAILS...

router.get("/getOrderDetails/:order_id", async (req, res) => {
  console.log("\t \n Order Detials");

  const email = req.params.current_user;
  const order_id = req.params.order_id;

  const data = await orderSchemaModel.find({
    _id: order_id,
  });

  const myid = [];

  data.forEach((i) => {
    myid.push(i.product_ids);
  });

  // console.log(data);
  //   console.log("\n\n data ================== ", myid);

  const productData = await productSchemaModel.find({
    product_id: {
      $in: myid[0],
    },
  });

  return res.json({
    message: "My Orders...",
    data: data,
    productData: productData,
  });
});

module.exports = router;
