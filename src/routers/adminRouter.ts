import { Router } from "express";
import { body } from "express-validator";
import { handleInputs } from "../modules/middleware";
import { createNews, deleteNews, getOneNews, getNews, updateNews, publishNews } from "../handlers/news";


const AdminRouter = Router();

// News Routes
AdminRouter.get("/news", getNews);
AdminRouter.get("/news/:id", getOneNews);
AdminRouter.post("/news", createNews);
AdminRouter.put("/news/:id", updateNews);
AdminRouter.delete("/news/:id", deleteNews);
AdminRouter.put("/news/:id/publish", publishNews);




// Error handler, (need to do at two places because inner routes some time dont give error to outer routes, of app in server file, 
// so we need to handle errors at both places)
AdminRouter.use((err,req,res,next)=>{
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

export default AdminRouter;