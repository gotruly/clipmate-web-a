import {
  GoogleAuthProvider,
  OAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { Auth } from "../firebase";
import FireFunction from "../firefunctions";
import { ResetPasswordSchemaType, SignUpSchemaType } from "@/schema/authentication";

// Setting Up Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Setting up Apple Auth Provider
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("profile");
appleProvider.addScope("email");

const FireAuth = {
  async signInWithGoogle() {
    return setPersistence(Auth, browserLocalPersistence).then(async () => {
      return await signInWithPopup(Auth, googleProvider)
        .then(async (result) => {
          await result.user.getIdToken().then(async (token) => {
            await FireFunction.generateAndSendCustomToken({ token });
          });

          return { user: result.user };
        })
        .catch((error) => {
          throw new Error(error.message, error);
        });
    });
  },

  async signInWithApple() {
    return setPersistence(Auth, browserLocalPersistence).then(async () => {
      return await signInWithPopup(Auth, appleProvider)
        .then((result) => {
          return { user: result.user };
        })
        .catch((error) => {
          throw new Error(error.message, error);
        });
    });
  },

  async signInWithEmail(email: string, password: string) {
    return setPersistence(Auth, browserLocalPersistence).then(async () => {
      return await signInWithEmailAndPassword(Auth, email, password)
        .then(async (result) => {
          await result.user.getIdToken().then(async (token) => {
            await FireFunction.generateAndSendCustomToken({ token });
          });

          return { user: result.user };
        })
        .catch((error) => {
          throw new Error(error.message, error);
        });
    });
  },

  async signUpWithEmail(data: SignUpSchemaType) {
    return setPersistence(Auth, browserLocalPersistence).then(async () => {
      return await createUserWithEmailAndPassword(Auth, data.email, data.password)
        .then(async (result) => {
          return await updateProfile(result.user, { displayName: data.name })
            .then(() => {
              return { user: result.user };
            })
            .catch((error) => {
              throw new Error(error.message, error);
            });
        })
        .catch((error) => {
          throw new Error(error.message, error);
        });
    });
  },

  async sendPasswordResetLink(email: string) {
    return sendPasswordResetEmail(Auth, email)
      .then(() => {
        return;
      })
      .catch((error) => {
        throw new Error(error.message, error);
      });
  },

  async handleResetPassword(data: ResetPasswordSchemaType) {
    return verifyPasswordResetCode(Auth, data.oobCode)
      .then(async (res) => {
        return await confirmPasswordReset(Auth, data.oobCode, data.password)
          .then(() => {
            return;
          })
          .catch((error) => {
            throw new Error(error.message, error);
          });
      })
      .catch((error) => {
        throw new Error(error.message, error);
      });
  },

  /**
   * Logs out the current user
   * @returns `Promise<void>`
   */
  async logoutUser() {
    return await signOut(Auth)
      .then(() => {
        return;
      })
      .catch((error) => {
        throw new Error(error.message, error);
      });
  },
};

export default FireAuth;
