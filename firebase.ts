
import { initializeApp } from "firebase/app";
import {getFirestore, addDoc, collection, doc, updateDoc, deleteDoc,getDocs,getDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytesResumable,getDownloadURL} from 'firebase/storage';
import {TodoItem} from "./model";
const firebaseConfig = {
    apiKey: "AIzaSyBMSoZx3K2do2ideF1LZwh046lCY90C0TM",
    authDomain: "cruze-bac4d.firebaseapp.com",
    databaseURL: "https://cruze-bac4d-default-rtdb.firebaseio.com",
    projectId: "cruze-bac4d",
    storageBucket: "cruze-bac4d.appspot.com",
    messagingSenderId: "218113210389",
    appId: "1:218113210389:web:688b263714afc13b26b61c"
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore();
const firebaseStorage = getStorage(app);

export const getTodos = async () => {
    const todosCollection = collection(firestore, "todos");
    const todosSnapshot = await getDocs(todosCollection);
    return todosSnapshot.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        } as TodoItem;
    });
}

export const getTodo = async (id: string) => {
    const todoDoc = doc(firestore, "todos", id);
    const todoSnapshot = await getDoc(todoDoc);
    return {
        id: todoSnapshot.id,
        ...todoSnapshot.data()
    } as TodoItem;
}

export const createTodo = (todo: TodoItem) => {
    return addDoc(collection(firestore, "todos"), todo);
}

export const updateTodo = (id: string, todo: Partial<TodoItem>) => {
    const todoDoc = doc(firestore, "todos", id);
    return updateDoc(todoDoc, todo);
}

export const removeTodo = (id: string) => {
    const todoDoc = doc(firestore, "todos", id);
    return deleteDoc(todoDoc);
}

export const saveImage = async (filePath: string) => {
    const result = await fetch(filePath);
    const imageName = Date.now() + '.jpg';
    const imageBlob = await result.blob();
    const photoRef = ref(firebaseStorage, imageName);
    const res = await uploadBytesResumable(photoRef, imageBlob);
    return await getDownloadURL(res.ref);
}
