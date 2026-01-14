import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema(
  {
    titolo: { type: String, required: true },
    descrizione: String,

    dataInizio: Date,
    dataFine: Date,
    luogo: String,

    maxPartecipanti: Number,
    prezzo: Number,

    stato: {
      type: String,
      enum: ["past", "current", "future"],
      default: "future",
    },

    immagini: [
      {
        url: String,
        public_id: String,
      },
    ],

    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", WorkshopSchema);
