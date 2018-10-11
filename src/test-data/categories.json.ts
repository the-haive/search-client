// This is a dummy file that fixes the typescript problem with understanding json imports.
// With this in place typescript believes that it is this file that is to be imported, but not when compiling, only for tslint.

import { ICategories } from "../Data/ICategories";

export default {} as ICategories;
