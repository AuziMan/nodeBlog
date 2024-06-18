const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

const {getNowPlaying} = require('../config/spotify'); // Adjust the path


/**
 * GET / 
 * Home 
 * */
router.get('/', async (req, res) => {
    try {
      // Fetch now playing data from Spotify
      const nowPlayingData = await getNowPlaying();
  
      let nowPlaying = [{
        name: 'Nothing Playing',
        artist: '',
        preview: '' // Placeholder URL or leave empty
      }];
  

      if (nowPlayingData.isPlaying && nowPlayingData.data.item) {
        nowPlaying = [{
          name: nowPlayingData.data.item.name,
          artist: nowPlayingData.data.item.artists.map(artist => artist.name).join(', '),
          preview: nowPlayingData.data.item.album.images[0].url,
        }];
      }

      //console.log(nowPlaying)

      const locals = {
        title: "Auzi's Music Blog",
        description: "Music Blog Page"
      };
      let perPage = 10;
      let page = req.query.page || 1;
  
      const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
  
      const count = await Post.countDocuments();
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);
  
        res.render('index', {
          nowPlayingData,
          nowPlaying,
          data,
          locals,
          current: page,
          hasNextPage: hasNextPage ? nextPage: null
          // Add other rendering parameters as needed
        });
    } catch (error) {
      console.error('Error fetching now playing track:', error);
      res.status(500).send('Internal Server Error');
    }
  });


/**
 * GET / 
 * Post :id
 * */

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

router.get('/post/:title', async (req, res) => {
 try{
  
    let title =  req.params.title 
    
    const data = await Post.findOne({title: title});
    
    if(!title){
      return res.status(404).send('Post Not Found');
    }
    const locals = {
        title: data.title + " Blog",
        description: "Simple blog page"
    }
    res.render('post', {locals, data});
} catch(error) {
    console.log(error);
}
});

// router.get('/songs', (req, res) => {
//     res.render('songs');
// });

/**
 * GET / 
 * Contact Page
 * */
router.get('/contact', (req, res) => {
    res.render('contact');
});




/**
 * GET / 
 * Post :id
 * */

router.post('/search', async (req, res) => {
try{         
    const locals = {
        title: "Search",
        description: "Simple blog page"
    } 
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
        $or:[
            {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
        ]
    })
    res.render("search", {
        data,
        locals
    });
   } catch(error) {
       console.log(error);
   }
});



module.exports = router;



/** POST / 
 * 
 * Blog 
 * */

// function instertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "Body of the blog"
//         },
//         {
//             title: "Another One",
//             body: "Body of the blog"
//         },
//         {
//             title: "Another One x2",
//             body: "Body of the blog"
//         },
//     ])
// }

// instertPostData();