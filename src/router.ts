import { Router } from "express";
import { body } from "express-validator";
import { handleInputs } from "./modules/middleware";
import { createProduct, deleteProduct, getOneProduct, getProducts } from "./handlers/product";
import { create } from "domain";
import { createUpdate, deleteUpdate, getOneUpdate, getUpdates, updateUpdate } from "./handlers/update";

const router = Router();

// Product Routes
router.get("/product", getProducts);

router.get("/product/:id", getOneProduct);
router.post("/product", [body("name").notEmpty()], handleInputs,createProduct);
router.put("/product/:id", [body("name").notEmpty()], handleInputs, (req, res) => {
  res.json({ message: "product" });
});
router.delete("/product/:id", deleteProduct);



// Update Routes
router.get("/update", getUpdates);
router.get("/update/:id", getOneUpdate);
router.post("/update",
  body("title").exists().isString(),
  body("body").exists().isString(),
  body("productId").exists().isString(),
  handleInputs,
  createUpdate
);
router.put("/update/:id",
  body("title").optional().isString(),
  body("body").optional().isString(),
  body('status').isIn(['IN_PROGRESS', 'LIVE', 'DEPRECATED', 'ARCHIVED']).optional(),
  body("version").optional(),
  updateUpdate
);
router.delete("/update/:id", deleteUpdate);



// UpdatePoint Routes
router.get("/updatepoint", (req, res) => { });
router.get("/updatepoint/:id", (req, res) => { });
router.post("/updatepoint",
  body("name").isString(),
  body("description").isString(),
  body("updateId").exists().isString(),
  (req, res) => { }
);
router.put("/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  (req, res) => { }
);
router.delete("/updatepoint/:id", (req, res) => { });


// Error handler, (need to do at two places because inner routes some time dont give error to outer routes, of app in server file, 
// so we need to handle errors at both places)
router.use((err,req,res,next)=>{
  console.error(err)
  if(err.type =='auth'){
      res.status(401).json({error:"Unauthorized",message:err.message})
      return
  }else if(err.type == 'input'){
      res.status(400).json({error:"invalid input",errors:err.errors})
      return
  }else{
      res.status(500).json({error:' Oops, Something went wrong'})
  }
})

export default router;