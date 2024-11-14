import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Fields } from "../models/fields.model.js";

const addFields = asyncHandler(async (req, res) => {
  const { name, type, field } = req.body;

  const createdBy = req.user?._id;
  
  if (
    [name, type].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (type === "IMAGE") {
    if (!req.files?.image) {
      throw new ApiError(400, "Image is required");
    }
  }

  if (type === "FIELD") {
    if (field.trim() === "") {
      throw new ApiError(400, "Field is required");
    }
  }

  const image = req.files?.image
    ? req.files?.image[0]?.path
    : "";
  
  const fieldImage = type === "IMAGE" ? await uploadOnCloudinary(image): '' ;

  const fieldsRes = await Fields.create({
    name: name,
    type: type,
    createdBy: createdBy,
    image: fieldImage?.url,
    field: type === "FIELD" ? field : "",
  });

const createdField = await Fields.findById(fieldsRes._id).select();

  if (!createdField) {
    throw new ApiError(500, "Something went wrong while creating the Field");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdField, "Field created Successfully"));
});

const editFields = asyncHandler(async (req, res) => {
  const { fieldId ,name, type, field } = req.body;

  const createdBy = req.user?._id;

  if (
    [name, type].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (type === "IMAGE") {
    if (!req.files?.image) {
      throw new ApiError(400, "Image is required");
    }
  }

  if (type === "FIELD") {
    if (field.trim() === "") {
      throw new ApiError(400, "Field is required");
    }
  }

  const image = req.files?.image
    ? req.files?.image[0]?.path
    : "";
  
  const fieldImage = type === "IMAGE" ? await uploadOnCloudinary(image): '' ;

  const updateFields = await Fields.findByIdAndUpdate(fieldId,{
    name: name,
    type: type,
    createdBy: createdBy,
    image: fieldImage?.url,
    field: field,
  })
  const updatedFields = await Fields.findById(updateFields._id)

  if (!updatedFields) {
    throw new ApiError(500, "Something went wrong while creating the Field");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFields, "Field updated Successfully"));
});

const getFields = asyncHandler(async (req, res) => {
    const userID = req.user._id; // Access the userID parameter

    // Find fields by the user ID (createdBy) or any custom logic
    const fields = await Fields.find({ createdBy: userID })

    if (!fields) {
      return res.status(404).json({ message: "Fields not found" });
    }

    return res
    .status(200)
    .json(new ApiResponse(200, fields, "Field fetched Successfully"));
})

export { addFields,getFields,editFields };
