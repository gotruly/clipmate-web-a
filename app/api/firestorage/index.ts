import { getDownloadURL, ref } from "firebase/storage";
import { Storage } from "../firebase";

const Firestorage = {
  async GetDownloadLink(url: string): Promise<string> {
    const StorageRef = ref(Storage, url);
    return getDownloadURL(StorageRef).then((res) => {
      return res;
    });
  },
};

export default Firestorage;
