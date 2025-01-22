import { useMutation } from "@tanstack/react-query";
import FireAuth from "../fireauth";
import { User, onAuthStateChanged } from "firebase/auth";
import { Auth } from "../firebase";
import { use, useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FireFunction from "../firefunctions";
import {
  ResetPasswordSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
} from "@/schema/authentication";

const FireAuthHooks = {
  /**
   * useGoogleSignIn - hook for signing in with Google
   * @returns `UseMutationResult<T, unknown>`
   */
  useGoogleSignIn: () => {
    return useMutation({
      mutationFn: () => {
        return FireAuth.signInWithGoogle();
      },
    });
  },

  /**
   * useAppleSignIn - hook for signing in with Apple
   * @returns `UseMutationResult<T, unknown>`
   */
  useAppleSignIn: () => {
    return useMutation({
      mutationFn: () => {
        return FireAuth.signInWithApple();
      },
    });
  },

  /**
   * useEmailSignIn - hook for signing in with Email
   * @returns `UseMutationResult<T, unknown>`
   */
  useEmailSignIn: () => {
    return useMutation({
      mutationFn: (data: SignInSchemaType) => {
        return FireAuth.signInWithEmail(data.email, data.password);
      },
    });
  },

  /**
   * useEmailSignUp - hook for signing up with Email
   * @returns `UseMutationResult<T, unknown>`
   */
  useEmailSignUp: () => {
    return useMutation({
      mutationFn: (data: SignUpSchemaType) => {
        return FireAuth.signUpWithEmail(data);
      },
    });
  },

  /**
   * useSendPasswordResetEmail - hook for sending password reset email
   * @returns `UseMutationResult<T, unknown>`
   */
  useSendPasswordResetEmail: () => {
    return useMutation({
      mutationFn: (email: string) => {
        return FireAuth.sendPasswordResetLink(email);
      },
    });
  },

  /**
   * useResetPassword - hook for resetting password
   * @returns `UseMutationResult<T, unknown>`
   */
  useResetPassword: () => {
    return useMutation({
      mutationFn: (data: ResetPasswordSchemaType) => {
        return FireAuth.handleResetPassword(data);
      },
    });
  },

  /**
   * useGetUser - hook for returning if the current user
   * is authenticated
   */
  useGetUser: () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User>({} as User);

    useEffect(() => {
      onAuthStateChanged(Auth, (user) => {
        setUser(user as User);
        setIsLoading(false);
      });
    }, []);
    return { user: user, isLoading: isLoading };
  },

  /**
   * useIsUserAuth - hook for returning if the current user
   * is authenticated
   */
  useIsUserAuth: () => {
    const { push } = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const search = searchParams.get("extension-redirect");

    useLayoutEffect(() => {
      onAuthStateChanged(Auth, (user) => {
        if (user && search) {
          user.getIdToken().then(async (token) => {
            FireFunction.generateAndSendCustomToken({ token });
          });
        }
        if (!user && pathname === "/") push("/sign-in");
        if (user && pathname === "/sign-in") push("/");
      });
    }, [pathname, push, search]);
  },

  /**
   * useLogOut - hook for signing out of Firebase session
   */
  useLogOut: () => {
    return useMutation({
      mutationFn: () => {
        return FireAuth.logoutUser();
      },
    });
  },
};

export default FireAuthHooks;
