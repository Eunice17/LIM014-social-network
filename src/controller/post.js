import { auth, fs } from '../configFirebase.js';
import { removeCommentBd } from './comment.js';
import { getUser } from './login.js';

// Get info of user logged
export const getInfo = () => new Promise((resolve) => {
  const infodefault = 'Frontend developer - def';
  const prueba = fs.collection('users').get();
  prueba.then((omg) => {
    omg.forEach((data) => {
      if (data.data().id === auth.currentUser.uid) {
        resolve(data.data().info);
      }
    });
    resolve(infodefault);
  });
});

// Create post in firebase
export const addPost = ((post) => {
  const dateP = firebase.firestore.FieldValue.serverTimestamp();
  fs.collection('post').add({
    publication: post,
    email: firebase.auth().currentUser.email,
    uid: firebase.auth().currentUser.uid,
    datePost: dateP,
    user: getUser().displayName,
    likePost: [],
    countLikes: 0,
  });
});

// Get doc of all post
export const getPost = ((callback) => {
  fs.collection('post')
    .orderBy('datePost', 'desc')
    .onSnapshot((querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push(doc);
      });
      callback(newArray);
    });
});

export const removePostBd = ((id) => {
  fs.collection('post').doc(id).delete()
    .then(() => {
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
  const delateCm = fs.collection('comments').where('postId', '==', id).get();
  delateCm.then((omg) => {
    omg.forEach((cm) => {
      removeCommentBd(cm.id);
    });
  });
});

// Update post where users edited post
export const updatePostBd = (id, postEdit) => fs.collection('post').doc(id)
  .update({
    publication: postEdit,
  }).then(() => {
    console.log('Document successfully updated!');
  })
  .catch((error) => {
    console.error('Error removing document: ', error);
  });

// Update users who liked a post
export const likePostBd = (doc, likeUser) => {
  fs.collection('post').doc(doc.id)
    .update({
      likePost: likeUser,
    }).then(() => {
    /*  console.log('Document successfully liked!'); */
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
};

// Update number of likes
export const countLikesPost = (doc, countLikesPost1) => {
  fs.collection('post').doc(doc.id)
    .update({
      countLikes: countLikesPost1,
    }).then(() => {
      /* console.log('Document successfully counted!'); */
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
};

// Get best post top(5)
export const getBestPost = ((callback) => {
  fs.collection('post')
    .orderBy('countLikes', 'desc')
    .limit(5)
    .onSnapshot((querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push(doc);
      });
      callback(newArray);
    });
});