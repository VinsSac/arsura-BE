import express from "express";
import Workshop from "../models/workshop.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// ------------------------
// CONFIG CLOUDINARY
// ------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------------
// STORAGE MULTER-CLOUDINARY
// ------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "workshops",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

/* GET tutti i workshop */
router.get("/", authMiddleware, async (req, res) => {
  const workshops = await Workshop.find().sort({ dataInizio: -1 });
  res.json(workshops);
});

/* POST nuovo workshop */

router.post(
  "/",
  authMiddleware,
  upload.array("immagini", 5),
  async (req, res) => {
    try {
      // multer-storage-cloudinary già carica le immagini direttamente su Cloudinary
      const immagini = req.files.map((file) => ({
        url: file.path, // il link Cloudinary
        public_id: file.filename, // public_id generato da CloudinaryStorage
      }));

      const workshop = new Workshop({
        ...req.body,
        immagini,
      });

      await workshop.save();
      res.status(201).json(workshop);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * DELETE singola immagine workshop
 */
router.delete("/:workshopId/images/:publicId", async (req, res) => {
  try {
    const { workshopId, publicId } = req.params;

    // 1️⃣ Trova workshop
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ error: "Workshop non trovato" });
    }

    if (workshop.immagini.length <= 1) {
      return res.status(400).json({
        error: "Il workshop deve avere almeno un'immagine",
      });
    }

    // 2️⃣ Rimuovi immagine da Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // 3️⃣ Rimuovi immagine dall'array immagini
    workshop.immagini = workshop.immagini.filter(
      (img) => img.public_id !== publicId
    );

    // 4️⃣ Salva workshop
    await workshop.save();

    res.json({
      message: "Immagine eliminata con successo",
      immagini: workshop.immagini,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* PUT modifica workshop */
router.put(
  "/:workshopId",
  authMiddleware,
  upload.array("immagini", 5),
  async (req, res) => {
    try {
      const { workshopId } = req.params;

      // 1️⃣ Trova workshop
      const workshop = await Workshop.findById(workshopId);
      if (!workshop) {
        return res.status(404).json({ error: "Workshop non trovato" });
      }

      // 2️⃣ Aggiorna campi base
      Object.keys(req.body).forEach((key) => {
        workshop[key] = req.body[key];
      });

      // 3️⃣ Gestione nuove immagini
      if (req.files && req.files.length > 0) {
        const nuoveImmagini = req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }));
        // aggiungi le nuove immagini all'array esistente
        workshop.immagini.push(...nuoveImmagini);
      }

      // 4️⃣ Salva modifiche
      await workshop.save();

      res.json({ message: "Workshop aggiornato con successo", workshop });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
