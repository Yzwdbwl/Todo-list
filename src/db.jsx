// db.js
// W07 - This file is all new
import Dexie from "dexie"; // 1à Note install and imports.
import { useLiveQuery } from "dexie-react-hooks"; // 1à Note install and imports.
export const db = new Dexie("todo-photos"); // 2à The database is created here.
db.version(1).stores({ // 3 à The table “photos” will contain just and id attribute.
 photos: "id", // Primary key, don't index photos.
 // Why? See https://dexie.org/docs/Version/Version.stores()#warning
});
async function addPhoto(id, imgSrc) { // 4 à To save a photo, the id will be passed as prop
 console.log("addPhoto", imgSrc.length, id);
  try {
    // Add the new photo with id used as key for todo array in localStoarge
    // to avoid having a second pk for one todo item
    const i = await db.photos.add({
      id: id,
      imgSrc: imgSrc,
    });
    console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
  return (
    <>
      <p>
        {imgSrc.length} &nbsp; | &nbsp; {id}
      </p>
    </>
  );
}

function GetPhotoSrc(id) {
  console.log("getPhotoSrc", id);
  const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
  console.table(img);
  if (Array.isArray(img)) return img[0].imgSrc;
}

export { addPhoto, GetPhotoSrc };
