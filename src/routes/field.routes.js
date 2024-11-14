import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {addFields,getFields,editFields} from '../controllers/field.controller.js'

const router = Router();

router.route("/add-fields").post(verifyJWT,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addFields
);

router.route("").get(verifyJWT,getFields)
router.route("/edit-fields").post(verifyJWT,upload.fields([
    {
        name: "image",
        maxCount: 1,
    },
]),editFields)

export default router;
