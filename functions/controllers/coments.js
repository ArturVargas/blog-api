
const {db} = require('../firebase/admin');

exports.getComments = (req, res) => {
    db.collection('comments').orderBy('createdAt', 'desc').get()
        .then((data) => {
            let comments = [];
            data.forEach(doc => {
                comments.push({
                    commentId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.status(200).json(comments);
        })
        .catch((err) => console.error(err))
}

exports.newComment = (req, res) => {
    if(req.body.body.trim() === '') { return res.status(400).json({error: 'Es necesario un Comentario'});}
    const newComment = {
        body: req.body.body,
        userHandle: req.user.handle,
        postId: req.params.postId,
        createdAt: new Date().toISOString()
    };
    console.log(newComment);
    db.doc(`/posts/${req.params.postId}`).get()
        .then( doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'Post no Encontrado'});
            }
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.status(200).json({ message: `El comentario se creo exitosamente ${newComment}` });
        })
        .catch((err) => {
            res.status(500).json({ error: `Algo salio mal ${err}` });
            console.log(err);
        });
}