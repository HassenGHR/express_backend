const path = require('path');

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    res.status(201).json({ imagePath: filePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  uploadFile,
};
