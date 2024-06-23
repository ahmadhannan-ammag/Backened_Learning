import prisma from "../db";

// Get all news for a user
export const getNews = async (req, res, next) => {
  try {
    const user = await prisma.operator.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        news: true,

      }
    })
    res.json({ data: user.news });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};

// Get a single news item
export const getOneNews = async (req, res, next) => {
  try {
    const news = await prisma.news.findFirst({
      where: {
        id: parseInt(req.params.id),
        operatorId: req.user.id,
      },
      include: {
        operator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json({ data: news });
  } catch (error) {
    error.type = 'input';
    next(error);
  }
};








export const createNews = async (req, res, next) => {

  const { image, translations } = req.body;

  if (!image || !translations) {
    return res.status(400).json({ error: 'Image, and translations are required.' });
  }

  const requiredLanguages = ['EN', 'FR', 'DE', 'IT', 'PT', 'ES', 'JA', 'AR', 'ZH', 'HI', 'KO', 'RU'];

  // Create a map of provided translations for quick lookup
  const providedTranslations = new Map();
  translations.forEach(translation => {
    providedTranslations.set(translation.language, translation);
  });

  // Prepare translations ensuring all required languages are included
  const completeTranslations = requiredLanguages.map(language => {
    if (providedTranslations.has(language)) {
      return providedTranslations.get(language);
    } else {
      return { language, title: '', subtitle: '', body: '' };
    }
  });

  try {
    const news = await prisma.news.create({
      data: {
        image,
        operatorId: req.user.id,
        translations: {
          create: completeTranslations.map(translation => ({
            language: translation.language,
            title: translation.title,
            subtitle: translation.subtitle,
            body: translation.body,
            state: 'PUBLISHED'
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    res.status(201).json({ data: news });
  } catch (error) {
    console.error('Error:', error);
    error.type = 'input';
    next(error);
  }
};




export const updateNews = async (req, res, next) => {
  const { id, image, translations } = req.body;

  if (!id || !image || !translations) {
    return res.status(400).json({ error: 'ID, image, and translations are required.' });
  }

  const requiredLanguages = ['EN', 'FR', 'DE', 'IT', 'PT', 'ES', 'JA', 'AR', 'ZH', 'HI', 'KO', 'RU'];

  // Create a map of provided translations for quick lookup
  const providedTranslations = new Map();
  translations.forEach(translation => {
    providedTranslations.set(translation.language, translation);
  });

  // Prepare translations ensuring all required languages are included
  const completeTranslations = requiredLanguages.map(language => {
    if (providedTranslations.has(language)) {
      return providedTranslations.get(language);
    } else {
      return { language, title: '', subtitle: '', body: '' };
    }
  });

  try {
    // Fetch the news item first
    const newsItem = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
    });

    // If the news item exists, update it
    if (newsItem) {
      const news = await prisma.news.update({
        where: {
          id: Number(id),
        },
        data: {
          image,
          operatorId: req.user.id,
          translations: {
            upsert: completeTranslations.map(translation => ({
              where: { newsId_language: { newsId: Number(id), language: translation.language } },
              update: { title: translation.title, subtitle: translation.subtitle, body: translation.body, state: 'PUBLISHED' },
              create: { language: translation.language, title: translation.title, subtitle: translation.subtitle, body: translation.body, state: 'PUBLISHED' }
            })),
          },
        },
        include: {
          translations: true,
        },
      });

      res.status(200).json({ data: news });
    } else {
      res.status(404).json({ error: 'News item does not exist' });
    }
  } catch (error) {
    console.error('Error:', error);
    error.type = 'input';
    next(error);
  }
};
// Get all news items for public
export const getPublicNews = async (req, res, next) => {
  try {
    const language = req.params.language; // Get the language from the query parameters
    const pageSize = Number(req.query.pageSize) || 10; // Get the page size from the query parameters
    const pageNumber = Number(req.query.pageNumber) || 1; // Get the page number from the query parameters

    const news = await prisma.news.findMany({
      include: {
        translations: {
          where: { language: req.params.language },
        },
      },
      take: pageSize, // Limit the number of results
      skip: pageSize * (pageNumber - 1), // Skip the previous pages
    });

    

    // Filter the translations in the application code
    const filteredNews = news
      .map(newsItem => ({
        ...newsItem,
        translations: newsItem.translations.filter(
          translation => translation.language === `${language}` && translation.state === 'PUBLISHED'
        ),
      }))
      .filter(newsItem => newsItem.translations.length > 0);

    // Get the total count of news items
    const totalCount = await prisma.news.count();

    res.json({ Data: filteredNews, totalCount: totalCount });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};




export const addTranslation = async (req, res, next) => {
  try {
    const { newsId } = req.params;
    const { language, title, subtitle, body } = req.body;

    const translation = await prisma.translation.update({
      where: {
        newsId_language: {
          newsId: Number(newsId),
          language,
        },
      },
      data: {
        title,
        subtitle,
        body,
        state: 'PUBLISHED'
      },
    });


    res.json(translation);
  } catch (err) {
    next(err);
  }
};



export const getOnePublicNews = async (req, res, next) => {
  try {
    const id = req.params.id; 
    const language = req.params.language;
    const pageSize =  1;

    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
      include: {
        translations: {where: { language: req.params.language },},
      },
    });

    if (!news) {
      throw new Error('News not found');
    }

    // Filter the translations in the application code
    const filteredNews = {
      ...news,
      translations: news.translations
        .filter(
          translation => translation.language === `${language}` && translation.state === 'PUBLISHED'
        )
        .slice(0, pageSize), // Limit the number of results
    };

    // Get the total count of translations
    const totalCount = news.translations.length;

    res.json({ Data: filteredNews, totalCount: totalCount });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};


export const getOneOperatorNews = async (req, res, next) => {
  try {
    const id = req.params.id; 


    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
      include: {
        translations:true,
      },
    });

    if (!news) {
      throw new Error('News not found');
    }

    // Filter the translations in the application code
    // const filteredNews = {
    //   ...news,
    //   translations: news.translations
    //     .filter(
    //       translation => translation.language === `${language}` && translation.state === 'PUBLISHED'
    //     )
    //     .slice(0, pageSize), // Limit the number of results
    // };

    // Get the total count of translations
    // const totalCount = news.translations.length;

    res.json({ Data: news });
  } catch (e) {
    e.type = 'input';
    next(e);
  }
};







// // Update a news item
// export const updateNews = async (req, res, next) => {
//   const { image,translations} = req.body;

//   if (!image ) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const news = await prisma.news.findFirst({
//       where: {
//         id: parseInt(req.params.id),
//       },
//     });

//     if (!news) {
//       return res.status(404).json({ error: 'No news item found with this ID' });
//     }

//     const updatedNews = await prisma.news.update({
//       where: {
//         id: news.id,
//       },
//       data: {

//         image,

//       },
//     });

//     res.json({ data: updatedNews });
//   } catch (error) {
//     error.type = 'input';
//     next(error);
//   }
// };

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const newsItem = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (newsItem) {
      // Delete all translations associated with the news item
      await prisma.translation.deleteMany({
        where: {
          newsId: Number(id),
        },
      });

      // Delete the news item
      const news = await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({ message: 'News and its translations deleted successfully', data: news });
    } else {
      res.status(404).json({ error: 'No news item found with this ID' });
    }
  } catch (err) {
    next(err);
  }
};



