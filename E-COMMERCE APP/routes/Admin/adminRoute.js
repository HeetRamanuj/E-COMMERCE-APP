require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");

const moment = require("moment");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "-" + Date.now());
    // cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

const imgModel = require("../../models/IMG_UPLOADS/imageSchema");

const orderSchemaModel = require("../../models/Orders/orderSchema");

const router = express.Router();
// router.use(express.json())
router.use(
  bodyParser.json({
    extended: true,
  })
);
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const adminModel = require("../../models/Admin/adminSchema");

const categorySchemaModel = require("../../models/Category/categorySchema");

const productSchemaModel = require("../../models/Products/productSchema");

const check_product_id = require("../../middlewares/delete_product");

const auth = require("../../middlewares/check_auth");
const imageModel = require("../../models/IMG_UPLOADS/imageSchema");
const { $_match } = require("@hapi/joi/lib/base");

router.get("/", (req, res) => {
  console.log("Admin Root");
  return res.json({
    data: "Admin Root",
  });
});

router.post("/adminSignUp", async (req, res) => {
  console.log("Admin Sign Up Root");

  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email.length > 0 && password.length > 0) {
      const data = await adminModel.create({
        email: email,
        password: password,
      });

      // Generate Access Token...

      const token = JWT.sign(
        {
          user_id: data._id,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1y",
        }
      );

      data.token = token;
      console.log("\n Token = ", token);

      return res.status(200).json({
        message: "Admin Logged in...",
        data: data,
        token: token,
      });
    } else {
      return res.status(401).json({
        error: "Invalid Credentials...",
      });
    }
  } catch (error) {
    return res.status(401).json({
      error: "User already exist...",
    });
  }

  // return res.json({
  //     data: "Admin Log in Root"
  // });
});

router.post("/adminSignIn", async (req, res) => {
  console.log("Admin Log in Root");
  console.log(req.body);

  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email.length > 0 && password.length > 0) {
      const data = await adminModel.findOne({
        email: email,
        password: password,
      });

      // Generate Access Token...

      const token = JWT.sign(
        {
          user_id: data._id,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1y",
        }
      );

      data.token = token;
      console.log("\n Token = ", token);

      return res.status(200).json({
        data: data,
        token: token,
        message: "Admin Logged in...",
      });
    } else {
      return res.status(401).json({
        error: "Invalid Credentials...",
      });
    }
  } catch (error) {
    return res.status(406).json({
      error: "error",
    });
  }

  // return res.json({
  //     data: "Admin Log in Root"
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

router.post("/addCategory", async (req, res) => {
  console.log("Add Category Root");

  const email = req.body.email;
  const category_id = req.body.category_id;
  const category_name = req.body.category_name;

  console.table(req.body);

  try {
    console.log("TRY");

    if (email !== null && category_id !== null && category_name !== null) {
      const oldCat = await categorySchemaModel.findOne({
        category_id: category_id,
      });
      console.log("oldCat ==== ", oldCat);

      if (oldCat !== null) {
        return res.status(201).json({
          message: "Category Already Exist...",
        });
      } else {
        const data = await categorySchemaModel.create({
          email: email,
          category_id: category_id,
          category_name: category_name,
        });

        console.log("\t \n data \n ");
        console.log(data);

        return res.json({
          message: "Category Added Successfully...",
          data: req.body,
        });
      }
    } else {
      return res.status(201).send("All Fields Are Required...");
    }
  } catch (error) {
    return res.status(401).json({
      message: "Error :- Error while adding Category...",
      error: error,
    });
  }

  // return res.json({
  //   message: "Add Category Root",
  //   data: req.body,
  // });
});

router.put("/updateCategory/:id", async (req, res) => {
  console.log("Update Category Root");

  try {
    const category_id = req.params.id;

    console.log(req.params.category_id);
    console.log(req.body);

    const category_name = req.body.category_name;

    const update_Category = await categorySchemaModel.findOneAndUpdate(
      { category_id: category_id },
      { category_name: category_name },
      { new: true }
    );

    return res.json({
      data: req.body,
      data1: update_Category,
      message: "Category Updated Successfully...",
    });
  } catch (error) {
    console.log("ERROR : Error While Updating Data...");
    return res.json({
      message: "ERROR : Error While Updating Data...",
    });
  }

  return res.json({
    data: "Update Category Root",
  });
});

router.delete("/deleteCategory/:key", async (req, res) => {
  console.log("Delete Category Root");

  try {
    const key = req.params.key;

    const cat_data = await categorySchemaModel.findOneAndDelete({
      category_id: key,
    });

    const data = await productSchemaModel.deleteMany({
      category_id: key,
    });

    const result = [
      {
        ID: cat_data._id,
        "Category ID": cat_data.category_id,
        "Category Name": cat_data.category_name,
      },
    ];

    console.table(result);

    return res.json({
      data: data,
      cat_data: cat_data,
      message: "Category => Products Deleted Successfully...",
    });
  } catch (error) {
    console.log("Error : Error While Deleting Cat -> Product");
    return res.json({
      message: "Error : Error While Deleting Cat -> Product",
    });
  }

  // return res.json({
  //     data: "Delete Category Root"
  // });
});

// Products...

// ADD PRODUCT...

router.post("/addProduct", async (req, res) => {
  console.log("Add Products...");

  const email = req.body.email;
  const category_id = req.body.category_id;
  const product_id = req.body.product_id;
  const product_name = req.body.product_name;
  const product_description = req.body.product_description;
  const product_price = req.body.product_price;
  const product_image = req.body.product_image;
  const creation_date = req.body.creation_date;

  console.table(req.body);

  const check_cat_id = await categorySchemaModel.findOne({
    category_id: category_id,
  });

  const check_pid = await productSchemaModel.findOne({
    product_id: product_id,
  });

  console.log(check_cat_id);
  console.log(check_pid);

  if (check_cat_id === null) {
    return res.status(401).json({
      message: "Error : CID Product...",
      error: "error",
    });
  } else if (check_pid !== null) {
    return res.status(401).json({
      message: "Error : pid Product...",
      error: "error",
    });
  } else {
    try {
      console.log("\t \n Creating Product...");

      const data = await productSchemaModel.create({
        email: email,
        category_id: category_id,
        product_id: product_id,
        product_name: product_name,
        product_description: product_description,
        product_price: product_price,
        product_image: product_image,
        creation_date: creation_date,
      });

      const result = [
        {
          Email: data.email,
          "Cat ID": category_id,
          "Product ID": product_id,
          "Product Name": product_name,
          "Product Description": product_description,
          "Product Price": product_price,
          "Product Image": product_image,
          "Creation Date": creation_date,
        },
      ];

      console.log("Createting Product...");
      console.table(result);

      return res.json({
        message: "Product Added Successfullll....",
        data: data,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Error : Error While Adding Product...",
        error: error,
      });
    }
  }

  // return res.json({
  //     message: "Product Added Successfully..."
  // })
});

// DISPLAY PRODUCT...

router.get("/displayProducts", async (req, res) => {
  console.log("\n Display Product...");

  try {
    const data = await productSchemaModel.find().sort({
      creation_date: -1,
    });

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
      //   token: token,
      data: data,
    });
  } catch (error) {
    console.table(error);
    return res.json({
      message: "Error While Displaying Products........",
    });
  }
});

// UPDATE PRODUCT...

router.put("/updateProduct/:id", async (req, res) => {
  console.log("Update Product Root");

  try {
    const product_id = req.params.id;

    console.log(req.params.id);
    console.log(req.body);

    const product_name = req.body.product_name;
    const product_description = req.body.product_description;
    const product_price = req.body.product_price;
    const product_image = req.body.product_image;

    // console.table(req.body);

    const update_Product = await productSchemaModel.findOneAndUpdate(
      { product_id: product_id },
      {
        $set: {
          product_name: product_name,
          product_description: product_description,
          product_price: product_price,
          product_image: product_image,
        },
      },

      { new: true }
    );

    return res.json({
      message: "Product Updated Successfully...",
      data1: update_Product,
    });
  } catch (error) {
    console.log("ERROR : Error While Updating Data...");
    return res.json({
      message: "ERROR : Error While Updating Data...",
    });
  }

  // return res.json({
  //   data: "Update Product Root",
  // });
});

// DELETE PRODUCT...

router.delete(
  "/deleteProduct/:key",
  check_product_id,
  auth,
  async (req, res, next) => {
    console.log("\t \n Delete Product");

    const product_id = req.params.key;

    const data = await productSchemaModel.findOneAndDelete({
      product_id: product_id,
    });

    return res.status(200).json({
      message: "Product Deleted...",
    });
  }
);

// SEARCH PRODUCT...

router.get("/searchProductCat/:current_user/:key", async (req, res) => {
  console.log("\t \n Search Product and Category...");

  try {
    const current_user = req.params.current_user;
    const key = req.params.key;

    // console.log(current_user, key);

    const data = await productSchemaModel.find({
      email: current_user,
      $or: [
        // { category_id: { $regex: '.*' + key + '.*' } },
        { product_name: { $regex: ".*" + key + ".*" } },
      ],
    });

    console.log(data);

    return res.json({
      message: "Data fetched...",
      data: data,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Error : Something Went Wrong...",
      error: error,
    });
  }

  // return res.json({
  //     data: "data"
  // })
});

// SORT PRODUCT...

router.get("/sortProduct/:current_user/:sort_key", async (req, res) => {
  console.log("\t \n Sort Products...");

  try {
    const key = req.params.sort_key;
    const current_user = req.params.current_user;

    if (key == "ASC" || key == "asc") {
      final_sort_key = 1;
    } else {
      final_sort_key = -1;
    }

    const data = await productSchemaModel
      .find({
        email: current_user,
      })
      .sort({
        product_name: final_sort_key,
      });

    const result = [
      {
        METHOD: key,
        ID: data.product_id,
      },
    ];

    data.forEach((i) => {
      result.push({
        ID: i.product_id,
        email: i.email,
      });
    });

    console.table(result);

    return res.json({
      key: final_sort_key,
      data: data,
      message: "Sorted Data Fetched Successfully...",
    });
  } catch (error) {
    console.log("ERROR : Error While Get Sorted Data...");
    return res.json({
      message: "ERROR : Error While Get Sorted Data...",
    });
  }

  // return res.json({
  //     message : "Sort Products..."
  // })
});

// TOTAL PRODUCTS...

router.get("/getTotalProduct", async (req, res) => {
  console.log("\t \n Get Total Products....");

  const data = await productSchemaModel.find();

  const TotalProducts = data.length;

  console.log(TotalProducts);
  return res.json({
    message: "Get Total Products...",
    TotalProducts: TotalProducts,
  });
});

// TOTAL CATEGORIES...

router.get("/getTotalCategory", async (req, res) => {
  console.log("\t \n Get Total Category....");

  const data = await categorySchemaModel.find();

  const TotalCategory = data.length;

  console.log(TotalCategory);
  return res.json({
    message: "Get Total Category...",
    TotalCategorys: TotalCategory,
  });
});

// TOTAL PRODUCTS BY CATEGORIES...

router.get("/getTotalProductByCategory", async (req, res) => {
  console.log("\t \n Get Get Total Products by Category....");

  const getCategoryName = await categorySchemaModel.find();

  const allCategoryName = [];

  getCategoryName.forEach((i) => {
    allCategoryName.push({
      _id: i.category_id,
      Cat_Name: i.category_name,
    });
  });

  const TotalProductsByCategorys = await productSchemaModel.aggregate([
    {
      $group: {
        _id: "$category_id",
        count: { $sum: 1 },
      },
    },
  ]);

  console.log(TotalProductsByCategorys);

  const result = [];

  console.log("datadadataad");

  allCategoryName.forEach((i) => {
    TotalProductsByCategorys.forEach((j) => {
      if (j._id == i._id) {
        result.push({
          Cat_id: i._id,
          Cat_Name: i.Cat_Name,
          total: j.count,
        });
      }
    });
  });

  console.log("Data === ", result);

  return res.json({
    message: "Get Total Products by Category...",
    TotalProductsByCategorys: result,
  });
});

// TEST...

router.post("/uploadImg", upload.single("image"), async (req, res, next) => {
  console.log("\t \n Image Uploads...");

  //   var obj = {
  //     name: req.file.originalname,
  //     img: {
  //       data: fs.readFileSync(
  //         path.join(__dirname + "/uploads/" + req.file.originalname)
  //       ),
  //       contentType: "image/jpg",
  //     },
  //   };

  //   const data = await imgModel.create(obj, (err, item) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send("uploaded");
  //     }
  //   });

  const data = await imageModel.create({
    email: "Hello",
    imgName: "Hello Hello",
    img: req.file.filename,
  });

  console.log(req.file);

  return res.json({
    message: "Iamge Upload...",
    data: req.file,
  });
});

router.get("/getImg", async (req, res, next) => {
  console.log("\t \n Image Uploads...");

  const data = await imageModel.find();

  //   console.log(req.file);

  return res.json({
    message: "Iamge Get...",
    data: data,
  });
});

// RECENT ORDERS...

router.post("/getCurrentDayOrders", async (req, res) => {
  const current_date = req.body.current_date;

  const data = await orderSchemaModel.find({
    order_date: current_date,
  });

  var myTotal = 0;

  data.forEach((i) => {
    console.log("Total ============== ", i.total_amount);
    myTotal = myTotal + i.total_amount;
  });

  return res.json({
    message: "All Data",
    Count: data.length,
    Total_Amount: myTotal,
  });
});

router.get("/getRecentOrders", async (req, res) => {
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  const data = await orderSchemaModel.find({
    $gt: start_date,
    $lte: end_date,
  });

  var myTotal = 0;

  data.forEach((i) => {
    console.log("Total ============== ", i.total_amount);
    myTotal = myTotal + i.total_amount;
  });

  return res.json({
    message: "All Data",
    start_date: start_date,
    end_date: end_date,
    Count: data.length,
    Total_Amount: myTotal,
  });
});

// ORDERS...

router.get("/myOrders", async (req, res) => {
  console.log("\t \n Order Detials");

  const data = await orderSchemaModel.find();

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

// DASHBOARD DATA...

router.post("/getDashboardData", async (req, res) => {
  console.log("\n \t Get Dashboard Data");

  try {
    const current_date = req.body.current_date;

    const start_date = req.body.start_date;
    const end_date = req.body.end_date;

    const totalCategory = await (await categorySchemaModel.find()).length;
    const totalProducts = await (await productSchemaModel.find()).length;

    const getOrder = await orderSchemaModel.find({
      order_date: current_date,
    });

    // currentDayOrdersSell...

    var currentDayOrdersSell = 0;

    getOrder.forEach((i) => {
      console.log("Total ============== ", i.total_amount);
      currentDayOrdersSell = currentDayOrdersSell + i.total_amount;
    });

    // LAST 7 DAY SELL...

    const getLastWeekSell = await orderSchemaModel.find({
      order_date: { $gte: start_date, $lte: end_date },
    });

    var LastWeekSell = 0;

    getLastWeekSell.forEach((i) => {
      console.log("Total ============== ", i.total_amount);
      LastWeekSell = LastWeekSell + i.total_amount;
    });

    return res.json({
      message: "Get Dashboard Data...",
      totalCategory: totalCategory,
      totalProducts: totalProducts,
      currentDayOrdersSell: currentDayOrdersSell,
      LastWeekSell: LastWeekSell,
    });
  } catch (error) {
    return res.json({
      message: "Error : Error While Loading DashBoard Data...",
    });
  }
});

module.exports = router;
