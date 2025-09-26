import LoanDocument from "../models/loanDocument.js";

export async function uploadDocument(req, res) {
    console.log("running uploaddoc fn...")
    try {
    const { originalname, mimetype, size, buffer } = req.file;
    

    const doc = new LoanDocument({
      filename: req.file.filename || originalname,
      originalName: originalname,
      mimeType: mimetype,
      path:req.file.path,
      firstName: req.body.firstName,
      surName: req.body.surName,
      BVN:req.body.BVN,
      email: req.body.email,
      size
    });

    await doc.save();
    res.status(200).json({ message: 'File metadata saved successfully'});
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}