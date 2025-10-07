import mongoose from "mongoose";

const allowedParticipantSchema = new mongoose.Schema({
  teamId: { type: String, required: true, trim: true }, 
  name: { type: String, required: true, trim: true }, 
  delegateId: { type: String, required: true, trim: true }, 
  registrationNo: { type: String, required: true, trim: true }, 
  collegeName: { type: String, required: true, trim: true }, 
  phoneNumber: { type: String, required: true, trim: true }, 
  email: { type: String, required: true, trim: true }, 
  categoryName: { type: String, trim: true }, 
  eventName: { type: String, trim: true },
});

export default mongoose.model("AllowedParticipant", allowedParticipantSchema);