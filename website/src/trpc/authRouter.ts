import { autoUserProcedure, publicProcedure, router } from "./base";

export const authRouter = router({
  testAutoUser: autoUserProcedure.mutation(async ({ ctx, input }) => {
    return "done";
  }),

  whoAmI: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user || null,
    };
  }),

  logOut: autoUserProcedure.mutation(async ({ ctx }) => {
    ctx.auth.invalidateUserSessions(ctx.user.id);
    return null;
  }),
});
