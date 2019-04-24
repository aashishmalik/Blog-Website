const express = require('express')
const mongoose = require('mongoose')
const app = express()
mongoose.connect("mongodb://localhost/MyBlog")
app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let myBlogSchema = mongoose.Schema({
    title: String,
    image: String, //url 
    body: String,
    created: {
        type: Date,
        default: Date.now
    }//defauly date is set
})

let Blog = mongoose.model("Blog", myBlogSchema);

//REST ROUTES

app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err)
            throw err
        else {
            res.render('index', {
                blogs: blogs
            })
        }
    })
})

app.get('/blogs/new', (req, res) => {

    res.render('new')

})

app.post('/blogs', (req, res) => {

    Blog.create(req.body.blog, (err) => {
        if (err)
            res.redirect('new')
        else
            res.redirect('/blogs')
    })
})

app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })//id, newdata, callback
});


app.delete("/blogs/:id", function (req, res) {
  
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(6543, () => {
    console.log("running on http://localhost:6543")

})