// augmenting TTP module - https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@tabletop-playground/api" {
  interface GameWorld {
    /**
     * Global variable for storing Eldritch Horror data
     */
    // it's assumed initGlobalObject() is executed as the very first thing,
    // as without ?. support I cannot be bothered to define this as optional :-/
    __eldritchHorror: EldritchHorrorGameWorld;
  }
}
