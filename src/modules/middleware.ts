import { validationResult } from "express-validator";

export const handleInputs = (req, res, next) => {
 
 const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() });
    return
  }else{
    next()
  }

}