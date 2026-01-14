import express from "express";
import Workshop from "../models/workshop.js";
import Iscrizione from "../models/workshopIscrizione.js";

import ExcelJS from "exceljs";

const router = express.Router();

/* POST iscrizione */
router.post("/:workshopId", async (req, res) => {
  const { workshopId } = req.params;
  const { nome, cognome, email, telefono, indirizzo, citta, note } = req.body;

  const workshop = await Workshop.findById(workshopId);
  if (!workshop) return res.status(404).json({ error: "Workshop non trovato" });

  if (!nome || !cognome || !email || !telefono || !indirizzo || !citta) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const iscrittiCount = await Iscrizione.countDocuments({
    workshop: workshopId,
  });
  if (workshop.maxPartecipanti && iscrittiCount >= workshop.maxPartecipanti) {
    return res.status(400).json({ error: "Workshop completo" });
  }

  const iscrizione = new Iscrizione({
    workshop: workshopId,
    nome,
    cognome,
    email,
    telefono,
    indirizzo,
    citta,
  });

  await iscrizione.save();

  // Email automatica
  //await sendMail({ nome, cognome, email, telefono, indirizzo, citta });

  res.status(201).json({ message: "Iscrizione avvenuta con successo" });
});

/* GET esporta iscritti in Excel */

router.get("/:workshopId/export", async (req, res) => {
  const iscrizioni = await Iscrizione.find({ workshop: req.params.workshopId });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Iscritti");

  sheet.columns = [
    { header: "Nome", key: "nome" },
    { header: "Email", key: "email" },
    { header: "Telefono", key: "telefono" },
    { header: "Indirizzo", key: "indirizzo" },
    { header: "Data iscrizione", key: "createdAt" },
  ];

  iscrizioni.forEach((i) => sheet.addRow(i));

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=iscritti.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

export default router;
