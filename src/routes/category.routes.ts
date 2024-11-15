import { Router } from "express";
import { upload, verifyJWT } from "@middlewares";
import { addCategory, getCategory, editCategory } from "@controllers";

const router = Router();

router.route("/add-category").post(
  verifyJWT,
  upload.fields([
    {
      name: "icon",
      maxCount: 1,
    },
  ]),
  addCategory
);

router.route("").get(verifyJWT, getCategory);
router.route("/edit-category").post(
  verifyJWT,
  upload.fields([
    {
      name: "icon",
      maxCount: 1,
    },
  ]),
  editCategory
);

export default router;
