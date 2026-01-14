import mongoose from "mongoose";

const WorkshopIscrizioneSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },

    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    indirizzo: { type: String, required: true },
    citta: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("WorkshopIscrizione", WorkshopIscrizioneSchema);
