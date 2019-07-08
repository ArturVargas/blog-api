
const {db} = require('../firebase/admin');


exports.posts = (req, res) => {
    db.collection('posts').orderBy('createdAt', 'desc').get()
        .then((data) => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    title: doc.data().title,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    location: doc.data().location
                });
            });
            return res.status(200).json(posts);
        })
        .catch((err) => console.error(err))
};

exports.newPost = (req, res) => {
    const newPost = {
        body: req.body.body,
        title: req.body.title,
        userHandle: req.user.handle,
        location: req.user.country,
        createdAt: new Date().toISOString()
    };
    console.log(newPost);
    db.collection('posts').add(newPost)
        .then((doc) => {
            res.status(200).json({ message: `El post ${doc.id} se creo exitosamente` });
        })
        .catch((err) => {
            res.status(500).json({ error: `Algo salio mal ${err}` });
            console.log(err);
        });
};

exports.getPost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`).get()
    .then(doc => {
      if(!doc.exists){ return res.status(404).json({error: 'Post no Encontrado'})}  
      postData = doc.data();
      postData.postId = doc.id;
      return db.collection('comments')//.orderBy('createdAt', 'desc')
        .where('postId', '==', req.params.postId).get();
    })  
    .then(data => {
        postData.comments = [];
        data.forEach(doc => {
            postData.comments.push(doc.data())
        });
        return res.json(postData);
    })
    .catch( err => {
        console.error(err);
        res.status(500).json({ error: err.code }); 
    })
};
