import { Category } from "@models";
import {
  uploadOnCloudinary,
  ApiResponse,
  ApiError,
  asyncHandler,
} from "@utils";

const addCategory = asyncHandler(async (req, res) => {
  const { name, extraInfo } = req.body;

  const createdBy = req.user?._id;

  if ([name, extraInfo].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const iconLocalPath = req.files?.icon[0]?.path;

  if (!iconLocalPath) {
    throw new ApiError(400, "icon file is required");
  }

  const icon = await uploadOnCloudinary(iconLocalPath);

  if (!icon) {
    throw new ApiError(400, "icon file is required");
  }

  const fieldsRes = await Category.create({
    name: name,
    extraInfo: extraInfo,
    createdBy: createdBy,
    icon: icon.url,
  });

  const createdCategory = await Category.findById(fieldsRes._id).select({});

  if (!createdCategory) {
    throw new ApiError(500, "Something went wrong while creating the Field");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdCategory, "Category created Successfully")
    );
});

const editCategory = asyncHandler(async (req, res) => {
  const { categoryId, name, extraInfo } = req.body;

  const createdBy = req.user?._id;

  if ([name, categoryId, extraInfo].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const iconLocalPath = req.files?.icon?.[0]?.path;
  let icon;

  if (iconLocalPath) {
    // Upload new icon to Cloudinary if a file is provided
    icon = await uploadOnCloudinary(iconLocalPath);

    if (!icon) {
      throw new ApiError(400, "Failed to upload icon file");
    }
  }

  // Build the update object conditionally
  const updateData = {
    name,
    createdBy,
    extraInfo,
  };

  if (icon) {
    // @ts-ignore
    updateData.icon = icon.url; // Add icon field only if a new icon is provided
  }

  const updatedFields = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true }
  );

  if (!updatedFields) {
    throw new ApiError(500, "Something went wrong while updating the Category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFields, "Category updated Successfully"));
});

const getCategory = asyncHandler(async (req, res) => {
  const userID = req.user._id; // Access the userID parameter

  // Find category by the user ID (createdBy) or any custom logic
  const category = await Category.find({ createdBy: userID });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched Successfully"));
});

export { addCategory, getCategory, editCategory };
