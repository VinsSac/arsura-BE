import mongoose from "mongoose";

const WorkshopIscrizioneSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },

    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefono: String,
    indirizzo: String,
    note: String,
  },
  { timestamps: true }
);

export default mongoose.model("WorkshopIscrizione", WorkshopIscrizioneSchema);
