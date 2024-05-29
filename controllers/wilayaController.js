const Wilaya = require("../models/wilayaModel");
const City = require("../models/cityModel");
require("dotenv").config();
const axios = require("axios");

async function getWilayaById(req, res) {
  const wilayaId = req.params.wilayaId;

  try {
    // Fetch wilaya from the database using the provided wilayaId
    const wilaya = await Wilaya.findOne({ id: wilayaId });

    // If wilaya is found, return it
    if (wilaya) {
      res.json(wilaya);
    } else {
      res.status(404).json({ message: "Wilaya not found" });
    }
  } catch (error) {
    console.error("Error fetching wilaya by wilaya_id:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getCommunesAndFeesByWilaya = async (req, res) => {
  try {
    const { wilaya_code, fee_type } = req.params;

    let formattedWilayaCode = wilaya_code;
    if (wilaya_code < 10) {
        formattedWilayaCode = `0${wilaya_code}`;
    }

    // Fetch communes
    const communes = await City.find({ wilaya_code: formattedWilayaCode }).select("commune_name_ascii");

    const communeNames = communes.map((commune) => commune.commune_name_ascii);

    // Fetch fees from external API
    const response = await axios.get(
      `${process.env.SERVER_APP_API_URL}/api/v1/get/fees`,
      {
        params: {
          api_token: process.env.SERVER_APP_API_TOKEN,
        },
      }
    );

    const livraison = response.data.livraison;
    const wilayaId = parseInt(wilaya_code, 10);
    const feeData = livraison.find((fee) => fee.wilaya_id === wilayaId);

    let fee;
    if (feeData) {
      if (fee_type === "0") {
        fee = feeData.tarif;
      } else if (fee_type === "1") {
        fee = feeData.tarif_stopdesk;
      } else {
        fee = null;
      }
    } else {
      fee = null;
    }

    res.json({ communeNames, fee });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



module.exports = {
  getWilayaById,
  getCommunesAndFeesByWilaya,
};
