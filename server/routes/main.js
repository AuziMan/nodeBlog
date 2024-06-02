const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

/**
 * GET / 
 * Home 
 * */
router.get('/', async (req, res) => {
try{
    const locals = {
        title: "nodeJS Blog",
        description: "Simple blog page"
    }
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } } ] )
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);


    res.render('index', {
        locals, 
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null
    });
   } catch (error){
    console.log(error)
   }


});


/**
 * GET / 
 * Post :id
 * */

router.get('/post/:id', async (req, res) => {
 try{   
    let slug = req.params.id;

    const data = await Post.findById({_id: slug});

    const locals = {
        title: data.title + " Blog",
        description: "Simple blog page"
    }
    res.render('post', {locals, data});
} catch(error) {
    console.log(error);
}
});


/**
 * GET / 
 * About Page
 * */
router.get('/about', (req, res) => {
    res.render('about');
});

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