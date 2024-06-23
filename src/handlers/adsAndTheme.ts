import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getClientIp } from 'request-ip'
import IPGeolocationAPI from 'ip-geolocation-api-javascript-sdk'
import GeolocationParams from 'ip-geolocation-api-javascript-sdk/GeolocationParams'



const prisma = new PrismaClient();
const router = express.Router();
const DEFAULT = 'DEFAULT'

export const getTheme = async (req, res) => {

  var clientIp = getClientIp(req);

  // clientIp = "8.8.8.8"; // Remove or conditionally apply this line for production


  var ipgeolocationApi = new IPGeolocationAPI(process.env.IPGeolocationAPIKey, false);

  var geolocationParams = new GeolocationParams();
  geolocationParams.setIPAddress(clientIp);

  ipgeolocationApi.getGeolocation(async (json) => {
    try {
      if (json?.country_code2) {
        console.log(json.country_code2)
        var theme = await prisma.colorTheme.findFirst({
          where: {
            countryCode: json.country_code2
          }
        });
        if (!theme) {
          theme = await prisma.colorTheme.findFirst({
            where: {
              countryCode: DEFAULT
            }
          });
        }

        var bannerAd = await prisma.bannerAd.findFirst({
          where: {
            countryCode: json.country_code2
          }
        });
        if (!bannerAd) {
          bannerAd = await prisma.bannerAd.findFirst({
            where: {
              countryCode: DEFAULT
            }
          });
        }
        var titleAd = await prisma.titleAd.findFirst({
          where: {
            countryCode: json.country_code2
          }
        });
        if (!titleAd) {
          titleAd = await prisma.titleAd.findFirst({
            where: {
              countryCode: DEFAULT
            }
          });
        }
        res.json({ theme, bannerAd, titleAd });
      } else {
        const theme = await prisma.colorTheme.findFirst({
          where: {
            countryCode: DEFAULT
          }
        });
        const bannerAd = await prisma.bannerAd.findFirst({
          where: {
            countryCode: DEFAULT
          }
        });
        const titleAd = await prisma.titleAd.findFirst({
          where: {
            countryCode: DEFAULT
          }
        });
        res.json({ theme, bannerAd, titleAd });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }, geolocationParams);


}


router.get('/titleAds', async (req, res) => {
  try {
    const ads = await prisma.titleAd.findMany();
    res.json(ads);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/titleAds', async (req, res) => {
  const { countryCode, image } = req.body;
  try {
    // Check if the titleAd already exists
    const existingAd = await prisma.titleAd.findUnique({
      where: { countryCode },
    });

    if (existingAd) {
      return res.status(409).json({ message: 'Ad already exists for this countryCode.' });
    }


    const newAd = await prisma.titleAd.create({
      data: { countryCode, image },
    });
    res.json(newAd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/titleAds', async (req, res) => {

  const { image, countryCode } = req.body;
  try {
    // Check if the titleAd exists
    const existingAd = await prisma.titleAd.findUnique({
      where: { countryCode },
    });

    if (!existingAd) {
      return res.status(404).json({ message: 'Ad not found for this countryCode.' });
    }

    // Update the titleAd
    const updatedAd = await prisma.titleAd.update({
      where: { countryCode },
      data: { image },
    });
    res.json(updatedAd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.post('/bannerAds', async (req, res) => {
  const { countryCode, image } = req.body;
  try {
    // Check if the bannerAd already exists
    const existingAd = await prisma.bannerAd.findUnique({
      where: { countryCode },
    });

    if (existingAd) {
      return res.status(409).json({ message: 'BannerAd already exists for this countryCode.' });
    }

    // If not, create a new bannerAd
    const newBannerAd = await prisma.bannerAd.create({
      data: { countryCode, image },
    });
    res.json(newBannerAd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/bannerAds', async (req, res) => {
  try {
    const ads = await prisma.bannerAd.findMany();
    res.json(ads);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/bannerAds', async (req, res) => {
  const { image, countryCode } = req.body;
  try {
    // Check if the bannerAd exists
    const existingAd = await prisma.bannerAd.findUnique({
      where: { countryCode },
    });

    if (!existingAd) {
      return res.status(404).json({ message: 'BannerAd not found for this countryCode.' });
    }

    // Update the bannerAd
    const updatedAd = await prisma.bannerAd.update({
      where: { countryCode },
      data: { image },
    });
    res.json(updatedAd);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/colorThemes', async (req, res) => {
  const { countryCode, base, text, background } = req.body;

  try {
    if(!countryCode || !base || !text || !background){
      return res.status(400).json({ message: 'Please provide all the required fields.' });
    }
    // Check if the colorTheme already exists
    const existingTheme = await prisma.colorTheme.findUnique({
      where: { countryCode },
    });

    if (existingTheme) {
      return res.status(409).json({ message: 'ColorTheme already exists for this countryCode.' });
    }

    // If not, create a new colorTheme
    const newColorTheme = await prisma.colorTheme.create({
      data: { countryCode, base, text, background },
    });
    res.json(newColorTheme);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/colorThemes', async (req, res) => {
  try {
    const themes = await prisma.colorTheme.findMany();
    res.json(themes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/colorThemes', async (req, res) => {
  const { base, text, background, countryCode } = req.body;
  try {
    // Check if the colorTheme exists
    const existingTheme = await prisma.colorTheme.findUnique({
      where: { countryCode },
    });

    if (!existingTheme) {
      return res.status(404).json({ message: 'ColorTheme not found for this countryCode.' });
    }

    // Update the colorTheme
    const updatedTheme = await prisma.colorTheme.update({
      where: { countryCode },
      data: { base, text, background },
    });
    res.json(updatedTheme);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;