import mongoose, { Document, Schema } from "mongoose";

interface IJob extends Document {
  language: string;
  filePath: string;
  SubmittedAt: Date;
  StartedAt: Date;
  completedAt: Date;
  output: string;
  status: string;
}

const jobSchema = new Schema<IJob>({
  language: {
    type: String,
    required: true,
    enum: ["py", "js", "typescript", "java", "c", "cpp"],
  },
  filePath: {
    type: String,
    required: true,
  },
  SubmittedAt: {
    type: Date,
    default: Date.now(),
  },
  StartedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  output: {
    type: String,
  },
  status: {
    type: String,
    default: "running",
    enum: ["running", "Success", "failed"],
  },
});

export default mongoose.model<IJob>("Job", jobSchema);

