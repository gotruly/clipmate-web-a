import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

export const getPremiumStatus = async (app: FirebaseApp) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
  const q = query(subscriptionsRef, where("status", "in", ["trialing", "active"]));

  return new Promise<boolean>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // In this implementation we only expect one active or trialing subscription to exist.
        console.log("Subscription snapshot", snapshot.docs.length);
        if (snapshot.docs.length === 0) {
          console.log("No active or trialing subscriptions found");
          resolve(false);
        } else {
          console.log("Active or trialing subscription found");
          resolve(true);
        }
        unsubscribe();
      },
      reject
    );
  });
};

export const listenToPremiumStatus = (
  app: FirebaseApp,
  callback: (isPremium: boolean) => void,
  onError?: (error: Error) => void
) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) {
    if (onError) onError(new Error("User not logged in"));
    return;
  }

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
  const q = query(subscriptionsRef, where("status", "in", ["trialing", "active"]));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      // In this implementation we only expect one active or trialing subscription to exist.
      console.log("Subscription snapshot", snapshot.docs.length);
      if (snapshot.docs.length === 0) {
        console.log("No active or trialing subscriptions found");
        callback(false);
      } else {
        console.log("Active or trialing subscription found");
        callback(true);
      }
    },
    (error) => {
      console.error("Error fetching subscription status", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};
