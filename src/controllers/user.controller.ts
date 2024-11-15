import {
  asyncHandler,
  ApiResponse,
  ApiError,
  uploadOnCloudinary,
} from "@utils";
import { JwtDecodeToken, User } from "@models";
import jwt from "jsonwebtoken";
import * as process from "process";
import { verifyJWTRequest } from "@middlewares";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();
    user!.refreshToken = refreshToken;
    await user?.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (_error: any) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, role } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage
    ? req.files?.coverImage[0]?.path
    : "";

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    role,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "userName or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    `${user?._id}`
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", req.user.accessToken, options)
    .clearCookie("refreshToken", req.user.refreshToken)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req: verifyJWTRequest, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET ?? ""
    ) as JwtDecodeToken;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      `${user._id}`
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refresh successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Please enter correct password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password change successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body;

  if (!(fullName && username && email)) {
    throw new ApiError(401, "insufficient parameters");
  }

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  user.fullName = fullName;
  user.username = username;
  user.email = email;

  await user.save({ validateBeforeSave: false });

  return res.json(new ApiResponse(200, user, "user updated successfully"));
});

// const getConfigurationAndCode = async () => {
//   const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

//   return { code };
// };

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email.trim()) {
//     throw new ApiError(401, "email required");
//   }

//   const findUserByEmail = await User.findOne({ email });

//   if (!findUserByEmail) {
//     throw new ApiError(401, "No user found with this email");
//   }

//   const { code } = await getConfigurationAndCode();

//   const transport = nodemailer.createTransport({
//     host: process.env.MAILTRAP_HOST,
//     port: process.env.MAILTRAP_PORT,
//     auth: {
//       user: process.env.MAILTRAP_USER,
//       pass: process.env.MAILTRAP_PASSWORD,
//     },
//   });

//   await transport.sendMail({
//     sender: "nikhil.gohil007@yopmail.com",
//     to: "nikhil.gohil.mi@gmail.com",
//     subject: "You are awesome!",
//     text: `OTP for reset password ${code}`,
//   });

//   await User.findByIdAndUpdate(findUserByEmail._id, {
//     $set: {
//       otp: code,
//     },
//   });

//   return res.json(new ApiResponse(200, {}, "otp sent successfully"));
// });

const verifyOtp = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;

  if (!(otp || email.trim())) {
    throw new ApiError(401, "Invalid parameters");
  }

  const user = await User.findOne({ email: email.trim(), otp: otp });
  if (!user) {
    throw new ApiError(401, "Wrong OTP");
  }

  return res.json(new ApiResponse(200, {}, "OTP verified"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!(email || otp || password)) {
    throw new ApiError(401, "Invalid parameters");
  }

  const user = await User.findOne({ email: email, otp: otp });
  if (!user) {
    throw new ApiError(401, "Wrong otp");
  }

  user.password = password;
  await user.save({ validateBeforeSave: false });
  await User.findByIdAndUpdate(user._id, {
    $set: {
      otp: null,
    },
  });
  return res.json(new ApiResponse(200, {}, "Password reset successfully"));
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select(["email", "role", "_id", "username"]);

  return res.json(new ApiResponse(200, users, "Users fetch successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateProfile,
  verifyOtp,
  resetPassword,
  getUsers,
};
