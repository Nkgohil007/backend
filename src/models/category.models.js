import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum:["FIELD","IMAGE"]
        },
        icon:{
            type:String,
        },
        extraInfo:{
            type:String,
        },
        createdBY: {
           type: Schema.Types.ObjectId,
            ref: "User"
        },
        isActive: {
            type: Boolean, // cloudinary url
            default:true
        },
    },
    {
        timestamps: true
    }
)



export const Category = mongoose.model("Category", categorySchema)