import { Router } from "express";
import { verifyJWT } from "@middlewares";
import { addFields, getFields, editFields } from "@controllers";

const router = Router();

router.route("/add-fields").post(verifyJWT, addFields);

router.route("").get(verifyJWT, getFields);
router.route("/edit-fields").post(verifyJWT, editFields);
export default router;
