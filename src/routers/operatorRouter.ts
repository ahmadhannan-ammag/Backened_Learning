import { Router } from "express";
import { body } from "express-validator";
import { handleInputs } from "../modules/middleware";
import { createNews, deleteNews, updateNews, addTranslation, getOneOperatorNews } from "../handlers/news";


const OperatorRouter = Router();

// News Routes

OperatorRouter.get("/news/:id", getOneOperatorNews);
OperatorRouter.post("/news", createNews);
OperatorRouter.put("/news", updateNews);
OperatorRouter.delete("/news/:id", deleteNews);


// OperatorRouter.post('/news/:newsId/add-translation', addTranslation);

// Error handler, (need to do at two places because inner routes some time dont give error to outer routes, of app in server file, 
// so we need to handle errors at both places)
OperatorRouter.use((err,req,res,next)=>{
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

export default OperatorRouter;