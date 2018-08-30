// This is a dummy file that fixes the typescript problem with understanding json imports.
// With this in place typescript believes that it is this file that is to be imported, but not when compiling, only for tslint.

import { Categories } from "../Data/Categories";

export default {} as Categories;
