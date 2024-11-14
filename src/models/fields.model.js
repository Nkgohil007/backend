import mongoose, {Schema} from "mongoose";

const fieldsSchema = new Schema(
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
        image:{
            type:String,
        },
        field:{
            type:String,
        },
        defaultValue: {
            type: Boolean,
            default:false
        },
        createdBy: {
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



export const Fields = mongoose.model("Fields", fieldsSchema)