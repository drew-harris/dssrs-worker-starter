import { router } from "./base";
import { authRouter } from "./authRouter";

export const appRouter = router({
  auth: authRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
